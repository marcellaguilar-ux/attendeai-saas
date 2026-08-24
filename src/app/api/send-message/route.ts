import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

const VPS_URL = 'http://129.121.39.54:8082/send'
const VPS_API_KEY = 'attendeai-internal-vps-key'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { conversation_id, text } = await req.json()
  if (!conversation_id || !text?.trim()) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { data: userData } = await supabase
    .from('users').select('barbershop_id').eq('id', user.id).single()

  const { data: conv } = await supabase
    .from('conversations')
    .select('client_whatsapp')
    .eq('id', conversation_id)
    .eq('barbershop_id', userData?.barbershop_id)
    .single()

  if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })

  // Envia pelo WhatsApp via VPS (silencioso se falhar — número pode estar offline)
  try {
    await fetch(VPS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': VPS_API_KEY },
      body: JSON.stringify({ phone: conv.client_whatsapp, text: text.trim() }),
      signal: AbortSignal.timeout(8000),
    })
  } catch (e) {
    console.error('[send-message] VPS error:', e)
  }

  // Salva no histórico como mensagem do atendente humano
  await supabase.from('messages').insert({
    conversation_id,
    role: 'human',
    content: text.trim(),
  })
  await supabase.from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversation_id)

  return NextResponse.json({ ok: true })
}
