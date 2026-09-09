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

-- =============================================================
-- Módulos (Agrupamentos dentro de um Tópico/Assunto)
-- =============================================================
CREATE TABLE IF NOT EXISTS modules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id text REFERENCES topics(id) ON DELETE CASCADE,
    title text NOT NULL,
    order_index int DEFAULT 0
);

-- =============================================================
-- Aulas (Conteúdo base de estudo dentro de um módulo)
-- =============================================================
CREATE TABLE IF NOT EXISTS lessons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    title text NOT NULL,
    objective text,
    difficulty text,
    estimated_minutes int DEFAULT 10,
    content_markdown text,
    clinical_application text,
    summary text,
    key_points jsonb,
    order_index int DEFAULT 0
);

-- =============================================================
-- Progresso de Aulas (Status de conclusão por usuário)
-- =============================================================
CREATE TABLE IF NOT EXISTS lesson_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
    completed boolean DEFAULT false,
    completed_at timestamptz,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own lesson progress"
    ON lesson_progress FOR ALL
    USING (auth.uid() = user_id);

-- =============================================================
-- Planos de Estudo (Progresso global de um Assunto/Tópico)
-- =============================================================
CREATE TABLE IF NOT EXISTS study_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id text REFERENCES topics(id) ON DELETE CASCADE,
    status text DEFAULT 'in_progress',
    percent_complete int DEFAULT 0,
    last_lesson_id uuid REFERENCES lessons(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, topic_id)
);

ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own study plans"
    ON study_plans FOR ALL
    USING (auth.uid() = user_id);

-- =============================================================
-- Ajuste em tabelas de Questões para suportar Quizzes de Aula
-- Assume-se que 'questions' existe. Se não, adicione.
-- =============================================================
-- =============================================================
-- Ajuste em tabelas de Questões para suportar Quizzes de Aula
-- =============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='questions' AND column_name='lesson_id') THEN
        ALTER TABLE questions ADD COLUMN lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE;
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        CREATE TABLE questions (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            discipline_id text REFERENCES disciplines(id),
            topic_id text REFERENCES topics(id),
            lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
            question text NOT NULL,
            option_a text NOT NULL,
            option_b text NOT NULL,
            option_c text NOT NULL,
            option_d text NOT NULL,
            option_e text NOT NULL,
            correct_option char(1) NOT NULL,
            explanation text,
            difficulty text,
            source text
        );
END $$;

CREATE TABLE IF NOT EXISTS question_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
    selected_option char(1),
    is_correct boolean,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own attempts"
    ON question_attempts FOR ALL
    USING (auth.uid() = user_id);

