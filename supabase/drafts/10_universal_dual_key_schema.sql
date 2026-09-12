-- ====================================================================================
-- BIOSTUDY - ARQUITETURA DE IDENTIDADE DUPLA (UUID + SLUG) E PROGRESSO AGREGADO
-- Hierarquia: Discipline -> Module -> Topic -> Lesson -> Question
-- ====================================================================================

-- 1. Disciplinas
CREATE TABLE IF NOT EXISTS public.disciplines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Módulos
CREATE TABLE IF NOT EXISTS public.modules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline_id uuid REFERENCES public.disciplines(id) ON DELETE CASCADE,
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    "order" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Tópicos
CREATE TABLE IF NOT EXISTS public.topics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id uuid REFERENCES public.modules(id) ON DELETE CASCADE,
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    "order" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Aulas
CREATE TABLE IF NOT EXISTS public.lessons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id uuid REFERENCES public.topics(id) ON DELETE CASCADE,
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    content text, -- JSONB se for usar editor Rich Text futuramente
    "order" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 5. Questões (Integrado com "Estudar")
CREATE TABLE IF NOT EXISTS public.questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE,
    slug text UNIQUE NOT NULL,
    type text NOT NULL DEFAULT 'multiple_choice', -- 'multiple_choice', 'clinical_case', etc.
    content text NOT NULL,
    options jsonb NOT NULL,
    correct_option_index integer NOT NULL,
    explanation text,
    created_at timestamp with time zone DEFAULT now()
);

-- 6. Progresso (Tracking Transacional)
CREATE TABLE IF NOT EXISTS public.lesson_completions (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (user_id, lesson_id)
);

-- 7. View Agregada de Progresso (Calcula % real e persistente)
CREATE OR REPLACE VIEW public.user_discipline_progress AS
SELECT 
    lc.user_id,
    d.id as discipline_id,
    d.slug as discipline_slug,
    COUNT(DISTINCT lc.lesson_id) as lessons_completed,
    (
        SELECT COUNT(l.id) 
        FROM public.lessons l 
        JOIN public.topics t ON l.topic_id = t.id 
        JOIN public.modules m ON t.module_id = m.id 
        WHERE m.discipline_id = d.id
    ) as total_lessons,
    CASE 
        WHEN (
            SELECT COUNT(l.id) 
            FROM public.lessons l 
            JOIN public.topics t ON l.topic_id = t.id 
            JOIN public.modules m ON t.module_id = m.id 
            WHERE m.discipline_id = d.id
        ) > 0 
        THEN ROUND(
            COUNT(DISTINCT lc.lesson_id)::numeric / 
            (
                SELECT COUNT(l.id) 
                FROM public.lessons l 
                JOIN public.topics t ON l.topic_id = t.id 
                JOIN public.modules m ON t.module_id = m.id 
                WHERE m.discipline_id = d.id
            )::numeric * 100
        )
        ELSE 0 
    END as progress_percent
FROM public.lesson_completions lc
JOIN public.lessons l ON lc.lesson_id = l.id
JOIN public.topics t ON l.topic_id = t.id
JOIN public.modules m ON t.module_id = m.id
JOIN public.disciplines d ON m.discipline_id = d.id
GROUP BY lc.user_id, d.id, d.slug;

