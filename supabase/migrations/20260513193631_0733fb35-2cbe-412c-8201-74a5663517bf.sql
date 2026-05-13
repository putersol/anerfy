
-- Allow public access to roadmap progress, keyed by submission_id (UUID acts as access token)
DROP POLICY IF EXISTS "Users can insert their own roadmap progress" ON public.client_roadmap_progress;
DROP POLICY IF EXISTS "Users can update their own roadmap progress" ON public.client_roadmap_progress;
DROP POLICY IF EXISTS "Users can view their own roadmap progress" ON public.client_roadmap_progress;
DROP POLICY IF EXISTS "Public can read roadmap progress for admin dashboard" ON public.client_roadmap_progress;

CREATE POLICY "Public read roadmap progress" ON public.client_roadmap_progress FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert roadmap progress" ON public.client_roadmap_progress FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update roadmap progress" ON public.client_roadmap_progress FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
