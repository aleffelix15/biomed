-- Converter UUIDs para Text nas tabelas onde ainda estao como UUID
-- Isso permite salvar slugs literais como "les_ac_1_1"

-- 1. lesson_progress
ALTER TABLE IF EXISTS lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_lesson_id_fkey;
ALTER TABLE IF EXISTS lesson_progress ALTER COLUMN lesson_id TYPE text USING lesson_id::text;

-- 2. study_plans
ALTER TABLE IF EXISTS study_plans DROP CONSTRAINT IF EXISTS study_plans_last_lesson_id_fkey;
ALTER TABLE IF EXISTS study_plans ALTER COLUMN last_lesson_id TYPE text USING last_lesson_id::text;

-- 3. question_attempts (caso esteja rodando o schema.sql onde é uuid)
ALTER TABLE IF EXISTS question_attempts DROP CONSTRAINT IF EXISTS question_attempts_question_id_fkey;
ALTER TABLE IF EXISTS question_attempts ALTER COLUMN question_id TYPE text USING question_id::text;

