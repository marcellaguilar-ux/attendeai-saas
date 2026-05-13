import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/rate-limit'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimit(`cadastro:${ip}`, { max: 5, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde um momento.' }, { status: 429 })
  }

  const { nome, email, password, barbearia, telefone } = await req.json()

  // Input validation
  if (!nome || !email || !password || !barbearia) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  if (typeof nome !== 'string' || nome.length > 200) {
    return NextResponse.json({ error: 'Nome inválido' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (typeof email !== 'string' || !emailRegex.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'Senha deve ter no mínimo 8 caracteres' }, { status: 400 })
  }

  if (typeof barbearia !== 'string' || barbearia.length > 200) {
    return NextResponse.json({ error: 'Nome da barbearia inválido' }, { status: 400 })
  }

  if (telefone && (typeof telefone !== 'string' || telefone.length > 30)) {
    return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 })
  }

  // 1. Criar usuário no Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 400 })
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
