-- 11_fix_questions_hierarchy.sql
ALTER TABLE public.questions 
  ADD COLUMN IF NOT EXISTS module_id uuid REFERENCES public.modules(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS topic_id uuid REFERENCES public.topics(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_questions_module_id ON public.questions(module_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON public.questions(topic_id);
