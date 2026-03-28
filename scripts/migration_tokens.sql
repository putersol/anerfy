-- Supabase Migration: payments & diagnostic_tokens tables
-- Run this in the Supabase SQL Editor (after migration_diagnostico.sql)

-- ============================================================
-- 1. PAYMENTS TABLE (tracks every Stripe payment)
-- ============================================================
create table if not exists public.payments (
  id bigint generated always as identity primary key,
  payment_id uuid not null default gen_random_uuid() unique,

  -- Customer info
  email text not null,
  nombre text,

  -- Stripe
  stripe_session_id text unique,
  stripe_payment_intent text unique,
  stripe_customer_id text,

  -- Amount
  amount_cents integer not null,           -- e.g. 4900 = 49.00 EUR
  currency text not null default 'eur',

  -- Status: pending | completed | failed | refunded
  status text not null default 'pending',

  -- Metadata
  product text not null default 'diagnostico',
  notes text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments enable row level security;

-- Only server-side (service role) can insert/update payments
-- Anon can read their own (by email) — not needed for now
create policy "Service role full access on payments"
  on public.payments for all
  using (true) with check (true);

create index idx_payments_email on public.payments(email);
create index idx_payments_status on public.payments(status);
create index idx_payments_stripe_session on public.payments(stripe_session_id);
create index idx_payments_created on public.payments(created_at desc);

-- Auto-update updated_at (reuse existing function if available)
create trigger set_payments_updated_at
  before update on public.payments
  for each row execute function public.update_updated_at();

-- ============================================================
-- 2. DIAGNOSTIC_TOKENS TABLE (unique one-time-use links)
-- ============================================================
create table if not exists public.diagnostic_tokens (
  id bigint generated always as identity primary key,
  token text not null unique,               -- short unique code (e.g. "d8f3a2b1")
  payment_id uuid references public.payments(payment_id),

  -- Customer (denormalized for convenience)
  email text not null,
  nombre text,

  -- State
  used boolean not null default false,
  used_at timestamptz,
  submission_id uuid references public.diagnostico_submissions(submission_id),

  -- Expiry (null = never expires)
  expires_at timestamptz,

  -- Who created it: 'stripe' | 'admin'
  created_by text not null default 'admin',

  -- Timestamps
  created_at timestamptz not null default now()
);

alter table public.diagnostic_tokens enable row level security;

-- Anon can read token (to validate) and update (to mark used)
create policy "Anon can validate tokens"
  on public.diagnostic_tokens for select
  using (true);

create policy "Anon can mark token used"
  on public.diagnostic_tokens for update
  using (true)
  with check (true);

-- Admin/service can do everything
create policy "Service role full access on tokens"
  on public.diagnostic_tokens for all
  using (true) with check (true);

create index idx_tokens_token on public.diagnostic_tokens(token);
create index idx_tokens_email on public.diagnostic_tokens(email);
create index idx_tokens_used on public.diagnostic_tokens(used);

-- ============================================================
-- 3. ADD token_id TO diagnostico_submissions (link submission → token)
-- ============================================================
alter table public.diagnostico_submissions
  add column if not exists token_id text references public.diagnostic_tokens(token);

-- Also add email column to submissions for easier tracking
alter table public.diagnostico_submissions
  add column if not exists email text;

create index if not exists idx_diagnostico_token on public.diagnostico_submissions(token_id);
create index if not exists idx_diagnostico_email on public.diagnostico_submissions(email);
