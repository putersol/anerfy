-- Migration: Cal.com booking tracking
-- Adds meeting_scheduled_at to diagnostico_submissions
-- Adds calcom_booking_uid for idempotent webhook handling

ALTER TABLE public.diagnostico_submissions
  ADD COLUMN IF NOT EXISTS meeting_scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS meeting_start_at timestamptz,
  ADD COLUMN IF NOT EXISTS calcom_booking_uid text;

CREATE UNIQUE INDEX IF NOT EXISTS diagnostico_submissions_calcom_booking_uid_key
  ON public.diagnostico_submissions (calcom_booking_uid)
  WHERE calcom_booking_uid IS NOT NULL;
