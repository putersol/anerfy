import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const LOGO_URL = "https://omtmccscfnxqagmpdxnw.supabase.co/storage/v1/object/public/email-assets/anerfy-logo-dark.png"

interface DiagnosticoNuevoAsesorProps {
  nombre_completo?: string
  clasificacion?: string
  score_total?: number
  submission_id?: string
}

const DiagnosticoNuevoAsesorEmail = ({
  nombre_completo,
  clasificacion,
  score_total,
  submission_id,
}: DiagnosticoNuevoAsesorProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>
      {nombre_completo
        ? `${nombre_completo} completó su diagnóstico`
        : 'Nuevo diagnóstico completado'}
    </Preview>
    <Body style={main}>
      <Section style={headerBand}>
        <Container style={headerContainer}>
          <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
            <tr>
              <td style={{ verticalAlign: 'middle', paddingRight: '10px' }}>
                <Img src={LOGO_URL} alt="" width="24" height="24" style={{ display: 'block' }} />
              </td>
              <td style={{ verticalAlign: 'middle' }}>
                <Text style={logoText}>ANERFY</Text>
              </td>
            </tr>
          </table>
        </Container>
      </Section>

      <Container style={container}>
        <Heading style={h1}>Nuevo diagnóstico completado</Heading>

        <Text style={text}>
          Un cliente acaba de terminar su diagnóstico migratorio. Aquí el resumen:
        </Text>

        <Section style={infoBox}>
          <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
            <tr>
              <td style={infoLabel}>Nombre</td>
              <td style={infoValue}>{nombre_completo || '—'}</td>
            </tr>
            <tr>
              <td style={infoLabel}>Clasificación</td>
              <td style={{ ...infoValue, ...classStyle(clasificacion) }}>
                {clasificacion || '—'}
              </td>
            </tr>
            <tr>
              <td style={infoLabel}>Score total</td>
              <td style={infoValue}>{score_total !== undefined ? `${score_total} / 100` : '—'}</td>
            </tr>
          </table>
        </Section>

        {submission_id && (
          <Section style={buttonSection}>
            <Button style={button} href="https://anerfy.com/admin">
              Ver en el panel de admin
            </Button>
          </Section>
        )}

        <Hr style={hr} />

        <Text style={footer}>
          — Anerfy · notificación interna
        </Text>
      </Container>

      <Section style={footerBand}>
        <Container style={footerContainer}>
          <Text style={footerTagline}>Anerkennung + Simplify</Text>
        </Container>
      </Section>
    </Body>
  </Html>
)

function classStyle(clasificacion?: string): React.CSSProperties {
  if (clasificacion === 'Ruta rápida') return { color: '#10b981', fontWeight: '600' }
  if (clasificacion === 'Ruta estándar') return { color: '#f59e0b', fontWeight: '600' }
  return { color: '#ef4444', fontWeight: '600' }
}

export const template = {
  component: DiagnosticoNuevoAsesorEmail,
  subject: (data: Record<string, any>) =>
    'Nuevo diagnóstico: ' + (data.nombre_completo || 'Cliente'),
  displayName: 'Notificación interna — diagnóstico completado',
  previewData: {
    nombre_completo: 'María Laura Pérez',
    clasificacion: 'Ruta estándar',
    score_total: 62,
    submission_id: 'abc-123',
  },
} satisfies TemplateEntry

// ── Brand tokens ──────────────────────────────────────────────────────────────
const PRIMARY = '#1a56db'
const DARK_TEXT = '#0f172a'
const BODY_TEXT = '#334155'
const MUTED = '#94a3b8'
const BORDER = '#e2e8f0'
const LIGHT_BG = '#f8fafc'

const main = {
  backgroundColor: LIGHT_BG,
  fontFamily: "'Geist', 'Space Grotesk', 'Segoe UI', Arial, sans-serif",
  margin: '0',
  padding: '0',
}
const headerBand = { backgroundColor: '#ffffff', padding: '28px 0 0' }
const headerContainer = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '0 28px',
  textAlign: 'center' as const,
}
const logoText = {
  fontSize: '14px',
  fontWeight: '700' as const,
  color: PRIMARY,
  letterSpacing: '3.5px',
  margin: '0',
  lineHeight: '1',
}
const container = {
  padding: '32px 28px 24px',
  maxWidth: '520px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
}
const h1 = {
  fontSize: '20px',
  fontWeight: '600' as const,
  color: DARK_TEXT,
  margin: '0 0 20px',
  lineHeight: '1.3',
}
const text = {
  fontSize: '15px',
  color: BODY_TEXT,
  lineHeight: '1.7',
  margin: '0 0 16px',
}
const infoBox = {
  backgroundColor: LIGHT_BG,
  border: `1px solid ${BORDER}`,
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '0 0 24px',
}
const infoLabel = {
  fontSize: '13px',
  color: MUTED,
  padding: '6px 12px 6px 0',
  width: '120px',
  verticalAlign: 'top' as const,
}
const infoValue = {
  fontSize: '14px',
  color: DARK_TEXT,
  padding: '6px 0',
  fontWeight: '500' as const,
  verticalAlign: 'top' as const,
}
const buttonSection = { textAlign: 'center' as const, margin: '0 0 24px' }
const button = {
  backgroundColor: PRIMARY,
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  padding: '14px 36px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: BORDER, margin: '24px 0' }
const footer = { fontSize: '14px', color: BODY_TEXT, lineHeight: '1.5' }
const footerBand = { backgroundColor: '#ffffff', padding: '0 0 28px' }
const footerContainer = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '0 28px',
  textAlign: 'center' as const,
}
const footerTagline = {
  fontSize: '11px',
  color: MUTED,
  margin: '0',
  letterSpacing: '0.5px',
}
