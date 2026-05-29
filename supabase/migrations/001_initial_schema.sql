-- Create children table
create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age int,
  avatar_emoji text default '🧑',
  created_at timestamptz default now()
);

-- Create topics table
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  emoji text,
  display_order int,
  created_at timestamptz default now()
);

-- Create progress table
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  topic_id uuid not null references topics(id),
  lessons_completed int default 0,
  last_visited_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(child_id, topic_id)
);

-- Create sessions table
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  topic_id uuid references topics(id),
  started_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Create messages table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  role text not null check(role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Create usage tracking table for rate limiting
create table if not exists api_usage (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  date date not null default current_date,
  call_count int default 1,
  created_at timestamptz default now(),
  unique(child_id, date)
);

-- Enable Row-Level Security
alter table children enable row level security;
alter table progress enable row level security;
alter table sessions enable row level security;
alter table messages enable row level security;
alter table api_usage enable row level security;

-- RLS Policies for children
create policy "Parents can view their own children"
on children for select
using (parent_id = auth.uid());

create policy "Parents can insert their own children"
on children for insert
with check (parent_id = auth.uid());

create policy "Parents can update their own children"
on children for update
using (parent_id = auth.uid())
with check (parent_id = auth.uid());

create policy "Parents can delete their own children"
on children for delete
using (parent_id = auth.uid());

-- RLS Policies for progress
create policy "Parents can view their children's progress"
on progress for select
using (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
);

create policy "Parents can update their children's progress"
on progress for insert
with check (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
);

create policy "Parents can update progress records"
on progress for update
using (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
)
with check (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
);

-- RLS Policies for sessions
create policy "Parents can view their children's sessions"
on sessions for select
using (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
);

create policy "Parents can create sessions for their children"
on sessions for insert
with check (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
);

-- RLS Policies for messages
create policy "Parents can view their children's messages"
on messages for select
using (
  session_id in (
    select id from sessions where child_id in (
      select id from children where parent_id = auth.uid()
    )
  )
);

create policy "Parents can insert messages in their children's sessions"
on messages for insert
with check (
  session_id in (
    select id from sessions where child_id in (
      select id from children where parent_id = auth.uid()
    )
  )
);

-- RLS Policies for api_usage
create policy "Parents can view their children's api usage"
on api_usage for select
using (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
);

create policy "Parents can update their children's api usage"
on api_usage for insert
with check (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
);

create policy "Parents can update api usage records"
on api_usage for update
using (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
)
with check (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
);
