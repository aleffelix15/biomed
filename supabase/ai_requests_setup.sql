-- Table to log AI requests for auditing and cost control
CREATE TABLE IF NOT EXISTS public.ai_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature TEXT NOT NULL, -- e.g., 'explain-topic', 'generate-questions'
    topic_id UUID, -- optional link to the topic
    prompt_summary TEXT,
    status TEXT NOT NULL, -- 'success', 'error'
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own AI requests
CREATE POLICY "Users can view their own AI requests"
ON public.ai_requests FOR SELECT
USING (auth.uid() = user_id);

-- Only service role (backend) should be able to insert requests.
-- However, since we are using Edge Functions, the function will use the service_role key.
-- So we don't need a public INSERT policy.
