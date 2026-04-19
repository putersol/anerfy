/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

const buildSafeAccessUrl = (confirmationUrl: string) => {
  try {
    const authUrl = new URL(confirmationUrl)
    const redirectTo = authUrl.searchParams.get('redirect_to')

    if (!redirectTo) return confirmationUrl

    const appUrl = new URL(redirectTo)
    appUrl.pathname = '/mi-roadmap/acceso'
    appUrl.search = ''
    appUrl.hash = ''
    appUrl.searchParams.set('next', confirmationUrl)

    return appUrl.toString()
  } catch {
    return confirmationUrl
  }
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => {
  const accessUrl = buildSafeAccessUrl(confirmationUrl)

  return <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu enlace de acceso a tu Roadmap personalizado</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Accede a tu Roadmap</Heading>
        <Text style={text}>Hola 👋</Text>
        <Text style={text}>
          Haz clic en el botón para entrar a tu Roadmap personalizado de Anerfy y seguir tu camino hacia la Approbation en Alemania.
        </Text>
        <Button style={button} href={accessUrl}>
          Entrar a mi Roadmap
        </Button>
        <Text style={text}>
          El enlace expira en pocos minutos. Si no lo solicitaste, puedes ignorar este correo.
        </Text>
        <Text style={footer}>— El equipo de {siteName}</Text>
      </Container>
    </Body>
  </Html>
}

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '480px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#0d1117',
  margin: '0 0 24px',
}
const text = {
  fontSize: '15px',
  color: '#4b5563',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const button = {
  backgroundColor: '#1a56db',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '8px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 24px',
}
const footer = { fontSize: '12px', color: '#9ca3af', margin: '32px 0 0' }
