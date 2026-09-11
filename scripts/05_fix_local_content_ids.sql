-- Scripts para corrigir IDs de conteúdo local no Supabase
-- Este script deve ser executado no SQL Editor do Supabase

-- 1. Remover constraints de chave estrangeira que apontam para tabelas deletadas
-- (Ajustar nomes de constraints se necessário, mas geralmente seguem o padrão tabelaname_columnname_fkey)

ALTER TABLE IF EXISTS lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_lesson_id_fkey;
ALTER TABLE IF EXISTS question_attempts DROP CONSTRAINT IF EXISTS question_attempts_question_id_fkey;
ALTER TABLE IF EXISTS flashcards DROP CONSTRAINT IF EXISTS flashcards_discipline_id_fkey;
ALTER TABLE IF EXISTS flashcards DROP CONSTRAINT IF EXISTS flashcards_topic_id_fkey;

-- 2. Alterar tipos de colunas de UUID para TEXT para suportar IDs locais (ex: "les_g1_1", "q_g1")
-- Utilizamos USING column::text para converter dados existentes sem perda.

ALTER TABLE lesson_progress
  ALTER COLUMN lesson_id TYPE text USING lesson_id::text;

ALTER TABLE question_attempts
  ALTER COLUMN question_id TYPE text USING question_id::text;

-- 3. Garantir que a tabela de flashcards suporte IDs determinísticos (como "review_q_g1")
-- Se a PK for UUID, precisamos convertê-la para TEXT.
ALTER TABLE flashcards
  ALTER COLUMN id TYPE text USING id::text;

-- 4. Limpeza de índices obsoletos (opcional, mas recomendado)
-- Se houver índices baseados nas FKs deletadas, eles devem ser removidos.
-- O administrador do DB pode verificar via \d table_name
