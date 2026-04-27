/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as diagnosticLink } from './diagnostic-link.tsx'
import { template as accesoPresentacion } from './acceso-presentacion.tsx'
import { template as diagnosticoNuevoAsesor } from './diagnostico-nuevo-asesor.tsx'
import { template as reminderFill1 } from './reminder-fill-1.tsx'
import { template as reminderFill2 } from './reminder-fill-2.tsx'
import { template as reunionAgendadaAsesor } from './reunion-agendada-asesor.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'diagnostic-link': diagnosticLink,
  'acceso-presentacion': accesoPresentacion,
  'diagnostico-nuevo-asesor': diagnosticoNuevoAsesor,
  'reminder-fill-1': reminderFill1,
  'reminder-fill-2': reminderFill2,
  'reunion-agendada-asesor': reunionAgendadaAsesor,
}
