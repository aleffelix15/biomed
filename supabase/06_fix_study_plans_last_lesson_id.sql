-- Corrige o tipo de last_lesson_id em study_plans para aceitar IDs de
-- conteúdo local (strings como "les_g1_1"), que não são UUID.
ALTER TABLE IF EXISTS study_plans
  DROP CONSTRAINT IF EXISTS study_plans_last_lesson_id_fkey;

ALTER TABLE study_plans
  ALTER COLUMN last_lesson_id TYPE text USING last_lesson_id::text;

-- Reafirma (idempotente) as correções de scripts/05_fix_local_content_ids.sql,
-- caso ainda não tenham sido aplicadas neste ambiente:
ALTER TABLE IF EXISTS lesson_progress
  DROP CONSTRAINT IF EXISTS lesson_progress_lesson_id_fkey;
ALTER TABLE lesson_progress
  ALTER COLUMN lesson_id TYPE text USING lesson_id::text;

ALTER TABLE IF EXISTS question_attempts
  DROP CONSTRAINT IF EXISTS question_attempts_question_id_fkey;
ALTER TABLE question_attempts
  ALTER COLUMN question_id TYPE text USING question_id::text;

ALTER TABLE flashcards
  ALTER COLUMN id TYPE text USING id::text;
