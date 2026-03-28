-- Supabase Migration: diagnostico_submissions table
-- Run this in the Supabase SQL Editor

create table if not exists public.diagnostico_submissions (
  id bigint generated always as identity primary key,
  submission_id uuid not null default gen_random_uuid() unique,

  -- Step 1: Datos Personales
  nombre_completo text not null,
  pais_origen text not null,
  nacionalidad text not null,
  edad text not null,
  estado_civil text not null,
  viaja_solo text not null,
  tiene_hijos text not null,
  viaja_mascota text not null,
  ciudad_preferida text,
  bundesland_preferido text,
  tiene_contactos_alemania text not null,
  donde_contactos text,

  -- Step 2: Formación Académica
  universidad text not null,
  anio_graduacion text not null,
  realizo_internado text not null,
  tiene_especialidad text not null,
  cual_especialidad text,
  anios_experiencia text not null,
  areas_trabajo text not null,

  -- Step 3: Idioma Alemán
  nivel_aleman text not null,
  tiene_certificado text not null,
  cual_certificado text,
  estudia_actualmente text not null,
  horas_por_semana text,
  estudio_aleman_medico text not null,
  presento_fsp text not null,
  presento_kenntnis text not null,

  -- Step 4: Documentos
  documentos jsonb not null default '{}'::jsonb,

  -- Step 5: Estado del Proceso
  envio_documentos text not null,
  bundesland_envio text,
  recibio_respuesta text,
  solicitaron_examen text,
  tiene_berufserlaubnis text not null,
  tiene_approbation text not null,

  -- Step 6: Visa y Migración
  tipo_visa text not null,
  viaja_con_pareja text not null,
  pareja_habla_aleman text,
  nivel_aleman_pareja text,
  pareja_profesion text,

  -- Step 7: Situación Financiera
  dinero_ahorrado text not null,
  puede_abrir_sperrkonto text not null,
  apoyo_familiar text not null,
  dispuesto_ciudades_pequenas text not null,

  -- Step 8: Estrategia Laboral
  especialidad_interes text,
  dispuesto_especialidades jsonb default '[]'::jsonb,
  ha_aplicado_hospitales text not null,
  ha_tenido_entrevistas text not null,

  -- Step 9: Tiempo y Planificación
  cuando_viajar text not null,
  puede_estudiar_intensivo text not null,
  puede_dedicar_1a2_horas text not null,

  -- Step 10: Motivación
  motivacion text not null,

  -- Scores
  score_idioma integer not null default 0,
  score_documentos integer not null default 0,
  score_homologacion integer not null default 0,
  score_finanzas integer not null default 0,
  score_estrategia integer not null default 0,
  score_total integer not null default 0,
  clasificacion text not null default 'Ruta preparatoria',

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.diagnostico_submissions enable row level security;

-- Allow anonymous inserts (public form)
create policy "Allow anonymous insert" on public.diagnostico_submissions
  for insert with check (true);

-- Allow authenticated reads (admin)
create policy "Allow authenticated read" on public.diagnostico_submissions
  for select using (true);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.diagnostico_submissions
  for each row execute function public.update_updated_at();

-- Index for common queries
create index idx_diagnostico_created_at on public.diagnostico_submissions(created_at desc);
create index idx_diagnostico_pais on public.diagnostico_submissions(pais_origen);
create index idx_diagnostico_clasificacion on public.diagnostico_submissions(clasificacion);
