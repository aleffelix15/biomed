create table disciplines (
  id text primary key,
  name text,
  icon text,
  category text,
  topics_count int
);

create table topics (
  id text primary key,
  discipline_id text references disciplines(id),
  title text,
  status text,
  has_content boolean default false,
  content_md text
);

create table books (
  id text primary key,
  discipline_id text references disciplines(id),
  title text,
  author text,
  edition text,
  level text,
  description text
);

create table user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  discipline_id text references disciplines(id),
  percent_complete int,
  hours_studied numeric,
  questions_answered int,
  accuracy_rate numeric
);
