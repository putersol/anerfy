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
import { template as diagnosticoCompletado } from './diagnostico-completado.tsx'
import { template as bookingReminder1 } from './booking-reminder-1.tsx'
import { template as bookingReminder2 } from './booking-reminder-2.tsx'
import { template as bookingReminder3 } from './booking-reminder-3.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'diagnostic-link': diagnosticLink,
  'acceso-presentacion': accesoPresentacion,
  'diagnostico-nuevo-asesor': diagnosticoNuevoAsesor,
  'reminder-fill-1': reminderFill1,
  'reminder-fill-2': reminderFill2,
  'reunion-agendada-asesor': reunionAgendadaAsesor,
  'diagnostico-completado': diagnosticoCompletado,
  'booking-reminder-1': bookingReminder1,
  'booking-reminder-2': bookingReminder2,
  'booking-reminder-3': bookingReminder3,
}
