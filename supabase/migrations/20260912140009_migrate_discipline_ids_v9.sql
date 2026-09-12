-- 0. Drop view so we can alter column safely
DROP VIEW IF EXISTS public.user_discipline_progress CASCADE;

DO $$
DECLARE
  rec RECORD;
  t text;
BEGIN
  -- 0.1 Drop any foreign keys referencing disciplines.id dynamically
  FOR rec IN
      SELECT tc.table_name, tc.constraint_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'disciplines' AND ccu.column_name = 'id'
  LOOP
      EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I;', rec.table_name, rec.constraint_name);
  END LOOP;

  -- 0.2 Change UUIDs to TEXT for discipline_id in tables where it exists
  FOREACH t IN ARRAY ARRAY['user_progress', 'study_sessions', 'study_plans', 'flashcards', 'topics', 'questions', 'modules', 'books']
  LOOP
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t AND column_name = 'discipline_id') THEN
          EXECUTE format('ALTER TABLE public.%I ALTER COLUMN discipline_id TYPE text USING discipline_id::text;', t);
      END IF;
  END LOOP;

  -- 0.3 Change disciplines.id to text
  ALTER TABLE public.disciplines ALTER COLUMN id TYPE text USING id::text;

  -- 1. UPDATE child tables
  FOREACH t IN ARRAY ARRAY['user_progress', 'study_sessions', 'study_plans', 'flashcards', 'topics', 'questions', 'modules', 'books']
  LOOP
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t AND column_name = 'discipline_id') THEN
          EXECUTE format('UPDATE public.%I child SET discipline_id = d.slug FROM public.disciplines d WHERE child.discipline_id = d.id;', t);
      END IF;
  END LOOP;

  -- 2. UPDATE parent table
  UPDATE public.disciplines SET id = slug;

END $$;

-- 3. RECREATE VIEW
CREATE OR REPLACE VIEW public.user_discipline_progress AS
SELECT lc.user_id,
    d.id AS discipline_id,
    d.slug AS discipline_slug,
    count(DISTINCT lc.lesson_id) AS lessons_completed,
    ( SELECT count(l_1.id) AS count
           FROM ((public.lessons l_1
             JOIN public.topics t_1 ON ((l_1.topic_id = t_1.id)))
             JOIN public.modules m_1 ON ((t_1.module_id = m_1.id)))
          WHERE (m_1.discipline_id = d.id)) AS total_lessons,
        CASE
            WHEN (( SELECT count(l_1.id) AS count
               FROM ((public.lessons l_1
                 JOIN public.topics t_1 ON ((l_1.topic_id = t_1.id)))
                 JOIN public.modules m_1 ON ((t_1.module_id = m_1.id)))
              WHERE (m_1.discipline_id = d.id)) > 0) THEN round((((count(DISTINCT lc.lesson_id))::numeric / (( SELECT count(l_1.id) AS count
               FROM ((public.lessons l_1
                 JOIN public.topics t_1 ON ((l_1.topic_id = t_1.id)))
                 JOIN public.modules m_1 ON ((t_1.module_id = m_1.id)))
              WHERE (m_1.discipline_id = d.id)))::numeric) * (100)::numeric))
            ELSE (0)::numeric
        END AS progress_percent
   FROM ((((public.lesson_completions lc
     JOIN public.lessons l ON ((lc.lesson_id = l.id)))
     JOIN public.topics t ON ((l.topic_id = t.id)))
     JOIN public.modules m ON ((t.module_id = m.id)))
     JOIN public.disciplines d ON ((m.discipline_id = d.id)))
  GROUP BY lc.user_id, d.id, d.slug;
