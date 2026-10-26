import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { barbershop_id, source, table_number, client_name, items } = body

  if (!barbershop_id || !items?.length) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  // Resolve table_id from number if present
  let table_id: string | null = null
  if (table_number) {
    const { data: table } = await supabase
      .from('cafe_tables')
      .select('id')
      .eq('barbershop_id', barbershop_id)
      .eq('number', table_number)
      .single()
    table_id = table?.id ?? null
  }

  const total = items.reduce(
    (sum: number, i: { unit_price: number; quantity: number }) => sum + i.unit_price * i.quantity,
    0
  )

  // Create order
  const { data: order, error: orderErr } = await supabase
    .from('menu_orders')
    .insert({
      barbershop_id,
      table_id,
      source: source || 'qrcode',
      client_name: client_name || null,
      total,
      status: 'recebido',
    })
    .select('id')
    .single()

  if (orderErr || !order) {
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
  }

  // Insert items
  const orderItems = items.map((i: {
    product_id: string; product_name: string; variant_label?: string
    unit_price: number; quantity: number; notes?: string
  }) => ({
    order_id: order.id,
    product_id: i.product_id,
    product_name: i.product_name,
    variant_label: i.variant_label || null,
    quantity: i.quantity,
    unit_price: i.unit_price,
    notes: i.notes || null,
  }))

  const { error: itemsErr } = await supabase
    .from('menu_order_items')
    .insert(orderItems)

  if (itemsErr) {
    return NextResponse.json({ error: 'Erro ao salvar itens' }, { status: 500 })
  }

  return NextResponse.json({ id: order.id, total })
}
