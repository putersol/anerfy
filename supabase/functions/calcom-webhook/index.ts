import { createClient } from 'jsr:@supabase/supabase-js@2'
import { createHmac } from 'node:crypto'

// Cal.com sends a HMAC-SHA256 signature in the `Cal-Signature-256` header
// using the webhook secret defined in Cal.com dashboard → Webhooks.
const CAL_WEBHOOK_SECRET = Deno.env.get('CALCOM_WEBHOOK_SECRET') ?? ''

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

function verifySignature(body: string, sig: string): boolean {
  if (!CAL_WEBHOOK_SECRET) return true  // skip in dev if secret not set
  const expected = createHmac('sha256', CAL_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')
  return expected === sig
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.text()
  const sig = req.headers.get('Cal-Signature-256') ?? ''

  if (!verifySignature(body, sig)) {
    console.error('Cal.com webhook signature invalid')
    return new Response('Invalid signature', { status: 400 })
  }

  let payload: any
  try {
    payload = JSON.parse(body)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  // Solo procesamos BOOKING_CREATED
  if (payload.triggerEvent !== 'BOOKING_CREATED') {
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const booking = payload.payload
  const bookingUid: string = booking?.uid
  const attendeeEmail: string = booking?.attendees?.[0]?.email
  const startTime: string = booking?.startTime
  // submission_id pasa como metadata desde el link del booking button
  const submissionId: string = booking?.metadata?.submission_id

  if (!submissionId || !attendeeEmail) {
    console.warn('Cal.com webhook: missing submission_id or email', { bookingUid, attendeeEmail })
    return new Response(JSON.stringify({ received: true, skipped: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Idempotencia: no duplicar si ya procesamos este booking
  const { data: existing } = await supabase
    .from('diagnostico_submissions')
    .select('submission_id')
    .eq('calcom_booking_uid', bookingUid)
    .maybeSingle()

  if (existing) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Actualizar submission con datos de la reunión
  const { error } = await supabase
    .from('diagnostico_submissions')
    .update({
      meeting_scheduled_at: new Date().toISOString(),
      meeting_start_at: startTime,
      calcom_booking_uid: bookingUid,
    })
    .eq('submission_id', submissionId)

  if (error) {
    console.error('Error updating submission with booking:', error)
    return new Response('DB error', { status: 500 })
  }

  // Notificar a Dieter y Alberto que hay reunión agendada
  const sendNotification = async (toEmail: string) => {
    try {
      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'reunion-agendada-asesor',
          recipientEmail: toEmail,
          idempotencyKey: `reunion-agendada-${bookingUid}-${toEmail}`,
          templateData: {
            attendee_email: attendeeEmail,
            submission_id: submissionId,
            meeting_start_at: startTime,
          },
        },
      })
    } catch (err) {
      console.error(`Notification to ${toEmail} failed:`, err)
    }
  }

  await Promise.all([
    sendNotification('dieterbrodersen@icloud.com'),
    sendNotification('albertodiaz2184@gmail.com'),
  ])

  console.log('Cal.com booking processed', { submissionId, attendeeEmail, bookingUid })

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
