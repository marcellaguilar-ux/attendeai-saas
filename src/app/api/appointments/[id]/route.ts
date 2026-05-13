import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { status } = await req.json()

  if (!['cancelled', 'confirmed', 'done'].includes(status))
    return NextResponse.json({ error: 'Status inválido' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  // Garante que o agendamento pertence à barbearia do usuário
  const { data: userData } = await supabase
    .from('users')
    .select('barbershop_id')
    .eq('id', user.id)
    .single()

  if (!userData?.barbershop_id) {
    return NextResponse.json({ error: 'Usuário sem barbearia associada' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .eq('barbershop_id', userData.barbershop_id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Erro ao atualizar agendamento' }, { status: 500 })

  return NextResponse.json({ ok: true, appointment: data })
}
