import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Anerfy"

interface DiagnosticLinkProps {
  nombre?: string
  diagnosticUrl?: string
}

const DiagnosticLinkEmail = ({ nombre, diagnosticUrl }: DiagnosticLinkProps) => (
  <Html lang="es" dir="ltr">
    <Head>
      <meta name="x-mailer" content="Anerfy" />
    </Head>
    <Preview>10 minutos que pueden ahorrarte meses de proceso</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Logo text — matches Space Grotesk bold brand */}
        <Section style={headerSection}>
          <Text style={logo}>ANERFY</Text>
          <Text style={tagline}>Anerkennung + Simplify</Text>
        </Section>

        <Heading style={h1}>
          {nombre ? `Hola ${nombre},` : 'Hola,'}
        </Heading>

        <Text style={text}>
          Te preparamos el <strong>Diagnóstico Migratorio</strong>.
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

        <Text style={smallText}>
          El link es personal y solo se puede usar una vez.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          — Equipo Anerfy
        </Text>
      </Container>
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

// Brand: navy blue primary hsl(220, 80%, 48%) ≈ #1a56db
// Font: Geist / Space Grotesk fallback to Arial
const PRIMARY = '#1a56db'
const DARK = '#0f172a'
const GRAY = '#475569'
const LIGHT_GRAY = '#94a3b8'
const BORDER = '#e2e8f0'

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Geist', 'Space Grotesk', 'Segoe UI', Arial, sans-serif",
}
const container = {
  padding: '40px 28px 32px',
  maxWidth: '520px',
  margin: '0 auto',
}
const headerSection = { marginBottom: '32px' }
const logo = {
  fontSize: '18px',
  fontWeight: '700' as const,
  color: DARK,
  letterSpacing: '2px',
  margin: '0',
}
const tagline = {
  fontSize: '11px',
  color: LIGHT_GRAY,
  margin: '2px 0 0',
  letterSpacing: '0.5px',
}
const h1 = {
  fontSize: '20px',
  fontWeight: '600' as const,
  color: DARK,
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: GRAY,
  lineHeight: '1.7',
  margin: '0 0 16px',
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
  padding: '14px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
}
const smallText = {
  fontSize: '13px',
  color: LIGHT_GRAY,
  margin: '0 0 24px',
  textAlign: 'center' as const,
}
const hr = { borderColor: BORDER, margin: '24px 0' }
const footer = {
  fontSize: '14px',
  color: GRAY,
  lineHeight: '1.5',
}
