-- Tabla para guardar el progreso del roadmap personalizado de cada cliente
CREATE TABLE public.client_roadmap_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id uuid NOT NULL,
  email text NOT NULL,
  task_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (submission_id, task_id)
);

CREATE INDEX idx_crp_submission ON public.client_roadmap_progress(submission_id);
CREATE INDEX idx_crp_email ON public.client_roadmap_progress(email);

ALTER TABLE public.client_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- El cliente autenticado solo puede ver/editar las tareas de su propio submission (match por email)
CREATE POLICY "Users can view their own roadmap progress"
ON public.client_roadmap_progress
FOR SELECT
TO authenticated
USING (auth.email() = email);

CREATE POLICY "Users can insert their own roadmap progress"
ON public.client_roadmap_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.email() = email);

CREATE POLICY "Users can update their own roadmap progress"
ON public.client_roadmap_progress
FOR UPDATE
TO authenticated
USING (auth.email() = email)
WITH CHECK (auth.email() = email);

-- El asesor (anon, panel admin protegido por contraseña client-side) puede leer todo para ver % de avance
CREATE POLICY "Public can read roadmap progress for admin dashboard"
ON public.client_roadmap_progress
FOR SELECT
TO anon
USING (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_crp_updated_at
BEFORE UPDATE ON public.client_roadmap_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime para sync en vivo (admin dashboard)
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_roadmap_progress;