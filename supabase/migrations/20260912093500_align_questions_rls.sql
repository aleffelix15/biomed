-- 13_align_questions_rls.sql
-- Allow anon to insert/update questions so syncToDB can run
CREATE POLICY "Allow anon insert questions" ON public.questions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update questions" ON public.questions FOR UPDATE TO anon USING (true) WITH CHECK (true);
