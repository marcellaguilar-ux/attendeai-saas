import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { conversation_id, mode } = await req.json()
  if (!['bot', 'human'].includes(mode)) return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })

  const { data: userData } = await supabase
    .from('users').select('barbershop_id').eq('id', user.id).single()

  const { error } = await supabase
    .from('conversations')
    .update({ mode })
    .eq('id', conversation_id)
    .eq('barbershop_id', userData?.barbershop_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
