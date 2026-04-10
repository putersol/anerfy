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
    <Head />
    <Preview>Tu diagnóstico migratorio personalizado te espera — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={logo}>{SITE_NAME}</Text>
        </Section>

        <Heading style={h1}>
          {nombre ? `Hola ${nombre},` : 'Hola,'}
        </Heading>

        <Text style={text}>
          Hemos preparado tu acceso exclusivo al <strong>Diagnóstico Migratorio</strong> de {SITE_NAME}.
          Este cuestionario evaluará tu situación actual y generará un plan de acción personalizado
          para tu proceso de homologación médica en Alemania.
        </Text>

        <Text style={text}>
          El diagnóstico toma aproximadamente <strong>10-15 minutos</strong> y cubre:
        </Text>

        <Text style={listText}>
          📋 Documentación y estado de proceso{'\n'}
          🗣️ Nivel de idioma alemán{'\n'}
          💰 Situación financiera{'\n'}
          🎯 Estrategia de homologación{'\n'}
          📊 Score competitivo personalizado
        </Text>

        {diagnosticUrl && (
          <Section style={buttonSection}>
            <Button style={button} href={diagnosticUrl}>
              Comenzar mi diagnóstico →
            </Button>
          </Section>
        )}

        <Text style={smallText}>
          Este link es personal e intransferible. Solo puede usarse una vez.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          Con tu mejor interés en mente,{'\n'}
          El equipo de {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DiagnosticLinkEmail,
  subject: 'Tu diagnóstico migratorio está listo — Anerfy',
  displayName: 'Link de diagnóstico',
  previewData: {
    nombre: 'María Laura',
    diagnosticUrl: 'https://anerfy.lovable.app/diagnostico/abc12345',
  },
} satisfies TemplateEntry

// Styles — brand: primary blue #1d4ed8, dark background theme adapted for white email bg
const main = { backgroundColor: '#ffffff', fontFamily: "'Geist', Arial, sans-serif" }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const headerSection = { marginBottom: '24px' }
const logo = { fontSize: '20px', fontWeight: '700' as const, color: '#1d4ed8', margin: '0' }
const h1 = { fontSize: '22px', fontWeight: '600' as const, color: '#111827', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const listText = { fontSize: '14px', color: '#374151', lineHeight: '2', margin: '0 0 20px', whiteSpace: 'pre-line' as const }
const buttonSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = {
  backgroundColor: '#1d4ed8',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  padding: '12px 28px',
  borderRadius: '8px',
  textDecoration: 'none',
}
const smallText = { fontSize: '12px', color: '#9ca3af', margin: '0 0 24px', textAlign: 'center' as const }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#6b7280', lineHeight: '1.5', whiteSpace: 'pre-line' as const }
