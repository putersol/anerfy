/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const LOGO_URL = "https://omtmccscfnxqagmpdxnw.supabase.co/storage/v1/object/public/email-assets/anerfy-logo-dark.png"

interface BookingReminderProps {
  nombre?: string
  bookingUrl?: string
}

const BookingReminder3Email = ({ nombre, bookingUrl }: BookingReminderProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Último aviso: tu asesoría sigue disponible</Preview>
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
          {nombre ? `${nombre}, ` : ''}tu asesoría sigue disponible.
        </Heading>

        <Text style={text}>
          Hace una semana completaste tu diagnóstico. No queremos que ese
          trabajo quede sin resultado, así que este es nuestro último
          aviso antes de liberar el espacio en agenda.
        </Text>

        <Text style={text}>
          Si tu situación cambió o necesitas reprogramar para más adelante,
          escríbenos. Si sigues interesado, agenda ahora:
        </Text>

        {bookingUrl && (
          <Section style={buttonSection}>
            <Button style={button} href={bookingUrl}>
              Agendar mi asesoría
            </Button>
          </Section>
        )}

        <Text style={linkNote}>
          Responde este email si tienes alguna pregunta antes de agendar.
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
  component: BookingReminder3Email,
  subject: 'Último aviso: tu asesoría sigue disponible',
  displayName: 'Recordatorio agendar (7d)',
  previewData: {
    nombre: 'María Laura',
    bookingUrl: 'https://cal.com/anerfy/asesoria-90min',
  },
} satisfies TemplateEntry

const PRIMARY = '#1a56db'
const DARK_TEXT = '#0f172a'
const BODY_TEXT = '#334155'
const MUTED = '#94a3b8'
const BORDER = '#e2e8f0'
const LIGHT_BG = '#f8fafc'

const main = {
  backgroundColor: LIGHT_BG,
  fontFamily: "'Geist', 'Space Grotesk', 'Segoe UI', Arial, sans-serif",
  margin: '0', padding: '0',
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
