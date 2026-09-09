-- =============================================================================
-- BIOSTUDY DATABASE SCHEMA V1
-- This script implements the full structural requirements for the BioStudy app.
-- Run this in the Supabase SQL Editor.
-- =============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ACADEMIC CONTENT (Public/Read-only for Auth Users)

-- Disciplines
CREATE TABLE IF NOT EXISTS disciplines (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    icon text,
    category text,
    topics_count int DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Topics
CREATE TABLE IF NOT EXISTS topics (
    id text PRIMARY KEY,
    discipline_id text REFERENCES disciplines(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    content text, -- Markdown content
    order_index int DEFAULT 0,
    has_content boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Books
CREATE TABLE IF NOT EXISTS books (
    id text PRIMARY KEY,
    discipline_id text REFERENCES disciplines(id) ON DELETE CASCADE,
    title text NOT NULL,
    author text,
    edition text,
    level text,
    description text,
    cover_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. USER DATA (Private - RLS Protected)

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    email text,
    course text,
    period text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Progress (Aggregate per discipline)
CREATE TABLE IF NOT EXISTS user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    discipline_id text REFERENCES disciplines(id) ON DELETE CASCADE NOT NULL,
    percent_complete int DEFAULT 0,
    hours_studied numeric DEFAULT 0,
    questions_answered int DEFAULT 0,
    correct_answers int DEFAULT 0,
    accuracy_rate numeric DEFAULT 0,
    last_studied_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, discipline_id)
);

-- Topic Progress (Granular completion)
CREATE TABLE IF NOT EXISTS topic_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    topic_id text REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
    completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, topic_id)
);

-- Study Sessions
CREATE TABLE IF NOT EXISTS study_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    discipline_id text REFERENCES disciplines(id) ON DELETE SET NULL,
    topic_id text REFERENCES topics(id) ON DELETE SET NULL,
    started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    finished_at timestamp with time zone,
    duration_seconds int,
    session_type text, -- 'study', 'review', 'exam'
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Favorites
CREATE TABLE IF NOT EXISTS favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    item_type text NOT NULL, -- 'book', 'topic', 'lab_section'
    item_id text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_type, item_id)
);

-- 4. STUDY TOOLS

-- Flashcards
CREATE TABLE IF NOT EXISTS flashcards (
    id text PRIMARY KEY,
    discipline_id text REFERENCES disciplines(id) ON DELETE CASCADE,
    topic_id text REFERENCES topics(id) ON DELETE CASCADE,
    question text NOT NULL,
    answer text NOT NULL,
    difficulty text, -- 'easy', 'medium', 'hard'
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Flashcard Progress (SRS)
CREATE TABLE IF NOT EXISTS user_flashcard_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    flashcard_id text REFERENCES flashcards(id) ON DELETE CASCADE NOT NULL,
    status text, -- 'new', 'learning', 'review'
    repetitions int DEFAULT 0,
    next_review_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    last_reviewed_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, flashcard_id)
);

-- Questions
CREATE TABLE IF NOT EXISTS questions (
    id text PRIMARY KEY,
    discipline_id text REFERENCES disciplines(id) ON DELETE CASCADE,
    topic_id text REFERENCES topics(id) ON DELETE CASCADE,
    question text NOT NULL,
    option_a text NOT NULL,
    option_b text NOT NULL,
    option_c text NOT NULL,
    option_d text NOT NULL,
    option_e text,
    correct_option text NOT NULL,
    explanation text,
    difficulty text,
    source text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Question Attempts
CREATE TABLE IF NOT EXISTS question_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    question_id text REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
    selected_option text,
    is_correct boolean,
    answered_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Books
CREATE TABLE IF NOT EXISTS user_books (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    book_id text REFERENCES books(id) ON DELETE CASCADE NOT NULL,
    favorite boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, book_id)
);

-- Study Streaks
CREATE TABLE IF NOT EXISTS study_streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    study_date date NOT NULL,
    minutes_studied int DEFAULT 0,
    UNIQUE(user_id, study_date)
);

-- 5. AUTOMATION (Triggers)

-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_topic_progress_updated_at BEFORE UPDATE ON topic_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_flashcard_progress_updated_at BEFORE UPDATE ON user_flashcard_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
