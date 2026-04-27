import { createClient } from 'jsr:@supabase/supabase-js@2'

// Recordatorio 1: 24h después de generar el token (ventana 23-25h)
// Recordatorio 2: 72h después de generar el token (ventana 71-73h)
// Solo se envían a tokens no usados y no expirados.

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

interface TokenRow {
  id: number
  token: string
  email: string
  nombre: string | null
  created_at: string
  reminder_1_sent_at: string | null
  reminder_2_sent_at: string | null
}

async function sendReminder(token: TokenRow, kind: 1 | 2): Promise<boolean> {
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
      console.error(`Reminder ${kind} send failed for ${token.email}:`, error)
      return false
    }

    const updateField = kind === 1 ? 'reminder_1_sent_at' : 'reminder_2_sent_at'
    await supabase
      .from('diagnostic_tokens')
      .update({ [updateField]: new Date().toISOString() })
      .eq('id', token.id)

    return true
  } catch (err) {
    console.error(`Reminder ${kind} exception for ${token.email}:`, err)
    return false
  }
}

Deno.serve(async (_req) => {
  const now = new Date()

  // ── Recordatorio 1: 24h ──
  const r1Lower = new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString()
  const r1Upper = new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString()

  const { data: r1Tokens, error: r1Err } = await supabase
    .from('diagnostic_tokens')
    .select('id, token, email, nombre, created_at, reminder_1_sent_at, reminder_2_sent_at')
    .eq('used', false)
    .is('reminder_1_sent_at', null)
    .gte('created_at', r1Lower)
    .lte('created_at', r1Upper)
    .or('expires_at.is.null,expires_at.gt.' + now.toISOString())

  if (r1Err) console.error('Error fetching 24h tokens:', r1Err)

  // ── Recordatorio 2: 72h ──
  const r2Lower = new Date(now.getTime() - 73 * 60 * 60 * 1000).toISOString()
  const r2Upper = new Date(now.getTime() - 71 * 60 * 60 * 1000).toISOString()

  const { data: r2Tokens, error: r2Err } = await supabase
    .from('diagnostic_tokens')
    .select('id, token, email, nombre, created_at, reminder_1_sent_at, reminder_2_sent_at')
    .eq('used', false)
    .is('reminder_2_sent_at', null)
    .gte('created_at', r2Lower)
    .lte('created_at', r2Upper)
    .or('expires_at.is.null,expires_at.gt.' + now.toISOString())

  if (r2Err) console.error('Error fetching 72h tokens:', r2Err)

  let sent1 = 0
  let sent2 = 0

  for (const t of (r1Tokens || []) as TokenRow[]) {
    if (await sendReminder(t, 1)) sent1++
  }
  for (const t of (r2Tokens || []) as TokenRow[]) {
    if (await sendReminder(t, 2)) sent2++
  }

  const result = {
    timestamp: now.toISOString(),
    candidates_24h: r1Tokens?.length ?? 0,
    candidates_72h: r2Tokens?.length ?? 0,
    sent_24h: sent1,
    sent_72h: sent2,
  }

  console.log('send-reminders run', result)

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
