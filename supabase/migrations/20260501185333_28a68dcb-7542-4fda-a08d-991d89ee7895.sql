-- Trigger A
CREATE OR REPLACE FUNCTION public.trigger_send_diagnostic_link()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM net.http_post(
    url     := 'https://omtmccscfnxqagmpdxnw.supabase.co/functions/v1/send-transactional-email',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdG1jY3NjZm54cWFnbXBkeG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDA4NTgsImV4cCI6MjA4NzUxNjg1OH0.xczVKhoZatiCxPMHWvLm5ukWEKLh2jjFe_s14_PYeAs'
    ),
    body    := jsonb_build_object(
      'templateName',   'diagnostic-link',
      'recipientEmail', NEW.email,
      'idempotencyKey', 'diagnostic-link-' || NEW.token,
      'templateData',   jsonb_build_object(
        'nombre',       NEW.nombre,
        'diagnosticUrl','https://anerfy.com/diagnostico/' || NEW.token
      )
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_send_diagnostic_link ON public.diagnostic_tokens;
CREATE TRIGGER trg_send_diagnostic_link
  AFTER INSERT ON public.diagnostic_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_diagnostic_link();

-- Trigger B
CREATE OR REPLACE FUNCTION public.trigger_notify_asesores_diagnostico()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM net.http_post(
      url     := 'https://omtmccscfnxqagmpdxnw.supabase.co/functions/v1/send-transactional-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdG1jY3NjZm54cWFnbXBkeG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDA4NTgsImV4cCI6MjA4NzUxNjg1OH0.xczVKhoZatiCxPMHWvLm5ukWEKLh2jjFe_s14_PYeAs'
      ),
      body    := jsonb_build_object(
        'templateName',   'diagnostico-nuevo-asesor',
        'recipientEmail', 'dieterbrodersen@icloud.com',
        'idempotencyKey', 'diagnostico-asesor-dieter-' || NEW.submission_id,
        'templateData',   jsonb_build_object(
          'nombre_completo', NEW.nombre_completo,
          'clasificacion',   NEW.clasificacion,
          'score_total',     NEW.score_total,
          'submission_id',   NEW.submission_id
        )
      )
    );

    PERFORM net.http_post(
      url     := 'https://omtmccscfnxqagmpdxnw.supabase.co/functions/v1/send-transactional-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdG1jY3NjZm54cWFnbXBkeG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDA4NTgsImV4cCI6MjA4NzUxNjg1OH0.xczVKhoZatiCxPMHWvLm5ukWEKLh2jjFe_s14_PYeAs'
      ),
      body    := jsonb_build_object(
        'templateName',   'diagnostico-nuevo-asesor',
        'recipientEmail', 'albertodiaz2184@gmail.com',
        'idempotencyKey', 'diagnostico-asesor-alberto-' || NEW.submission_id,
        'templateData',   jsonb_build_object(
          'nombre_completo', NEW.nombre_completo,
          'clasificacion',   NEW.clasificacion,
          'score_total',     NEW.score_total,
          'submission_id',   NEW.submission_id
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_asesores_diagnostico ON public.diagnostico_submissions;
CREATE TRIGGER trg_notify_asesores_diagnostico
  AFTER UPDATE ON public.diagnostico_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_notify_asesores_diagnostico();

-- Trigger C
CREATE OR REPLACE FUNCTION public.trigger_send_acceso_presentacion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_access_unlocked = true AND (OLD.client_access_unlocked IS NULL OR OLD.client_access_unlocked = false) THEN
    PERFORM net.http_post(
      url     := 'https://omtmccscfnxqagmpdxnw.supabase.co/functions/v1/send-transactional-email',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdG1jY3NjZm54cWFnbXBkeG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDA4NTgsImV4cCI6MjA4NzUxNjg1OH0.xczVKhoZatiCxPMHWvLm5ukWEKLh2jjFe_s14_PYeAs'
      ),
      body    := jsonb_build_object(
        'templateName',   'acceso-presentacion',
        'recipientEmail', NEW.email,
        'idempotencyKey', 'acceso-presentacion-' || NEW.submission_id,
        'templateData',   jsonb_build_object(
          'nombre',       split_part(NEW.nombre_completo, ' ', 1),
          'resultadosUrl','https://anerfy.com/resultados/' || NEW.submission_id,
          'roadmapUrl',   'https://anerfy.com/mi-roadmap/' || NEW.submission_id
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_send_acceso_presentacion ON public.diagnostico_submissions;
CREATE TRIGGER trg_send_acceso_presentacion
  AFTER UPDATE ON public.diagnostico_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_acceso_presentacion();