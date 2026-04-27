/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const LOGO_URL = "https://omtmccscfnxqagmpdxnw.supabase.co/storage/v1/object/public/email-assets/anerfy-logo-dark.png"

interface ReminderProps {
  nombre?: string
  diagnosticUrl?: string
}

const ReminderFill1Email = ({ nombre, diagnosticUrl }: ReminderProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu diagnóstico migratorio te está esperando</Preview>
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
        <Heading style={h1}>
          {nombre ? `${nombre}, ` : ''}¿lo dejaste a medias?
        </Heading>

        <Text style={text}>
          Vimos que aún no completaste tu <strong style={bold}>Diagnóstico Migratorio</strong>.
          Son solo 10-15 minutos y al final tienes claro qué te falta para
          tu homologación: idioma, documentos, financiamiento y estrategia.
        </Text>

        <Text style={text}>
          Sin el diagnóstico no podemos preparar tu asesoría personalizada
          de 90 min con un asesor.
        </Text>

        {diagnosticUrl && (
          <Section style={buttonSection}>
            <Button style={button} href={diagnosticUrl}>
              Continuar mi diagnóstico
            </Button>
          </Section>
        )}

        <Text style={linkNote}>
          Tu link sigue siendo válido. Si tuviste algún problema técnico,
          responde este email y te ayudamos.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>— Equipo Anerfy</Text>
      </Container>

      <Section style={footerBand}>
        <Container style={footerContainer}>
          <Text style={footerTagline}>Anerkennung + Simplify</Text>
        </Container>
      </Section>
    </Body>
  </Html>
)

export const template = {
  component: ReminderFill1Email,
  subject: 'Tu diagnóstico migratorio te está esperando',
  displayName: 'Recordatorio diagnóstico (24h)',
  previewData: {
    nombre: 'María Laura',
    diagnosticUrl: 'https://anerfy.com/diagnostico/abc12345',
  },
} satisfies TemplateEntry

// Brand tokens
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
  maxWidth: '520px', margin: '0 auto', padding: '0 28px', textAlign: 'center' as const,
}
const logoText = {
  fontSize: '14px', fontWeight: '700' as const, color: PRIMARY,
  letterSpacing: '3.5px', margin: '0', lineHeight: '1',
}
const container = {
  padding: '32px 28px 24px', maxWidth: '520px', margin: '0 auto', backgroundColor: '#ffffff',
}
const h1 = {
  fontSize: '20px', fontWeight: '600' as const, color: DARK_TEXT,
  margin: '0 0 20px', lineHeight: '1.3',
}
const text = {
  fontSize: '15px', color: BODY_TEXT, lineHeight: '1.7', margin: '0 0 16px',
}
const bold = { color: DARK_TEXT, fontWeight: '600' as const }
const buttonSection = { textAlign: 'center' as const, margin: '28px 0' }
const button = {
  backgroundColor: PRIMARY, color: '#ffffff', fontSize: '15px',
  fontWeight: '600' as const, padding: '14px 36px', borderRadius: '8px',
  textDecoration: 'none', display: 'inline-block',
}
const linkNote = {
  fontSize: '13px', color: MUTED, margin: '0 0 24px', textAlign: 'center' as const,
}
const hr = { borderColor: BORDER, margin: '24px 0' }
const footer = { fontSize: '14px', color: BODY_TEXT, lineHeight: '1.5' }
const footerBand = { backgroundColor: '#ffffff', padding: '0 0 28px' }
const footerContainer = {
  maxWidth: '520px', margin: '0 auto', padding: '0 28px', textAlign: 'center' as const,
}
const footerTagline = {
  fontSize: '11px', color: MUTED, margin: '0', letterSpacing: '0.5px',
}
