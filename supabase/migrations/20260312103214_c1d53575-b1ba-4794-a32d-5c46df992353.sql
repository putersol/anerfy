
CREATE TABLE public.onboarding_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id uuid REFERENCES public.waitlist(id) ON DELETE CASCADE,
  country text,
  anabin_status text,
  german_level text,
  in_germany text,
  city text,
  family_status text,
  budget text,
  current_stage text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert onboarding responses"
  ON public.onboarding_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "No public read access"
  ON public.onboarding_responses
  FOR SELECT
  TO public
  USING (false);
