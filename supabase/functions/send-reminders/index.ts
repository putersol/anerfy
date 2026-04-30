import { createClient } from 'jsr:@supabase/supabase-js@2'

// Two reminder cascades:
//
// A) Fill-diagnostic reminders (paid but didn't fill the form yet):
//    - Reminder 1: 24h after token created (window 23-25h)
//    - Reminder 2: 72h after token created (window 71-73h)
//
// B) Booking reminders (filled diagnostic but didn't book the asesoría yet):
//    - Reminder 1: 24h after status='completed' (window 23-25h)
//    - Reminder 2: 72h after status='completed' (window 71-73h)
//    - Reminder 3: 7d  after status='completed' (window 6d23h-7d1h)
//
// All windows are 2h wide so an hourly cron hits each candidate exactly once.
// Sent timestamps are written back to prevent duplicates.

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const HOUR = 60 * 60 * 1000

// ── Fill-diagnostic reminders ────────────────────────────────────────────────
interface TokenRow {
  id: number
  token: string
  email: string
  nombre: string | null
  created_at: string
  reminder_1_sent_at: string | null
  reminder_2_sent_at: string | null
}

async function sendFillReminder(token: TokenRow, kind: 1 | 2): Promise<boolean> {
  const templateName = kind === 1 ? 'reminder-fill-1' : 'reminder-fill-2'
  const diagnosticUrl = `https://anerfy.com/diagnostico/${token.token}`
  const idempotencyKey = `${templateName}-${token.token}`

  try {
    const { error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName,
        recipientEmail: token.email,
        idempotencyKey,
        templateData: {
          nombre: token.nombre || undefined,
          diagnosticUrl,
        },
      },
    })
    if (error) {
      console.error(`Fill reminder ${kind} send failed for ${token.email}:`, error)
      return false
    }

    const updateField = kind === 1 ? 'reminder_1_sent_at' : 'reminder_2_sent_at'
    await supabase
      .from('diagnostic_tokens')
      .update({ [updateField]: new Date().toISOString() })
      .eq('id', token.id)

    return true
  } catch (err) {
    console.error(`Fill reminder ${kind} exception for ${token.email}:`, err)
    return false
  }
}

// ── Booking reminders ────────────────────────────────────────────────────────
interface SubmissionRow {
  submission_id: string
  email: string
  nombre_completo: string | null
  completed_at: string | null
  meeting_scheduled_at: string | null
  booking_reminder_1_sent_at: string | null
  booking_reminder_2_sent_at: string | null
  booking_reminder_3_sent_at: string | null
}

function buildBookingUrl(s: SubmissionRow): string {
  const name = encodeURIComponent(s.nombre_completo || '')
  const email = encodeURIComponent(s.email || '')
  return `https://cal.com/anerfy/asesoria-90min?name=${name}&email=${email}&metadata[submission_id]=${s.submission_id}`
}

async function sendBookingReminder(s: SubmissionRow, kind: 1 | 2 | 3): Promise<boolean> {
  const templateName = `booking-reminder-${kind}` as const
  const idempotencyKey = `${templateName}-${s.submission_id}`
  const nombre = s.nombre_completo
    ? s.nombre_completo.split(' ')[0]
    : undefined

  try {
    const { error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName,
        recipientEmail: s.email,
        idempotencyKey,
        templateData: {
          nombre,
          bookingUrl: buildBookingUrl(s),
        },
      },
    })
    if (error) {
      console.error(`Booking reminder ${kind} send failed for ${s.email}:`, error)
      return false
    }

    const updateField =
      kind === 1 ? 'booking_reminder_1_sent_at'
      : kind === 2 ? 'booking_reminder_2_sent_at'
      : 'booking_reminder_3_sent_at'

    await supabase
      .from('diagnostico_submissions')
      .update({ [updateField]: new Date().toISOString() })
      .eq('submission_id', s.submission_id)

    return true
  } catch (err) {
    console.error(`Booking reminder ${kind} exception for ${s.email}:`, err)
    return false
  }
}

