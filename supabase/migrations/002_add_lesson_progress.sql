-- Create lesson_progress table for tracking lesson-level progress
create table if not exists lesson_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  current_step int default 0,
  steps_completed int default 0,
  checkpoint_attempts int default 0,
  last_attempted_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(child_id, topic_id)
);

-- Create index for performance on common queries
create index idx_lesson_progress_child_topic on lesson_progress(child_id, topic_id);

-- Enable Row-Level Security
alter table lesson_progress enable row level security;

-- RLS Policies for lesson_progress
create policy "Parents can view own children progress"
on lesson_progress for select
using (
  child_id in (
    select id from children where parent_id = auth.uid()
  )
);

create policy "Parents can update own children progress"
on lesson_progress for update
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

create policy "Service role can insert lesson progress"
on lesson_progress for insert
with check (true);
