import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: shop } = await supabase
    .from('barbershops')
    .select('id, nome, slug, endereco, telefone')
    .eq('slug', slug)
    .eq('ativo', true)
    .single()

  if (!shop) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { data: services } = await supabase
    .from('services')
    .select('id, nome, preco, duracao_min')
    .eq('barbershop_id', shop.id)
    .eq('ativo', true)
    .order('nome')

  const { data: hours } = await supabase
    .from('business_hours')
    .select('*')
    .eq('barbershop_id', shop.id)

  return NextResponse.json({ shop, services: services ?? [], hours: hours ?? [] })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimit(`book:${ip}`, { max: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde um momento.' }, { status: 429 })
  }

  const { slug } = await params
  const { nome, email, servico, preco, data, horario, barbeiro } = await req.json()

  if (!nome || !email || !servico || !data || !horario)
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })

  // Input validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (typeof email !== 'string' || !emailRegex.test(email) || email.length > 254)
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })

  if (typeof nome !== 'string' || nome.length > 200)
    return NextResponse.json({ error: 'Nome inválido' }, { status: 400 })

  // Validate date format (YYYY-MM-DD) and ensure it's not in the past
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(data)) return NextResponse.json({ error: 'Data inválida' }, { status: 400 })
  const bookingDate = new Date(data + 'T12:00:00')
  if (isNaN(bookingDate.getTime())) return NextResponse.json({ error: 'Data inválida' }, { status: 400 })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (bookingDate < today) return NextResponse.json({ error: 'Data não pode ser no passado' }, { status: 400 })

  // Validate time format (HH:MM)
  const timeRegex = /^\d{2}:\d{2}$/
  if (!timeRegex.test(horario)) return NextResponse.json({ error: 'Horário inválido' }, { status: 400 })

  const { data: shop } = await supabase
    .from('barbershops')
    .select('id, nome, endereco')
    .eq('slug', slug)
    .single()

  if (!shop) return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 })

  // Double-check slot availability
  const { data: existing } = await supabase
    .from('appointments')
    .select('id')
    .eq('barbershop_id', shop.id)
    .eq('data', data)
    .eq('horario', horario)
    .eq('status', 'confirmed')

  if (existing && existing.length > 0)
    return NextResponse.json({ error: 'Horário não disponível' }, { status: 409 })

  const { data: appt, error } = await supabase
    .from('appointments')
    .insert({
      barbershop_id: shop.id,
      client_nome: nome,
      client_email: email,
      servico,
      preco: preco ?? null,
      data,
      horario,
      barbeiro: barbeiro ?? null,
      status: 'confirmed',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 })

  // Optional: send confirmation email via Resend
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey && email) {
    const [year, month, day] = data.split('-')
    const dateFormatted = `${day}/${month}/${year}`
    const gcalStart = `${data.replace(/-/g, '')}T${horario.replace(':', '')}00`
    const [h, m] = horario.split(':').map(Number)
    const endDate = new Date(Number(year), Number(month) - 1, Number(day), h, m + 30)
    const gcalEnd = `${endDate.getFullYear()}${String(endDate.getMonth()+1).padStart(2,'0')}${String(endDate.getDate()).padStart(2,'0')}T${String(endDate.getHours()).padStart(2,'0')}${String(endDate.getMinutes()).padStart(2,'0')}00`
    const gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${shop.nome} - ${servico}`)}&dates=${gcalStart}/${gcalEnd}&location=${encodeURIComponent(shop.endereco || '')}&details=${encodeURIComponent(`Serviço: ${servico}${preco ? ` (R$${preco})` : ''}\nLocal: ${shop.endereco || ''}`)}`

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `${shop.nome} <onboarding@resend.dev>`,
        to: email,
        subject: `✅ Agendamento confirmado — ${shop.nome}`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#111;margin-bottom:4px">Agendamento confirmado!</h2>
          <p style="color:#555;margin-top:0">Olá, ${nome.replace(/[<>&"']/g, (c: string) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c] ?? c)}! Seu horário está reservado.</p>
          <div style="background:#f5f5f5;border-radius:10px;padding:16px;margin:20px 0">
            <p style="margin:4px 0"><strong>Serviço:</strong> ${servico.replace(/[<>&"']/g, (c: string) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c] ?? c)}${preco ? ` — R$${Number(preco).toFixed(2).replace('.',',')}` : ''}</p>
            <p style="margin:4px 0"><strong>Data:</strong> ${dateFormatted}</p>
            <p style="margin:4px 0"><strong>Horário:</strong> ${horario}</p>
            ${shop.endereco ? `<p style="margin:4px 0"><strong>Local:</strong> ${shop.endereco}</p>` : ''}
          </div>
          <a href="${gcalLink}" style="display:inline-block;background:#00e5a0;color:#000;font-weight:600;text-decoration:none;padding:10px 20px;border-radius:8px;margin-top:4px">
            Adicionar ao Google Agenda
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px">Para cancelar ou remarcar, entre em contato com a barbearia.</p>
        </div>`,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true, appointment: appt })
}
