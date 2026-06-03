import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const LOGO_URL = "https://omtmccscfnxqagmpdxnw.supabase.co/storage/v1/object/public/email-assets/anerfy-logo-dark.png"

interface MiniScoreProps {
  nombre?: string
  score?: number
  fortalezas?: string[]
  atencion?: string[]
  ctaUrl?: string
}

const MiniScoreEmail = ({ nombre, score, fortalezas = [], atencion = [], ctaUrl }: MiniScoreProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu Anerfy Score preliminar y tu siguiente paso</Preview>
    <Body style={main}>
      {/* Clean header */}
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
          {nombre ? `Hola ${nombre},` : 'Hola,'}
        </Heading>

        <Text style={text}>
          Calculamos tu <strong style={bold}>Anerfy Score preliminar</strong> a partir de tus
          respuestas. Es una primera lectura orientativa de qué tan listo estás para ejercer
          en Alemania.
        </Text>

        {typeof score === 'number' && (
          <Section style={scoreCard}>
            <Text style={scoreLabel}>TU ANERFY SCORE PRELIMINAR</Text>
            <Text style={scoreValue}>{score}<span style={scoreOutOf}>/100</span></Text>
          </Section>
        )}

        {fortalezas.length > 0 && (
          <>
            <Text style={sectionTitle}>A tu favor</Text>
            {fortalezas.map((f, i) => (
              <Text key={i} style={bullet}><span style={bulletGood}>›</span> {f}</Text>
            ))}
          </>
        )}

        {atencion.length > 0 && (
          <>
            <Text style={sectionTitle}>A trabajar</Text>
            {atencion.map((f, i) => (
              <Text key={i} style={bullet}><span style={bulletWarn}>›</span> {f}</Text>
            ))}
          </>
        )}

        <Text style={text}>
          Esto es solo la foto preliminar con 7 preguntas. Tu <strong style={bold}>Diagnóstico
          Migratorio completo</strong> cruza más de 50 variables y te entrega un plan de acción
          paso a paso, hecho para tu situación.
        </Text>

        {ctaUrl && (
          <Section style={buttonSection}>
            <Button style={button} href={ctaUrl}>
              Ver mi diagnóstico completo
            </Button>
          </Section>
        )}

        <Hr style={hr} />

        <Text style={footer}>— Equipo Anerfy</Text>
      </Container>

      {/* Simple footer */}
      <Section style={footerBand}>
        <Container style={footerContainer}>
          <Text style={footerTagline}>Anerkennung + Simplify</Text>
        </Container>
      </Section>
    </Body>
  </Html>
)

export const template = {
  component: MiniScoreEmail,
  subject: 'Tu Anerfy Score preliminar está listo',
  displayName: 'Mini-score (gancho gratis)',
  previewData: {
    nombre: 'María Laura',
    score: 72,
    fortalezas: ['Tu nivel de alemán ya juega a tu favor', 'Tienes margen financiero para el proceso'],
    atencion: ['Aún no hay un orden claro de trámites'],
    ctaUrl: 'https://anerfy.com/asesoria',
  },
} satisfies TemplateEntry

// ── Brand tokens (shared with diagnostic-link) ──
const PRIMARY = '#1a56db'
const DARK_TEXT = '#0f172a'
const BODY_TEXT = '#334155'
const MUTED = '#94a3b8'
const BORDER = '#e2e8f0'
const LIGHT_BG = '#f8fafc'
const SUCCESS = '#16a34a'
const WARN = '#d97706'

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
const text = { fontSize: '15px', color: BODY_TEXT, lineHeight: '1.7', margin: '0 0 16px' }
const bold = { color: DARK_TEXT, fontWeight: '600' as const }
const scoreCard = {
  textAlign: 'center' as const, backgroundColor: LIGHT_BG, border: `1px solid ${BORDER}`,
  borderRadius: '12px', padding: '20px', margin: '8px 0 24px',
}
const scoreLabel = {
  fontSize: '11px', fontWeight: '600' as const, color: PRIMARY,
  letterSpacing: '1.5px', margin: '0 0 6px',
}
const scoreValue = {
  fontSize: '40px', fontWeight: '700' as const, color: PRIMARY, margin: '0', lineHeight: '1',
}
const scoreOutOf = { fontSize: '18px', fontWeight: '600' as const, color: MUTED }
const sectionTitle = {
  fontSize: '12px', fontWeight: '700' as const, color: DARK_TEXT,
  textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '16px 0 8px',
}
const bullet = { fontSize: '15px', color: BODY_TEXT, lineHeight: '1.6', margin: '0 0 6px' }
const bulletGood = { color: SUCCESS, fontWeight: '700' as const, marginRight: '8px' }
const bulletWarn = { color: WARN, fontWeight: '700' as const, marginRight: '8px' }
const buttonSection = { textAlign: 'center' as const, margin: '28px 0' }
const button = {
  backgroundColor: PRIMARY, color: '#ffffff', fontSize: '15px', fontWeight: '600' as const,
  padding: '14px 36px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block',
}
const hr = { borderColor: BORDER, margin: '24px 0' }
const footer = { fontSize: '14px', color: BODY_TEXT, lineHeight: '1.5' }
const footerBand = { backgroundColor: '#ffffff', padding: '0 0 28px' }
const footerContainer = {
  maxWidth: '520px', margin: '0 auto', padding: '0 28px', textAlign: 'center' as const,
}
const footerTagline = { fontSize: '11px', color: MUTED, margin: '0', letterSpacing: '0.5px' }
