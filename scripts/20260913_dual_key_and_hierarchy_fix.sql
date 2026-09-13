-- BioStudy: Disciplines & Lab 2.0 - Dual-Key & Hierarchy Fix
-- Este script resolve a inversão de hierarquia (Modules/Topics) e migra disciplines.id para UUID.

BEGIN;

-- 1. Remover Foreign Keys existentes para evitar restrições durante a migração
ALTER TABLE IF EXISTS public.modules DROP CONSTRAINT IF EXISTS modules_discipline_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.topics DROP CONSTRAINT IF EXISTS topics_module_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.lessons DROP CONSTRAINT IF EXISTS lessons_topic_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.questions DROP CONSTRAINT IF EXISTS questions_lesson_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.questions DROP CONSTRAINT IF EXISTS questions_module_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.questions DROP CONSTRAINT IF EXISTS questions_topic_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.user_progress DROP CONSTRAINT IF EXISTS user_progress_discipline_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.user_progress DROP CONSTRAINT IF EXISTS user_progress_module_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.user_progress DROP CONSTRAINT IF EXISTS user_progress_topic_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.user_progress DROP CONSTRAINT IF EXISTS user_progress_lesson_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.flashcards DROP CONSTRAINT IF EXISTS flashcards_discipline_id_fkey CASCADE;

-- 2. Renomear tabelas para corrigir a inversão (Topics <-> Modules)
-- Atualmente, a tabela 'modules' contém os dados de tópicos, e 'topics' contém os dados de módulos.
ALTER TABLE public.topics RENAME TO modules_temp;
ALTER TABLE public.modules RENAME TO topics;
ALTER TABLE public.modules_temp RENAME TO modules;

-- 3. Renomear colunas para refletir a nova hierarquia correta
-- O antigo 'module_id' (agora na tabela modules) passa a ser 'topic_id'
ALTER TABLE public.modules RENAME COLUMN module_id TO topic_id;
-- O antigo 'topic_id' (na tabela lessons) passa a ser 'module_id'
ALTER TABLE public.lessons RENAME COLUMN topic_id TO module_id;

-- 4. Migrar a tabela disciplines para usar UUID como Primary Key e o antigo ID (texto) como slug
-- Adiciona coluna uuid (nova PK)
ALTER TABLE public.disciplines ADD COLUMN new_uuid UUID DEFAULT gen_random_uuid();
-- Move o id (texto) atual para a coluna slug, caso slug não exista ou esteja vazio
UPDATE public.disciplines SET slug = id WHERE slug IS NULL OR slug = '';

-- Atualiza referências textuais (temp_discipline_id) em topics para UUID
ALTER TABLE public.topics RENAME COLUMN discipline_id TO temp_discipline_id_text;
ALTER TABLE public.topics ADD COLUMN discipline_id UUID;
UPDATE public.topics t SET discipline_id = d.new_uuid FROM public.disciplines d WHERE t.temp_discipline_id_text = d.id;

-- O mesmo para user_progress e flashcards, caso tenham discipline_id (texto)
-- Adiciona novas colunas UUID
ALTER TABLE public.user_progress ADD COLUMN new_discipline_id UUID;
UPDATE public.user_progress u SET new_discipline_id = d.new_uuid FROM public.disciplines d WHERE u.discipline_id = d.id;

ALTER TABLE public.flashcards ADD COLUMN new_discipline_id UUID;
UPDATE public.flashcards f SET new_discipline_id = d.new_uuid FROM public.disciplines d WHERE f.discipline_id = d.id;

-- 5. Trocar a PK de disciplines
ALTER TABLE public.disciplines DROP CONSTRAINT disciplines_pkey CASCADE;
ALTER TABLE public.disciplines DROP COLUMN id;
ALTER TABLE public.disciplines RENAME COLUMN new_uuid TO id;
ALTER TABLE public.disciplines ADD PRIMARY KEY (id);

-- Tornar o slug UNIQUE NOT NULL
ALTER TABLE public.disciplines ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.disciplines ADD CONSTRAINT disciplines_slug_key UNIQUE (slug);

