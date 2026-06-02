-- 004_kid_pin.sql
-- Adds per-child PIN authentication on top of the existing parent session model.

create extension if not exists pgcrypto;

alter table children
  add column if not exists pin_hash text,
  add column if not exists pin_attempts int not null default 0,
  add column if not exists pin_locked_until timestamptz;

create index if not exists children_pin_locked_until_idx
  on children (pin_locked_until)
  where pin_locked_until is not null;

-- verify_child_pin: returns ok=true if pin matches; on failure increments
-- attempts and sets a 60s lockout when attempts reach 5. Caller must be the
-- child's parent (auth.uid() = parent_id).
create or replace function verify_child_pin(p_child_id uuid, p_pin text)
returns table (ok boolean, locked_until timestamptz)
language plpgsql security definer
set search_path = public
as $$
declare
  v_parent_id uuid;
  v_pin_hash text;
  v_attempts int;
  v_locked_until timestamptz;
  v_new_attempts int;
  v_new_locked timestamptz;
begin
  select parent_id, pin_hash, pin_attempts, pin_locked_until
    into v_parent_id, v_pin_hash, v_attempts, v_locked_until
    from children where id = p_child_id;

  if not found or v_parent_id <> auth.uid() then
    return query select false, null::timestamptz;
    return;
  end if;

  if v_locked_until is not null and v_locked_until > now() then
    return query select false, v_locked_until;
    return;
  end if;

  if v_pin_hash is null then
    return query select false, null::timestamptz;
    return;
  end if;

  if v_pin_hash = crypt(p_pin, v_pin_hash) then
    update children set pin_attempts = 0, pin_locked_until = null
      where id = p_child_id;
    return query select true, null::timestamptz;
  else
    v_new_attempts := v_attempts + 1;
    if v_new_attempts >= 5 then
      v_new_locked := now() + interval '60 seconds';
      update children
        set pin_attempts = 0, pin_locked_until = v_new_locked
        where id = p_child_id;
    else
      v_new_locked := null;
      update children
        set pin_attempts = v_new_attempts
        where id = p_child_id;
    end if;
    return query select false, v_new_locked;
  end if;
end;
$$;

revoke all on function verify_child_pin(uuid, text) from public;
grant execute on function verify_child_pin(uuid, text) to authenticated;

-- set_child_pin: stores a bcrypt hash of the new PIN and clears attempts.
-- Caller must be the child's parent.
create or replace function set_child_pin(p_child_id uuid, p_new_pin text)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_parent_id uuid;
begin
  if p_new_pin !~ '^[0-9]{4}$' then
    raise exception 'invalid pin format';
  end if;
  select parent_id into v_parent_id from children where id = p_child_id;
  if not found or v_parent_id <> auth.uid() then
    raise exception 'forbidden';
  end if;
  update children
    set pin_hash = crypt(p_new_pin, gen_salt('bf')),
        pin_attempts = 0,
        pin_locked_until = null
    where id = p_child_id;
end;
$$;

revoke all on function set_child_pin(uuid, text) from public;
grant execute on function set_child_pin(uuid, text) to authenticated;
