-- Free funnel: capture leads WITHOUT granting the paid diagnostic.
-- Root fix: the 7-question free form used to insert into diagnostic_tokens,
-- which fired the diagnostic-link email and unlocked /diagnostico/:token for
-- people who never paid. Free captures now land in `leads` and trigger a
-- lightweight "mini-score" teaser email instead. The paid diagnostic token is
-- still created only by the Stripe webhook after payment.

-- ── Table: leads ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL,
  nombre      text,
  answers     jsonb,
  score       integer,
  fortalezas  jsonb DEFAULT '[]'::jsonb,
  atencion    jsonb DEFAULT '[]'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Public funnel: anyone can submit (anon), nobody can read back (same posture
-- as diagnostico_submissions / waitlist).
CREATE POLICY "Anyone can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "No public read access to leads" ON public.leads
  FOR SELECT USING (false);

-- ── Trigger: send mini-score teaser email on lead capture ────────────────────
CREATE OR REPLACE FUNCTION public.trigger_send_mini_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM net.http_post(
    url     := 'https://omtmccscfnxqagmpdxnw.supabase.co/functions/v1/send-transactional-email',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdG1jY3NjZm54cWFnbXBkeG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDA4NTgsImV4cCI6MjA4NzUxNjg1OH0.xczVKhoZatiCxPMHWvLm5ukWEKLh2jjFe_s14_PYeAs'
    ),
    body    := jsonb_build_object(
      'templateName',   'mini-score',
      'recipientEmail', NEW.email,
      'idempotencyKey', 'mini-score-' || NEW.id,
      'templateData',   jsonb_build_object(
        'nombre',     NEW.nombre,
        'score',      NEW.score,
        'fortalezas', COALESCE(NEW.fortalezas, '[]'::jsonb),
        'atencion',   COALESCE(NEW.atencion, '[]'::jsonb),
        'ctaUrl',     'https://anerfy.com/asesoria'
      )
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_send_mini_score ON public.leads;
CREATE TRIGGER trg_send_mini_score
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_mini_score();
