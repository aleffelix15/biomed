-- Restore foreign keys dynamically where columns exist
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['user_progress', 'study_sessions', 'study_plans', 'flashcards', 'topics', 'questions', 'modules', 'books']
  LOOP
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t AND column_name = 'discipline_id') THEN
          EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES public.disciplines(id) ON DELETE CASCADE;', t, t);
      END IF;
  END LOOP;
END $$;