async function fetchBookingCandidates(
  now: Date,
  hoursAgo: number,
  sentAtField: string,
): Promise<SubmissionRow[]> {
  const lower = new Date(now.getTime() - (hoursAgo + 1) * HOUR).toISOString()
  const upper = new Date(now.getTime() - (hoursAgo - 1) * HOUR).toISOString()

  const { data, error } = await supabase
    .from('diagnostico_submissions')
    .select(
      'submission_id, email, nombre_completo, completed_at, meeting_scheduled_at, booking_reminder_1_sent_at, booking_reminder_2_sent_at, booking_reminder_3_sent_at',
    )
    .eq('status', 'completed')
    .is('meeting_scheduled_at', null)
    .is(sentAtField, null)
    .gte('completed_at', lower)
    .lte('completed_at', upper)

  if (error) {
    console.error(`Error fetching booking candidates (${hoursAgo}h):`, error)
    return []
  }
  return (data || []) as SubmissionRow[]
}

Deno.serve(async (_req) => {
  const now = new Date()

  // ─── Fill diagnostic: 24h ───
  const f1Lower = new Date(now.getTime() - 25 * HOUR).toISOString()
  const f1Upper = new Date(now.getTime() - 23 * HOUR).toISOString()
  const { data: f1Tokens, error: f1Err } = await supabase
    .from('diagnostic_tokens')
    .select('id, token, email, nombre, created_at, reminder_1_sent_at, reminder_2_sent_at')
    .eq('used', false)
    .is('reminder_1_sent_at', null)
    .gte('created_at', f1Lower)
    .lte('created_at', f1Upper)
    .or('expires_at.is.null,expires_at.gt.' + now.toISOString())
  if (f1Err) console.error('Error fetching fill-24h tokens:', f1Err)

  // ─── Fill diagnostic: 72h ───
  const f2Lower = new Date(now.getTime() - 73 * HOUR).toISOString()
  const f2Upper = new Date(now.getTime() - 71 * HOUR).toISOString()
  const { data: f2Tokens, error: f2Err } = await supabase
    .from('diagnostic_tokens')
    .select('id, token, email, nombre, created_at, reminder_1_sent_at, reminder_2_sent_at')
    .eq('used', false)
    .is('reminder_2_sent_at', null)
    .gte('created_at', f2Lower)
    .lte('created_at', f2Upper)
    .or('expires_at.is.null,expires_at.gt.' + now.toISOString())
  if (f2Err) console.error('Error fetching fill-72h tokens:', f2Err)

  // ─── Booking: 24h / 72h / 7d ───
  const b1 = await fetchBookingCandidates(now, 24, 'booking_reminder_1_sent_at')
  const b2 = await fetchBookingCandidates(now, 72, 'booking_reminder_2_sent_at')
  const b3 = await fetchBookingCandidates(now, 24 * 7, 'booking_reminder_3_sent_at')

  let sentF1 = 0, sentF2 = 0, sentB1 = 0, sentB2 = 0, sentB3 = 0

  for (const t of (f1Tokens || []) as TokenRow[]) {
    if (await sendFillReminder(t, 1)) sentF1++
  }
  for (const t of (f2Tokens || []) as TokenRow[]) {
    if (await sendFillReminder(t, 2)) sentF2++
  }
  for (const s of b1) {
    if (await sendBookingReminder(s, 1)) sentB1++
  }
  for (const s of b2) {
    if (await sendBookingReminder(s, 2)) sentB2++
  }
  for (const s of b3) {
    if (await sendBookingReminder(s, 3)) sentB3++
  }

  const result = {
    timestamp: now.toISOString(),
    fill: {
      candidates_24h: f1Tokens?.length ?? 0,
      candidates_72h: f2Tokens?.length ?? 0,
      sent_24h: sentF1,
      sent_72h: sentF2,
    },
    booking: {
      candidates_24h: b1.length,
      candidates_72h: b2.length,
      candidates_7d: b3.length,
      sent_24h: sentB1,
      sent_72h: sentB2,
      sent_7d: sentB3,
    },
  }

  console.log('send-reminders run', result)

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
