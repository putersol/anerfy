
-- Add status column
ALTER TABLE public.diagnostico_submissions 
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'in_progress';

-- Make all form fields nullable so partial saves work
ALTER TABLE public.diagnostico_submissions
  ALTER COLUMN nombre_completo DROP NOT NULL,
  ALTER COLUMN pais_origen DROP NOT NULL,
  ALTER COLUMN nacionalidad DROP NOT NULL,
  ALTER COLUMN edad DROP NOT NULL,
  ALTER COLUMN estado_civil DROP NOT NULL,
  ALTER COLUMN viaja_solo DROP NOT NULL,
  ALTER COLUMN tiene_hijos DROP NOT NULL,
  ALTER COLUMN viaja_mascota DROP NOT NULL,
  ALTER COLUMN tiene_contactos_alemania DROP NOT NULL,
  ALTER COLUMN universidad DROP NOT NULL,
  ALTER COLUMN anio_graduacion DROP NOT NULL,
  ALTER COLUMN realizo_internado DROP NOT NULL,
  ALTER COLUMN tiene_especialidad DROP NOT NULL,
  ALTER COLUMN anios_experiencia DROP NOT NULL,
  ALTER COLUMN areas_trabajo DROP NOT NULL,
  ALTER COLUMN nivel_aleman DROP NOT NULL,
  ALTER COLUMN tiene_certificado DROP NOT NULL,
  ALTER COLUMN estudia_actualmente DROP NOT NULL,
  ALTER COLUMN estudio_aleman_medico DROP NOT NULL,
  ALTER COLUMN presento_fsp DROP NOT NULL,
  ALTER COLUMN presento_kenntnis DROP NOT NULL,
  ALTER COLUMN envio_documentos DROP NOT NULL,
  ALTER COLUMN tiene_berufserlaubnis DROP NOT NULL,
  ALTER COLUMN tiene_approbation DROP NOT NULL,
  ALTER COLUMN tipo_visa DROP NOT NULL,
  ALTER COLUMN viaja_con_pareja DROP NOT NULL,
  ALTER COLUMN dinero_ahorrado DROP NOT NULL,
  ALTER COLUMN puede_abrir_sperrkonto DROP NOT NULL,
  ALTER COLUMN apoyo_familiar DROP NOT NULL,
  ALTER COLUMN dispuesto_ciudades_pequenas DROP NOT NULL,
  ALTER COLUMN ha_aplicado_hospitales DROP NOT NULL,
  ALTER COLUMN ha_tenido_entrevistas DROP NOT NULL,
  ALTER COLUMN puede_estudiar_intensivo DROP NOT NULL,
  ALTER COLUMN puede_dedicar_1a2_horas DROP NOT NULL,
  ALTER COLUMN motivacion DROP NOT NULL,
  ALTER COLUMN cuando_viajar DROP NOT NULL;

-- Allow anonymous updates (for progressive save)
CREATE POLICY "Allow anonymous update" ON public.diagnostico_submissions
  FOR UPDATE USING (true) WITH CHECK (true);
