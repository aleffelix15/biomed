-- =============================================================
-- BioStudy — Schema completo
-- Execute no SQL Editor do painel do Supabase
-- =============================================================

-- =============================================================
-- Tabela de perfis de usuário
-- Criada automaticamente pelo AuthContext ao fazer login,
-- inclusive via Google OAuth (usa user_metadata do Supabase).
-- =============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    email text,
    course text,
    period text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Row Level Security: cada usuário só vê e edita o próprio perfil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- =============================================================
-- Disciplinas
-- =============================================================
CREATE TABLE IF NOT EXISTS disciplines (
    id text PRIMARY KEY,
    name text,
    icon text,
    category text,
    topics_count int
);

-- =============================================================
-- Tópicos
-- =============================================================
CREATE TABLE IF NOT EXISTS topics (
    id text PRIMARY KEY,
    discipline_id text REFERENCES disciplines(id),
    title text,
    status text,
    has_content boolean DEFAULT false
);

-- =============================================================
-- Livros
-- =============================================================
CREATE TABLE IF NOT EXISTS books (
    id text PRIMARY KEY,
    discipline_id text REFERENCES disciplines(id),
    title text,
    author text,
    edition text,
    level text,
    description text
);

-- =============================================================
-- Progresso do usuário por disciplina
-- =============================================================
CREATE TABLE IF NOT EXISTS user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    discipline_id text REFERENCES disciplines(id),
    percent_complete int DEFAULT 0,
    hours_studied numeric DEFAULT 0,
    questions_answered int DEFAULT 0,
    accuracy_rate numeric DEFAULT 0,
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
    ON user_progress FOR ALL
    USING (auth.uid() = user_id);

-- =============================================================
-- Progresso por tópico
-- =============================================================
CREATE TABLE IF NOT EXISTS topic_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id text REFERENCES topics(id),
    completed boolean DEFAULT false,
    completed_at timestamptz,
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own topic progress"
    ON topic_progress FOR ALL
    USING (auth.uid() = user_id);
