-- Cosmic Adventure progress tracking
-- Tracks each child's position in the journey and their checkpoint attempts.

create table if not exists journey_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  current_topic_id text not null default 'space',
  current_location_index int not null default 0,
  completed_location_ids text[] not null default '{}',
  completed_topic_ids text[] not null default '{}',
  updated_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(child_id)
);

create table if not exists checkpoint_attempts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  topic_id text not null,
  score int not null,
  total int not null,
  passed boolean not null,
  attempted_at timestamptz default now()
);

alter table journey_progress enable row level security;
alter table checkpoint_attempts enable row level security;

create policy "Parents read own journey progress"
  on journey_progress for select
  using (child_id in (select id from children where parent_id = auth.uid()));

create policy "Parents upsert own journey progress"
  on journey_progress for insert
  with check (child_id in (select id from children where parent_id = auth.uid()));

create policy "Parents update own journey progress"
  on journey_progress for update
  using (child_id in (select id from children where parent_id = auth.uid()));

create policy "Parents read own checkpoint attempts"
  on checkpoint_attempts for select
  using (child_id in (select id from children where parent_id = auth.uid()));

create policy "Parents insert own checkpoint attempts"
  on checkpoint_attempts for insert
  with check (child_id in (select id from children where parent_id = auth.uid()));
