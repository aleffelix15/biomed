-- Migration to restore UUID foreign keys for progress tables

-- 1. lesson_progress
-- Convert text lesson_id back to UUID
ALTER TABLE IF EXISTS public.lesson_progress DROP COLUMN IF EXISTS lesson_id CASCADE;
ALTER TABLE IF EXISTS public.lesson_progress ADD COLUMN lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE;

-- 2. study_plans
ALTER TABLE IF EXISTS public.study_plans DROP COLUMN IF EXISTS last_lesson_id CASCADE;
ALTER TABLE IF EXISTS public.study_plans ADD COLUMN last_lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL;

-- 3. question_attempts
ALTER TABLE IF EXISTS public.question_attempts DROP COLUMN IF EXISTS question_id CASCADE;
ALTER TABLE IF EXISTS public.question_attempts ADD COLUMN question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE;

-- 4. flashcards
-- Ensure flashcards refer to questions properly if needed, but flashcard has its own PK.
-- The user prompt said: "NUNCA inserir: review_xxx em coluna UUID. Escolha uma solução compatível."
-- Wait, flashcards 'id' is currently UUID with gen_random_uuid().
-- But the frontend does `insert({ id: reviewId })` where `reviewId` is a string!
-- We need to change flashcards 'id' to text, OR make frontend NOT insert 'review_xxx'.
-- Frontend should just let the DB generate the UUID, and store the reference to the original question!
ALTER TABLE IF EXISTS public.flashcards ADD COLUMN IF NOT EXISTS original_question_id uuid REFERENCES public.questions(id) ON DELETE SET NULL;

-- Recarregar cache
NOTIFY pgrst, 'reload schema';

