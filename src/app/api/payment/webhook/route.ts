import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  const secret = process.env.INFINITEPAY_WEBHOOK_SECRET
  if (!secret || !signature) return false
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  return expected === signature
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    // Verify webhook signature from payment provider
    const signature = req.headers.get('x-webhook-signature') || req.headers.get('x-infinitepay-signature')
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    const { order_nsu, transaction_nsu, capture_method, paid_amount } = body

    if (!order_nsu) return NextResponse.json({ error: 'order_nsu ausente' }, { status: 400 })

    // order_nsu format: {barbershop_id}_{plano}
    const lastUnderscore = order_nsu.lastIndexOf('_')
    const barbershop_id = order_nsu.substring(0, lastUnderscore)
    const plano = order_nsu.substring(lastUnderscore + 1)

    if (!barbershop_id || !plano) {
      return NextResponse.json({ error: 'order_nsu inválido' }, { status: 400 })
    }

    await supabaseAdmin
      .from('barbershops')
      .update({
        plan: plano,
        payment_status: 'paid',
        payment_transaction_nsu: transaction_nsu,
        paid_amount,
        paid_at: new Date().toISOString(),
      })
      .eq('id', barbershop_id)

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 400 })
  }
}
