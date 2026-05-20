
CREATE TABLE public.issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  source TEXT,
  source_url TEXT,
  category TEXT,
  novelty_score INTEGER,
  relevance_score INTEGER,
  capability_tags TEXT[] DEFAULT '{}',
  privacy_implications TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Issues are viewable by everyone"
  ON public.issues FOR SELECT
  USING (true);

CREATE INDEX issues_created_at_idx ON public.issues (created_at DESC);
