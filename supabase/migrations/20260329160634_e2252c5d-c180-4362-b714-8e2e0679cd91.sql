
-- Table 1: payments
CREATE TABLE IF NOT EXISTS public.payments (
  id bigint generated always as identity primary key,
  payment_id uuid not null default gen_random_uuid() unique,
  email text not null,
  nombre text,
  amount_cents integer default 0,
  currency text default 'eur',
  status text default 'pending',
  product text default 'diagnostico',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all select on payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Allow all insert on payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on payments" ON public.payments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on payments" ON public.payments FOR DELETE USING (true);

-- Table 2: diagnostic_tokens
CREATE TABLE IF NOT EXISTS public.diagnostic_tokens (
  id bigint generated always as identity primary key,
  token text unique not null,
  email text not null,
  nombre text,
  used boolean default false,
  used_at timestamptz,
  submission_id uuid,
  expires_at timestamptz,
  created_by text default 'admin',
  created_at timestamptz not null default now()
);

ALTER TABLE public.diagnostic_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all select on diagnostic_tokens" ON public.diagnostic_tokens FOR SELECT USING (true);
CREATE POLICY "Allow all insert on diagnostic_tokens" ON public.diagnostic_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on diagnostic_tokens" ON public.diagnostic_tokens FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on diagnostic_tokens" ON public.diagnostic_tokens FOR DELETE USING (true);

-- Add columns to diagnostico_submissions if they don't exist
ALTER TABLE public.diagnostico_submissions ADD COLUMN IF NOT EXISTS token_id text;
ALTER TABLE public.diagnostico_submissions ADD COLUMN IF NOT EXISTS email text;
