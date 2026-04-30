-- Migration: Booking flow email automation
-- Adds columns to diagnostico_submissions for tracking confirmation + booking reminders
-- Adds Trigger D: sends 'diagnostico-completado' to client on status = 'completed'

-- ── 1. New columns ────────────────────────────────────────────────────────────
ALTER TABLE public.diagnostico_submissions
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmation_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS booking_reminder_1_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS booking_reminder_2_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS booking_reminder_3_sent_at timestamptz;

-- Index for cron: completed but no meeting booked yet
CREATE INDEX IF NOT EXISTS diagnostico_submissions_booking_reminders_idx
  ON public.diagnostico_submissions (completed_at)
  WHERE status = 'completed' AND meeting_scheduled_at IS NULL AND completed_at IS NOT NULL;

-- ── 2. Backfill completed_at for existing completed rows ─────────────────────
UPDATE public.diagnostico_submissions
  SET completed_at = updated_at
  WHERE status = 'completed' AND completed_at IS NULL;

-- ── 3. Trigger D: client confirmation on status → completed ──────────────────
CREATE OR REPLACE FUNCTION public.trigger_send_diagnostico_completado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nombre text;
  v_booking_url text;
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Set completed_at
    NEW.completed_at := now();

    v_nombre := split_part(COALESCE(NEW.nombre_completo, ''), ' ', 1);
    v_booking_url := 'https://cal.com/anerfy/asesoria-90min'
      || '?name=' || replace(COALESCE(NEW.nombre_completo, ''), ' ', '%20')
      || '&email=' || COALESCE(NEW.email, '')
      || '&metadata[submission_id]=' || NEW.submission_id::text;

    PERFORM net.http_post(
      url     := 'https://omtmccscfnxqagmpdxnw.supabase.co/functions/v1/send-transactional-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdG1jY3NjZm54cWFnbXBkeG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDA4NTgsImV4cCI6MjA4NzUxNjg1OH0.xczVKhoZatiCxPMHWvLm5ukWEKLh2jjFe_s14_PYeAs'
      ),
      body    := jsonb_build_object(
        'templateName',   'diagnostico-completado',
        'recipientEmail', NEW.email,
        'idempotencyKey', 'diagnostico-completado-' || NEW.submission_id,
        'templateData',   jsonb_build_object(
          'nombre',     v_nombre,
          'bookingUrl', v_booking_url
        )
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
