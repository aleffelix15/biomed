-- 08_create_lab_progress_schema.sql

-- 1. Create lab_progress table
CREATE TABLE IF NOT EXISTS public.lab_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    item_id text NOT NULL,
    completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_id)
);

-- 2. Trigger for updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_lab_progress_updated_at') THEN
        CREATE TRIGGER update_lab_progress_updated_at 
        BEFORE UPDATE ON lab_progress 
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;

-- 3. Row Level Security for lab_progress
ALTER TABLE public.lab_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own lab progress" ON public.lab_progress;
CREATE POLICY "Users can view own lab progress"
    ON public.lab_progress FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lab progress" ON public.lab_progress;
CREATE POLICY "Users can insert own lab progress"
    ON public.lab_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lab progress" ON public.lab_progress;
CREATE POLICY "Users can update own lab progress"
    ON public.lab_progress FOR UPDATE
    USING (auth.uid() = user_id);

