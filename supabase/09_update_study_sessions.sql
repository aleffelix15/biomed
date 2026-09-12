-- 09_update_study_sessions.sql

-- Adicionar novas colunas na tabela study_sessions para registrar desempenho
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='study_sessions' AND column_name='mode') THEN
        ALTER TABLE public.study_sessions ADD COLUMN mode text; -- 'flashcards', 'questions', 'simulado', 'prova'
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='study_sessions' AND column_name='score_percent') THEN
        ALTER TABLE public.study_sessions ADD COLUMN score_percent int;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='study_sessions' AND column_name='correct_count') THEN
        ALTER TABLE public.study_sessions ADD COLUMN correct_count int;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='study_sessions' AND column_name='total_count') THEN
        ALTER TABLE public.study_sessions ADD COLUMN total_count int;
    END IF;
END $$;
