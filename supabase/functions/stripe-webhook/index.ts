import Stripe from 'npm:stripe@14'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

function generateToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  // Solo procesamos checkout completados
  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const email = session.customer_details?.email || session.customer_email
  const nombre = session.customer_details?.name || null
  const amountCents = session.amount_total || 0

  if (!email) {
    console.error('No email in Stripe session:', session.id)
    return new Response('No customer email', { status: 400 })
  }

  // Idempotencia: si ya procesamos este session_id, no duplicar
  const { data: existing } = await supabase
    .from('payments')
    .select('payment_id')
    .eq('stripe_session_id', session.id)
    .maybeSingle()

  if (existing) {
    console.log('Session already processed:', session.id)
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 1. Registrar pago
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      email,
      nombre,
      amount_cents: amountCents,
      currency: session.currency || 'eur',
      status: 'paid',
      product: 'diagnostico',
      stripe_session_id: session.id,
    })
    .select('payment_id')
    .single()

  if (paymentError) {
    console.error('Error inserting payment:', paymentError)
    return new Response('DB error', { status: 500 })
  }

  // 2. Crear token de diagnóstico (30 días de validez)
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  const { error: tokenError } = await supabase
    .from('diagnostic_tokens')
    .insert({
      token,
      email,
      nombre,
      created_by: 'stripe',
      expires_at: expiresAt.toISOString(),
      payment_id: payment.payment_id,
    })

  if (tokenError) {
    console.error('Error inserting diagnostic token:', tokenError)
    return new Response('DB error on token', { status: 500 })
  }

  // 3. Enviar email con link de diagnóstico (belt-and-suspenders:
  //    el Trigger A de la BD también lo intenta, pero esta llamada
  //    directa garantiza el envío aunque el trigger no esté activo)
  const diagnosticUrl = `https://anerfy.com/diagnostico/${token}`
  try {
    await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'diagnostic-link',
        recipientEmail: email,
        idempotencyKey: `diagnostic-link-${token}`,
        templateData: {
          nombre: nombre || undefined,
          diagnosticUrl,
        },
      },
    })
    console.log('Diagnostic link email sent', { email, token })
  } catch (err) {
    // Non-fatal: el trigger A puede haberlo enviado ya
    console.error('Direct email send failed (non-fatal):', err)
  }

  console.log('Stripe checkout processed', {
    email,
    token,
    paymentId: payment.payment_id,
    sessionId: session.id,
  })

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
