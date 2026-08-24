import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    // Verifica chave secreta do webhook (InfinitePay envia no header ou podemos exigir no body)
    const webhookSecret = process.env.INFINITEPAY_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature = req.headers.get('x-infinitepay-signature') || req.headers.get('authorization')
      if (!signature || !signature.includes(webhookSecret)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body = await req.json()
    const { order_nsu, transaction_nsu, paid_amount, status } = body

    // Aceita apenas pagamentos confirmados
    const paidStatuses = ['paid', 'approved', 'captured', 'succeeded']
    if (status && !paidStatuses.includes(String(status).toLowerCase())) {
      return NextResponse.json({ ok: true, ignored: true })
    }

    if (!order_nsu) return NextResponse.json({ error: 'order_nsu ausente' }, { status: 400 })

    // order_nsu format: {barbershop_id}_{plano}
    const lastUnderscore = order_nsu.lastIndexOf('_')
    const barbershop_id = order_nsu.substring(0, lastUnderscore)
    const plano = order_nsu.substring(lastUnderscore + 1)

    if (!barbershop_id || !plano) {
      return NextResponse.json({ error: 'order_nsu inválido' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('barbershops')
      .update({
        plano,
        payment_status: 'paid',
        payment_transaction_nsu: transaction_nsu || null,
        paid_amount: paid_amount || null,
        paid_at: new Date().toISOString(),
      })
      .eq('id', barbershop_id)

    if (error) {
      console.error('[webhook] Supabase error:', error.message)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[webhook] error:', e)
    return NextResponse.json({ error: 'Erro interno' }, { status: 400 })
  }
}
