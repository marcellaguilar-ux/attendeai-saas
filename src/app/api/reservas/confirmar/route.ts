import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function fmt(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export async function POST(req: NextRequest) {
  const { reserva_id, barbershop_id } = await req.json()
  if (!reserva_id || !barbershop_id) {
    return NextResponse.json({ error: 'reserva_id e barbershop_id obrigatórios' }, { status: 400 })
  }

  // Busca a reserva completa antes de confirmar
  const { data: reserva, error: fetchErr } = await supabase
    .from('reservas_pousada')
    .select('*')
    .eq('id', reserva_id)
    .eq('barbershop_id', barbershop_id)
    .single()

  if (fetchErr || !reserva) {
    return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 })
  }

  // Atualiza status para confirmada
  const { error: updateErr } = await supabase
    .from('reservas_pousada')
    .update({ status: 'confirmada', updated_at: new Date().toISOString() })
    .eq('id', reserva_id)
    .eq('barbershop_id', barbershop_id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  // Envia email de confirmação se houver email do cliente e RESEND_API_KEY
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey && reserva.cliente_email) {
    const checkin  = fmt(reserva.data_checkin)
    const checkout = fmt(reserva.data_checkout)
    const noites   = reserva.noites ?? 1
    const total    = reserva.valor_total ? `R$ ${Number(reserva.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null
    const entrada  = reserva.valor_entrada ? `R$ ${Number(reserva.valor_entrada).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Pousada El Capitan <reservas@elcapitan.com.br>',
        to: reserva.cliente_email,
        subject: '✅ Reserva confirmada — Pousada El Capitan',
        html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
  <img src="https://www.elcapitan.com.br/logo.png" alt="El Capitan" style="height:40px;margin-bottom:20px" onerror="this.style.display='none'" />
  <h2 style="margin:0 0 6px">Sua reserva foi confirmada!</h2>
  <p style="color:#555;margin:0 0 20px">Olá, ${reserva.cliente_nome}! Estamos felizes em recebê-lo(a) na Pousada El Capitan.</p>

  <div style="background:#f7f7f7;border-radius:10px;padding:18px;margin-bottom:20px">
    <p style="margin:4px 0"><strong>Acomodação:</strong> ${reserva.acomodacao_nome}</p>
    <p style="margin:4px 0"><strong>Check-in:</strong> ${checkin}</p>
    <p style="margin:4px 0"><strong>Check-out:</strong> ${checkout}</p>
    <p style="margin:4px 0"><strong>Noites:</strong> ${noites}</p>
    <p style="margin:4px 0"><strong>Hóspedes:</strong> ${reserva.adultos} adulto${reserva.adultos !== 1 ? 's' : ''}${reserva.criancas ? ` + ${reserva.criancas} criança${reserva.criancas !== 1 ? 's' : ''}` : ''}</p>
    ${total ? `<p style="margin:12px 0 4px"><strong>Valor total:</strong> ${total}</p>` : ''}
    ${entrada ? `<p style="margin:4px 0;color:#555">Entrada (50% pago): ${entrada}</p>` : ''}
  </div>

  <div style="background:#fffbe6;border:1px solid #ffe066;border-radius:10px;padding:14px;margin-bottom:20px;font-size:14px;color:#7a6000">
    <strong>Informações de chegada:</strong><br/>
    Endereço: Av. Vasco Neto, 153 — Barra Grande, Maraú, BA<br/>
    Check-in a partir das 14h · Check-out até as 11h<br/>
    WhatsApp recepção: <a href="https://wa.me/5573999536107" style="color:#7a6000">(73) 99953-6107</a>
  </div>

  <p style="color:#888;font-size:12px">ID da reserva: ${reserva.id}</p>
  <p style="color:#888;font-size:12px">Em caso de dúvidas, entre em contato com a recepção via WhatsApp ou pelo site <a href="https://www.elcapitan.com.br" style="color:#888">elcapitan.com.br</a>.</p>
</div>`,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
