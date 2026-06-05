import { NextRequest, NextResponse } from 'next/server'

const PLANS: Record<string, { price: number; name: string }> = {
  starter:  { price: 19700, name: 'AttendeAI Starter' },
  pro:      { price: 39700, name: 'AttendeAI Pro' },
  business: { price: 69700, name: 'AttendeAI Business' },
}

export async function POST(req: NextRequest) {
  const { plano, barbershop_id, customer } = await req.json()

  const plan = PLANS[plano]
  if (!plan) return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })

  const order_nsu = `${barbershop_id}_${plano}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://attendeai.ia.br'

  const body: Record<string, unknown> = {
    handle: process.env.INFINITEPAY_HANDLE,
    items: [{ quantity: 1, price: plan.price, description: plan.name }],
    order_nsu,
    redirect_url: `${siteUrl}/pagamento-concluido`,
    webhook_url: `${siteUrl}/api/payment/webhook`,
  }

  if (customer?.name || customer?.email) {
    body.customer = {
      ...(customer.name  && { name: customer.name }),
      ...(customer.email && { email: customer.email }),
      ...(customer.phone && { phone_number: customer.phone }),
    }
  }

  const res = await fetch('https://api.checkout.infinitepay.io/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ error: 'Erro ao criar link de pagamento', detail: data }, { status: 502 })
  }

  // InfinitePay may return the link under different field names
  const url = data.url || data.link || data.checkout_url || data.payment_url
  if (!url) {
    return NextResponse.json({ error: 'Link não retornado', detail: data }, { status: 502 })
  }

  return NextResponse.json({ url })
}
