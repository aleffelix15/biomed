CREATE TABLE disciplines (
    id text PRIMARY KEY,
    name text,
    icon text,
    category text,
    topics_count int
);

CREATE TABLE topics (
    id text PRIMARY KEY,
    discipline_id text REFERENCES disciplines(id),
    title text,
    status text,
    has_content boolean DEFAULT false
);

CREATE TABLE books (
    id text PRIMARY KEY,
    discipline_id text REFERENCES disciplines(id),
    title text,
    author text,
    edition text,
    level text,
    description text
);

CREATE TABLE user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    discipline_id text REFERENCES disciplines(id),
    percent_complete int,
    hours_studied numeric,
    questions_answered int,
    accuracy_rate numeric
);
