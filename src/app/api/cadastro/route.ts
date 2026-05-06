import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { nome, email, password, barbearia, telefone } = await req.json()

  // 1. Criar usuário no Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message || 'Erro ao criar conta' }, { status: 400 })
  }

  // 2. Criar barbearia
  const slug = barbearia.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Math.random().toString(36).slice(2, 6)

  const { data: shop, error: shopError } = await supabaseAdmin
    .from('barbershops')
    .insert({ nome: barbearia, slug, telefone })
    .select().single()

  if (shopError || !shop) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: 'Erro ao criar barbearia' }, { status: 400 })
  }

  // 3. Criar registro do usuário
  const { error: userError } = await supabaseAdmin
    .from('users')
    .insert({ id: authData.user.id, nome, email, barbershop_id: shop.id })

  if (userError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 400 })
  }

  return NextResponse.json({ ok: true, barbershop_id: shop.id })
}
