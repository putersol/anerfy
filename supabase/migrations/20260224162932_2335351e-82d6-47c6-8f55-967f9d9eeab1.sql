
-- Block all public SELECT access to waitlist emails
CREATE POLICY "No public read access to waitlist"
ON public.waitlist
FOR SELECT
USING (false);
