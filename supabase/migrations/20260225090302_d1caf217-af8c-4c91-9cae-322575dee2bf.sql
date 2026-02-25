
-- Create a function to get waitlist count (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.waitlist;
$$;

-- Enable realtime for waitlist table
ALTER PUBLICATION supabase_realtime ADD TABLE public.waitlist;
