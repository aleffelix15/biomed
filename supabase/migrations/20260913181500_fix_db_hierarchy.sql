-- Migration to realign DB hierarchy with Frontend (Discipline -> Topic -> Module -> Lesson)

-- 0. Dropar views dependentes para permitir a troca das colunas
DROP VIEW IF EXISTS public.user_discipline_progress CASCADE;
DROP VIEW IF EXISTS public.leaderboard_view CASCADE;

-- 1. TOPICS: Removendo module_id e adicionando discipline_id
ALTER TABLE IF EXISTS public.topics DROP CONSTRAINT IF EXISTS topics_module_id_fkey;
ALTER TABLE IF EXISTS public.topics DROP COLUMN IF EXISTS module_id CASCADE;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='topics' AND column_name='discipline_id') THEN
        ALTER TABLE public.topics ADD COLUMN discipline_id text REFERENCES public.disciplines(id) ON DELETE CASCADE;
    END IF;
END $$;


-- 2. MODULES: Removendo discipline_id e adicionando topic_id
ALTER TABLE IF EXISTS public.modules DROP CONSTRAINT IF EXISTS modules_discipline_id_fkey;
ALTER TABLE IF EXISTS public.modules DROP COLUMN IF EXISTS discipline_id CASCADE;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='modules' AND column_name='topic_id') THEN
        ALTER TABLE public.modules ADD COLUMN topic_id uuid REFERENCES public.topics(id) ON DELETE CASCADE;
    END IF;
END $$;


-- 3. LESSONS: Removendo topic_id e adicionando module_id
ALTER TABLE IF EXISTS public.lessons DROP CONSTRAINT IF EXISTS lessons_topic_id_fkey;
ALTER TABLE IF EXISTS public.lessons DROP COLUMN IF EXISTS topic_id CASCADE;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='module_id') THEN
        ALTER TABLE public.lessons ADD COLUMN module_id uuid REFERENCES public.modules(id) ON DELETE CASCADE;
    END IF;
END $$;


-- 4. QUESTIONS: Removendo colunas antigas
ALTER TABLE IF EXISTS public.questions DROP COLUMN IF EXISTS type CASCADE;
ALTER TABLE IF EXISTS public.questions DROP COLUMN IF EXISTS content CASCADE;
ALTER TABLE IF EXISTS public.questions DROP COLUMN IF EXISTS options CASCADE;
ALTER TABLE IF EXISTS public.questions DROP COLUMN IF EXISTS correct_option_index CASCADE;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='questions' AND column_name='question') THEN
        ALTER TABLE public.questions ADD COLUMN question text;
        ALTER TABLE public.questions ADD COLUMN option_a text;
        ALTER TABLE public.questions ADD COLUMN option_b text;
        ALTER TABLE public.questions ADD COLUMN option_c text;
        ALTER TABLE public.questions ADD COLUMN option_d text;
        ALTER TABLE public.questions ADD COLUMN option_e text;
        ALTER TABLE public.questions ADD COLUMN correct_option char(1);
    END IF;
END $$;

-- 5. Recriar View de Progresso
CREATE OR REPLACE VIEW public.user_discipline_progress AS
SELECT lc.user_id,
    d.id AS discipline_id,
    d.slug AS discipline_slug,
    count(DISTINCT lc.lesson_id) AS lessons_completed,
    ( SELECT count(l_1.id) AS count
           FROM public.lessons l_1
             JOIN public.modules m_1 ON l_1.module_id = m_1.id
             JOIN public.topics t_1 ON m_1.topic_id = t_1.id
          WHERE t_1.discipline_id = d.id
    ) AS total_lessons,
    CASE
        WHEN ( SELECT count(l_1.id) AS count
               FROM public.lessons l_1
                 JOIN public.modules m_1 ON l_1.module_id = m_1.id
                 JOIN public.topics t_1 ON m_1.topic_id = t_1.id
              WHERE t_1.discipline_id = d.id
        ) > 0 THEN 
        round((count(DISTINCT lc.lesson_id)::numeric / 
            ( SELECT count(l_1.id) AS count
               FROM public.lessons l_1
                 JOIN public.modules m_1 ON l_1.module_id = m_1.id
                 JOIN public.topics t_1 ON m_1.topic_id = t_1.id
              WHERE t_1.discipline_id = d.id
            )::numeric
        ) * 100::numeric)
        ELSE 0::numeric
    END AS progress_percent
-- O JOIN AGORA USA l.slug POIS lesson_progress.lesson_id FOI CONVERTIDO PARA TEXTO NA MIGRATION 20260912133417
FROM public.lesson_progress lc
JOIN public.lessons l ON lc.lesson_id = l.slug
JOIN public.modules m ON l.module_id = m.id
JOIN public.topics t ON m.topic_id = t.id
JOIN public.disciplines d ON t.discipline_id = d.id
WHERE lc.completed = true
GROUP BY lc.user_id, d.id, d.slug;

-- 6. Recarregar o cache do PostgREST
NOTIFY pgrst, 'reload schema';
