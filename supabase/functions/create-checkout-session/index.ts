import Stripe from 'npm:stripe@14'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })

// Precio del diagnóstico completo. Crear el Price en Stripe y poner su id aquí
// (Supabase → Edge Functions → Secrets: STRIPE_PRICE_ID=price_xxx).
// Mientras no exista, el endpoint responde 503 y el frontend muestra "Próximamente".
const PRICE_ID = Deno.env.get('STRIPE_PRICE_ID') || ''
const SITE_URL = Deno.env.get('SITE_URL') || 'https://anerfy.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // Sin price configurado todavía → el paywall sigue "Próximamente"
  if (!PRICE_ID) return json({ error: 'price_not_configured' }, 503)

  let payload: { email?: string; nombre?: string; answers?: Record<string, string> }
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const email = (payload.email || '').trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return json({ error: 'invalid_email' }, 400)

  // Metadata: las 7 respuestas del lead magnet viajan con el pago (máx 500 chars c/u)
  const metadata: Record<string, string> = { product: 'diagnostico', nombre: payload.nombre || '' }
  for (const [k, v] of Object.entries(payload.answers || {})) {
    metadata[`lead_${k}`] = String(v).slice(0, 480)
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      customer_email: email,
      metadata,
      payment_intent_data: { metadata },
      success_url: `${SITE_URL}/asesoria?pago=ok&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/asesoria?pago=cancelado`,
      locale: 'es',
      allow_promotion_codes: true,
    })
    return json({ url: session.url })
  } catch (err) {
    console.error('create-checkout-session error:', err)
    return json({ error: 'stripe_error' }, 500)
  }
})
