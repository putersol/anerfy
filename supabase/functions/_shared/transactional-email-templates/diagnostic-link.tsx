import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Anerfy"
const LOGO_URL = "https://omtmccscfnxqagmpdxnw.supabase.co/storage/v1/object/public/email-assets/anerfy-logo-dark.png"

interface DiagnosticLinkProps {
  nombre?: string
  diagnosticUrl?: string
}

const DiagnosticLinkEmail = ({ nombre, diagnosticUrl }: DiagnosticLinkProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>10 minutos que pueden ahorrarte meses de proceso</Preview>
    <Body style={main}>
      {/* Dark header band — matches website nav */}
      <Section style={headerBand}>
        <Container style={headerContainer}>
          <Img src={LOGO_URL} alt="ANERFY" width="120" height="auto" style={logoImg} />
        </Container>
      </Section>

      <Container style={container}>
        <Heading style={h1}>
          {nombre ? `Hola ${nombre},` : 'Hola,'}
        </Heading>

        <Text style={text}>
          Te preparamos el <strong style={bold}>Diagnóstico Migratorio</strong>.
        </Text>

        <Text style={text}>
          Son 10-15 minutos donde evaluamos en qué punto estás con tu
          homologación — documentación, idioma, estrategia, financiamiento —
          y al final te generamos un plan de acción basado en tu situación,
          no uno genérico.
        </Text>

        {diagnosticUrl && (
          <Section style={buttonSection}>
            <Button style={button} href={diagnosticUrl}>
              Comenzar mi diagnóstico
            </Button>
          </Section>
        )}

        <Text style={linkNote}>
          El link es personal y solo se puede usar una vez.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          — Equipo Anerfy
        </Text>
      </Container>

      {/* Dark footer band */}
      <Section style={footerBand}>
        <Container style={footerContainer}>
          <Text style={footerText}>Anerkennung + Simplify</Text>
        </Container>
      </Section>
    </Body>
  </Html>
)

export const template = {
  component: DiagnosticLinkEmail,
  subject: 'Tu diagnóstico migratorio está listo',
  displayName: 'Link de diagnóstico',
  previewData: {
    nombre: 'María Laura',
    diagnosticUrl: 'https://anerfy.com/diagnostico/abc12345',
  },
} satisfies TemplateEntry

// ── Brand tokens (from index.css) ──
// --background: 220 30% 6%  → #0d1117
// --primary: 220 80% 48%    → #1a56db
// --foreground: 220 10% 95% → #eff1f5
// --muted-foreground: 220 10% 55% → #838a96
const BG_DARK = '#0d1117'
const PRIMARY = '#1a56db'
const FG_LIGHT = '#eff1f5'
const MUTED = '#838a96'
const DARK_TEXT = '#0f172a'
const BODY_TEXT = '#334155'
const BORDER = '#1e293b'

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Geist', 'Space Grotesk', 'Segoe UI', Arial, sans-serif",
  margin: '0',
  padding: '0',
}

// Dark header matching website nav
const headerBand = {
  backgroundColor: BG_DARK,
  padding: '24px 0',
  textAlign: 'center' as const,
}
const headerContainer = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '0 28px',
}
const logoImg = {
  margin: '0 auto',
  display: 'block' as const,
}

const container = {
  padding: '36px 28px 24px',
  maxWidth: '520px',
  margin: '0 auto',
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
const bold = {
  color: DARK_TEXT,
  fontWeight: '600' as const,
}
const buttonSection = {
  textAlign: 'center' as const,
  margin: '28px 0',
}
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
const linkNote = {
  fontSize: '13px',
  color: MUTED,
  margin: '0 0 24px',
  textAlign: 'center' as const,
}
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const footer = {
  fontSize: '14px',
  color: BODY_TEXT,
  lineHeight: '1.5',
}

// Dark footer band
const footerBand = {
  backgroundColor: BG_DARK,
  padding: '16px 0',
  textAlign: 'center' as const,
}
const footerContainer = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '0 28px',
}
const footerText = {
  fontSize: '11px',
  color: MUTED,
  margin: '0',
  letterSpacing: '0.5px',
}
