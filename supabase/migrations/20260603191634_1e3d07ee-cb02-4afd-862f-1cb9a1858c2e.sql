GRANT INSERT, SELECT ON public.diagnostic_tokens TO anon, authenticated;
GRANT ALL ON public.diagnostic_tokens TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.diagnostic_tokens_id_seq TO anon, authenticated;