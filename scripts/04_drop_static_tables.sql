-- 04_drop_static_tables.sql
-- Drop de restrições (Foreign Keys) nas tabelas dinâmicas que apontavam para as estáticas.

ALTER TABLE IF EXISTS user_progress DROP CONSTRAINT IF EXISTS user_progress_discipline_id_fkey;
ALTER TABLE IF EXISTS topic_progress DROP CONSTRAINT IF EXISTS topic_progress_topic_id_fkey;
ALTER TABLE IF EXISTS lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_lesson_id_fkey;
ALTER TABLE IF EXISTS study_plans DROP CONSTRAINT IF EXISTS study_plans_topic_id_fkey;
ALTER TABLE IF EXISTS question_attempts DROP CONSTRAINT IF EXISTS question_attempts_question_id_fkey;
ALTER TABLE IF EXISTS books DROP CONSTRAINT IF EXISTS books_discipline_id_fkey;
ALTER TABLE IF EXISTS flashcards DROP CONSTRAINT IF EXISTS flashcards_discipline_id_fkey;
ALTER TABLE IF EXISTS flashcards DROP CONSTRAINT IF EXISTS flashcards_topic_id_fkey;

-- Drop das tabelas estáticas (O conteúdo agora é 100% local, em src/content/data/*.json)
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS disciplines CASCADE;
