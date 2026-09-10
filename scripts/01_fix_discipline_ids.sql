-- 1. Garante que as disciplinas corretas existem
INSERT INTO public.disciplines (id, name, icon, category, topics_count) VALUES
('bioquimica', 'Bioquímica', 'FlaskConical', 'Ciências Básicas', 0),
('anatomia', 'Anatomia', 'Bone', 'Ciências Básicas', 0),
('microbiologia', 'Microbiologia', 'Bug', 'Ciências Biomédicas', 0)
ON CONFLICT (id) DO NOTHING;

-- 2. Migra as referências das disciplinas antigas (órfãs/fake) para as corretas
-- BIOQUIMICA (d2 -> bioquimica)
UPDATE public.topics SET discipline_id = 'bioquimica' WHERE discipline_id = 'd2';
UPDATE public.flashcards SET discipline_id = 'bioquimica' WHERE discipline_id = 'd2';
UPDATE public.questions SET discipline_id = 'bioquimica' WHERE discipline_id = 'd2';
UPDATE public.books SET discipline_id = 'bioquimica' WHERE discipline_id = 'd2';
UPDATE public.user_progress SET discipline_id = 'bioquimica' WHERE discipline_id = 'd2';

-- ANATOMIA (d1 -> anatomia)
UPDATE public.topics SET discipline_id = 'anatomia' WHERE discipline_id = 'd1';
UPDATE public.flashcards SET discipline_id = 'anatomia' WHERE discipline_id = 'd1';
UPDATE public.questions SET discipline_id = 'anatomia' WHERE discipline_id = 'd1';
UPDATE public.books SET discipline_id = 'anatomia' WHERE discipline_id = 'd1';
UPDATE public.user_progress SET discipline_id = 'anatomia' WHERE discipline_id = 'd1';

-- MICROBIOLOGIA (d5 -> microbiologia)
UPDATE public.topics SET discipline_id = 'microbiologia' WHERE discipline_id = 'd5';
UPDATE public.flashcards SET discipline_id = 'microbiologia' WHERE discipline_id = 'd5';
UPDATE public.questions SET discipline_id = 'microbiologia' WHERE discipline_id = 'd5';
UPDATE public.books SET discipline_id = 'microbiologia' WHERE discipline_id = 'd5';
UPDATE public.user_progress SET discipline_id = 'microbiologia' WHERE discipline_id = 'd5';

-- 3. Deleta as disciplinas antigas agora que estão vazias
DELETE FROM public.disciplines WHERE id IN ('d1', 'd2', 'd5');

-- 4. Atualiza os topics_count usando DADOS REAIS da tabela topics
UPDATE public.disciplines d
SET topics_count = (
    SELECT COUNT(*) FROM public.topics t WHERE t.discipline_id = d.id
);
