-- =============================================================================
-- BIOSTUDY RLS POLICIES
-- Security layer to ensure users only access their own data.
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;

-- Academic Content (Read-only for authenticated users)
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disciplines are viewable by authenticated users" ON disciplines
    FOR SELECT TO authenticated USING (true);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Topics are viewable by authenticated users" ON topics
    FOR SELECT TO authenticated USING (true);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Books are viewable by authenticated users" ON books
    FOR SELECT TO authenticated USING (true);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Flashcards are viewable by authenticated users" ON flashcards
    FOR SELECT TO authenticated USING (true);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are viewable by authenticated users" ON questions
    FOR SELECT TO authenticated USING (true);

-- User-Specific Data (Read/Write only for owner)

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
-- Necessária como rede de segurança para o fallback manual em
-- ensureUserProfile() (services/supabaseService.js), usado quando o
-- trigger handle_new_user (migration_v1.sql) ainda não criou o profile.
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User Progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Topic Progress
CREATE POLICY "Users can view own topic progress" ON topic_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own topic progress" ON topic_progress FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Study Sessions
CREATE POLICY "Users can view own sessions" ON study_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON study_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON study_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Favorites
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL TO authenticated USING (auth.uid() = user_id);

-- User Flashcard Progress
CREATE POLICY "Users can view own flashcard progress" ON user_flashcard_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcard progress" ON user_flashcard_progress FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Question Attempts
CREATE POLICY "Users can view own attempts" ON question_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can log own attempts" ON question_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User Books
CREATE POLICY "Users can view own books" ON user_books FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own books" ON user_books FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Study Streaks
CREATE POLICY "Users can view own streaks" ON study_streaks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON study_streaks FOR ALL TO authenticated USING (auth.uid() = user_id);
