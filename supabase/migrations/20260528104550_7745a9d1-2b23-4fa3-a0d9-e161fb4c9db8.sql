CREATE TABLE public.drafts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id text NOT NULL UNIQUE,
  issue_title text NOT NULL,
  issue_summary text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.drafts TO anon, authenticated;
GRANT ALL ON public.drafts TO service_role;

ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drafts are viewable by everyone"
  ON public.drafts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create drafts"
  ON public.drafts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update drafts"
  ON public.drafts FOR UPDATE
  USING (true);

CREATE INDEX idx_drafts_issue_id ON public.drafts(issue_id);
CREATE INDEX idx_drafts_created_at ON public.drafts(created_at DESC);