-- 005_parent_pin.sql
-- Adds a per-parent PIN to gate the parent dashboard on shared devices.

create extension if not exists pgcrypto;

create table if not exists parent_pins (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  pin_hash         text not null,
  pin_attempts     int not null default 0,
  pin_locked_until timestamptz
);

alter table parent_pins enable row level security;

create policy "parent can manage own pin row"
  on parent_pins
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- verify_parent_pin: checks the PIN for auth.uid(). Same 5-attempt / 60s
-- lockout logic as verify_child_pin.
create or replace function verify_parent_pin(p_pin text)
returns table (ok boolean, locked_until timestamptz)
language plpgsql security definer
set search_path = public, extensions
as $$
declare
  v_pin_hash       text;
  v_attempts       int;
  v_locked_until   timestamptz;
  v_new_attempts   int;
  v_new_locked     timestamptz;
begin
  select pin_hash, pin_attempts, pin_locked_until
    into v_pin_hash, v_attempts, v_locked_until
    from parent_pins where user_id = auth.uid();

  if not found or v_pin_hash is null then
    return query select false, null::timestamptz;
    return;
  end if;

  if v_locked_until is not null and v_locked_until > now() then
    return query select false, v_locked_until;
    return;
  end if;

  if v_pin_hash = crypt(p_pin, v_pin_hash) then
    update parent_pins
      set pin_attempts = 0, pin_locked_until = null
      where user_id = auth.uid();
    return query select true, null::timestamptz;
  else
    v_new_attempts := v_attempts + 1;
    if v_new_attempts >= 5 then
      v_new_locked := now() + interval '60 seconds';
      update parent_pins
        set pin_attempts = 0, pin_locked_until = v_new_locked
        where user_id = auth.uid();
    else
      v_new_locked := null;
      update parent_pins
        set pin_attempts = v_new_attempts
        where user_id = auth.uid();
    end if;
    return query select false, v_new_locked;
  end if;
end;
$$;

revoke all on function verify_parent_pin(text) from public;
grant execute on function verify_parent_pin(text) to authenticated;

-- set_parent_pin: bcrypt-hashes and upserts the PIN for auth.uid().
-- Validates 4-digit format, clears attempts and lockout.
create or replace function set_parent_pin(p_pin text)
returns void
language plpgsql security definer
set search_path = public, extensions
as $$
begin
  if p_pin !~ '^[0-9]{4}$' then
    raise exception 'invalid pin format';
  end if;
  insert into parent_pins (user_id, pin_hash, pin_attempts, pin_locked_until)
    values (
      auth.uid(),
      crypt(p_pin, gen_salt('bf')),
      0,
      null
    )
    on conflict (user_id) do update
      set pin_hash         = crypt(p_pin, gen_salt('bf')),
          pin_attempts     = 0,
          pin_locked_until = null;
end;
$$;

revoke all on function set_parent_pin(text) from public;
grant execute on function set_parent_pin(text) to authenticated;