-- 6. Limpar colunas temporárias e recriar as FKs
ALTER TABLE public.topics DROP COLUMN temp_discipline_id_text;
ALTER TABLE public.topics ADD CONSTRAINT topics_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES public.disciplines(id) ON DELETE CASCADE;

ALTER TABLE public.modules ADD CONSTRAINT modules_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE CASCADE;

ALTER TABLE public.lessons ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;

ALTER TABLE public.questions ADD CONSTRAINT questions_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

-- Consertar user_progress
ALTER TABLE public.user_progress DROP COLUMN discipline_id;
ALTER TABLE public.user_progress RENAME COLUMN new_discipline_id TO discipline_id;
ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES public.disciplines(id) ON DELETE CASCADE;
ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE CASCADE;
ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;
ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

-- Consertar flashcards
ALTER TABLE public.flashcards DROP COLUMN discipline_id;
ALTER TABLE public.flashcards RENAME COLUMN new_discipline_id TO discipline_id;
ALTER TABLE public.flashcards ADD CONSTRAINT flashcards_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES public.disciplines(id) ON DELETE CASCADE;

-- 7. Assegurar UNIQUE slug em todas as tabelas hierárquicas
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT unnest(ARRAY['topics', 'modules', 'lessons', 'questions'])
    LOOP
        EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I_slug_key;', tbl, tbl);
        EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I_slug_key UNIQUE (slug);', tbl, tbl);
    END LOOP;
END
$$;

-- 8. Limpar questions.module_id e questions.topic_id (não deveriam existir desnormalizados se o RLS não exigir)
-- Para simplificar a hierarquia, mantemos apenas lesson_id. Mas se for necessário para as queries do App, 
-- deixaremos as colunas, embora devam apontar para as chaves corretas.
-- Como invertemos topics/modules, precisamos inverter aqui também caso sejam populados.
ALTER TABLE public.questions RENAME COLUMN topic_id TO temp_topic_id;
ALTER TABLE public.questions RENAME COLUMN module_id TO topic_id;
ALTER TABLE public.questions RENAME COLUMN temp_topic_id TO module_id;

-- 9. Recreate user_discipline_progress view with correct hierarchy
DROP VIEW IF EXISTS public.user_discipline_progress CASCADE;

CREATE OR REPLACE VIEW public.user_discipline_progress AS
  SELECT lc.user_id,
      d.id AS discipline_id,
      d.slug AS discipline_slug,
      count(DISTINCT lc.lesson_id) AS lessons_completed,
      ( SELECT count(l_1.id) AS count
             FROM ((public.lessons l_1
               JOIN public.modules m_1 ON ((l_1.module_id = m_1.id)))
               JOIN public.topics t_1 ON ((m_1.topic_id = t_1.id)))
            WHERE (t_1.discipline_id = d.id)) AS total_lessons,
          CASE
              WHEN (( SELECT count(l_1.id) AS count
                 FROM ((public.lessons l_1
                   JOIN public.modules m_1 ON ((l_1.module_id = m_1.id)))
                   JOIN public.topics t_1 ON ((m_1.topic_id = t_1.id)))
                WHERE (t_1.discipline_id = d.id)) > 0) THEN round((((count(DISTINCT lc.lesson_id))::numeric / (( SELECT count(l_1.id) AS count
                 FROM ((public.lessons l_1
                   JOIN public.modules m_1 ON ((l_1.module_id = m_1.id)))
                   JOIN public.topics t_1 ON ((m_1.topic_id = t_1.id)))
                WHERE (t_1.discipline_id = d.id)))::numeric)) * (100)::numeric))
              ELSE (0)::numeric
          END AS progress_percent
     FROM (((public.lesson_progress lc
       JOIN public.lessons l ON ((lc.lesson_id = l.id)))
       JOIN public.modules m ON ((l.module_id = m.id)))
       JOIN public.topics t ON ((m.topic_id = t.id)))
       JOIN public.disciplines d ON ((t.discipline_id = d.id))
  WHERE (lc.completed = true)
  GROUP BY lc.user_id, d.id, d.slug;

COMMIT;

