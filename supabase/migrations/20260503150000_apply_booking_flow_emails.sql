-- Re-apply booking flow emails (20260430220000 was committed but never ran in prod)
-- Idempotent: safe to run regardless of prior state.

-- ── 1. Columns ───────────────────────────────────────────────────────────────
-- booking_link_sent_at: cuando el admin (o futuro webhook Stripe tras pago)
-- envía el link de booking. Los reminders de booking se basan en este timestamp,
-- no en completed_at, para no perseguir a clientes que aún no recibieron link.
ALTER TABLE public.diagnostico_submissions
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmation_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS booking_link_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS booking_reminder_1_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS booking_reminder_2_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS booking_reminder_3_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS diagnostico_submissions_booking_reminders_idx
  ON public.diagnostico_submissions (booking_link_sent_at)
  WHERE status = 'completed' AND meeting_scheduled_at IS NULL AND booking_link_sent_at IS NOT NULL;

-- ── 2. Backfill ─────────────────────────────────────────────────────────────
UPDATE public.diagnostico_submissions
  SET completed_at = updated_at
  WHERE status = 'completed' AND completed_at IS NULL;

-- ── 3. Trigger D — auto-confirmación SIN booking link ───────────────────────
-- Diseño: el cliente recibe acuse automático sin link de booking.
-- El link de asesoría se envía manualmente desde admin (o futuro Stripe webhook
-- cuando caiga el pago) usando la plantilla 'diagnostico-completado'.
CREATE OR REPLACE FUNCTION public.trigger_send_diagnostico_completado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nombre text;
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_at := now();

    v_nombre := split_part(COALESCE(NEW.nombre_completo, ''), ' ', 1);

    PERFORM net.http_post(
      url     := 'https://omtmccscfnxqagmpdxnw.supabase.co/functions/v1/send-transactional-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdG1jY3NjZm54cWFnbXBkeG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDA4NTgsImV4cCI6MjA4NzUxNjg1OH0.xczVKhoZatiCxPMHWvLm5ukWEKLh2jjFe_s14_PYeAs'
      ),
      body    := jsonb_build_object(
        'templateName',   'diagnostico-recibido',
        'recipientEmail', NEW.email,
        'idempotencyKey', 'diagnostico-recibido-' || NEW.submission_id,
        'templateData',   jsonb_build_object('nombre', v_nombre)
      )
    );

    NEW.confirmation_sent_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_send_diagnostico_completado ON public.diagnostico_submissions;
CREATE TRIGGER trg_send_diagnostico_completado
  BEFORE UPDATE ON public.diagnostico_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_diagnostico_completado();
