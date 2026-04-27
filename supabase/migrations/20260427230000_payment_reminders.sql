-- Migration: Stripe webhook + reminder system
-- 1. Adds stripe_session_id to payments (for idempotent webhook handling)
-- 2. Adds payment_id to diagnostic_tokens (link token to payment)
-- 3. Adds reminder timestamps to diagnostic_tokens
-- 4. Schedules pg_cron job to call send-reminders hourly

-- ── 1. payments: stripe_session_id ──────────────────────────────────────────
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

CREATE UNIQUE INDEX IF NOT EXISTS payments_stripe_session_id_key
  ON public.payments (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

-- ── 2. diagnostic_tokens: payment_id link ──────────────────────────────────
ALTER TABLE public.diagnostic_tokens
  ADD COLUMN IF NOT EXISTS payment_id uuid;

-- ── 3. diagnostic_tokens: reminder timestamps ──────────────────────────────
ALTER TABLE public.diagnostic_tokens
  ADD COLUMN IF NOT EXISTS reminder_1_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_2_sent_at timestamptz;

-- Index used by send-reminders to find unused tokens efficiently
CREATE INDEX IF NOT EXISTS diagnostic_tokens_unused_created_at_idx
  ON public.diagnostic_tokens (created_at)
  WHERE used = false;

-- ── 4. pg_cron: send-reminders every hour ──────────────────────────────────
-- Reuses 'email_queue_service_role_key' from email_infra.sql vault
DO $$
DECLARE
  v_service_key text;
BEGIN
  SELECT decrypted_secret INTO v_service_key
    FROM vault.decrypted_secrets
    WHERE name = 'email_queue_service_role_key'
    LIMIT 1;

  IF v_service_key IS NULL THEN
    RAISE NOTICE 'email_queue_service_role_key not in vault — skipping cron schedule';
    RETURN;
  END IF;

  -- Unschedule if exists, then re-schedule
  PERFORM cron.unschedule('send-reminders')
    WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'send-reminders');

  PERFORM cron.schedule(
    'send-reminders',
    '0 * * * *',  -- every hour at :00
    format($cron$
      SELECT net.http_post(
        url := 'https://omtmccscfnxqagmpdxnw.supabase.co/functions/v1/send-reminders',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer %s'
        ),
        body := '{}'::jsonb
      );
    $cron$, v_service_key)
  );
END $$;
