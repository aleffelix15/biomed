-- 03_enable_rls.sql
-- Habilita RLS em todas as tabelas sensíveis de usuário

-- 1. user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own user_progress" ON user_progress;
CREATE POLICY "Users can manage own user_progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- 2. topic_progress
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own topic_progress" ON topic_progress;
CREATE POLICY "Users can manage own topic_progress" ON topic_progress FOR ALL USING (auth.uid() = user_id);

-- 3. study_plans
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own study_plans" ON study_plans;
CREATE POLICY "Users can manage own study_plans" ON study_plans FOR ALL USING (auth.uid() = user_id);

-- 4. lesson_progress
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own lesson_progress" ON lesson_progress;
CREATE POLICY "Users can manage own lesson_progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id);

-- 5. user_flashcard_progress
ALTER TABLE user_flashcard_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own user_flashcard_progress" ON user_flashcard_progress;
CREATE POLICY "Users can manage own user_flashcard_progress" ON user_flashcard_progress FOR ALL USING (auth.uid() = user_id);

-- 6. study_sessions
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own study_sessions" ON study_sessions;
CREATE POLICY "Users can manage own study_sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);

-- 7. study_streaks
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own study_streaks" ON study_streaks;
CREATE POLICY "Users can manage own study_streaks" ON study_streaks FOR ALL USING (auth.uid() = user_id);

-- 8. question_attempts
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own question_attempts" ON question_attempts;
CREATE POLICY "Users can manage own question_attempts" ON question_attempts FOR ALL USING (auth.uid() = user_id);
