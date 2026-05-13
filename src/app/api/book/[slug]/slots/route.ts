import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function genSlots(startH: number, endH: number, stepMin = 30): string[] {
  const slots: string[] = []
  for (let min = startH * 60; min < endH * 60; min += stepMin) {
    slots.push(`${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`)
  }
  return slots
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const date = req.nextUrl.searchParams.get('date') // YYYY-MM-DD

  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date) || isNaN(new Date(date + 'T12:00:00').getTime()))
    return NextResponse.json({ error: 'Formato de data inválido' }, { status: 400 })

  const { data: shop } = await supabase
    .from('barbershops')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!shop) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const dow = new Date(date + 'T12:00:00').getDay() // 0=Sun

  // Try business_hours table first
  const { data: bh } = await supabase
    .from('business_hours')
    .select('*')
    .eq('barbershop_id', shop.id)
    .eq('dia_semana', dow)
    .maybeSingle()

  let allSlots: string[]
  if (bh) {
    if (bh.fechado) return NextResponse.json({ slots: [] })
    const [sh] = (bh.hora_inicio || '09:00').split(':').map(Number)
    const [eh, em] = (bh.hora_fim || '19:30').split(':').map(Number)
    allSlots = genSlots(sh, eh + (em > 0 ? 1 : 0))
  } else {
    // Default: closed Sunday, Mon–Sat 9h–19:30
    if (dow === 0) return NextResponse.json({ slots: [] })
    allSlots = genSlots(9, 20) // 09:00–19:30
  }

  // Booked slots
  const { data: booked } = await supabase
    .from('appointments')
    .select('horario')
    .eq('barbershop_id', shop.id)
    .eq('data', date)
    .eq('status', 'confirmed')

  const bookedSet = new Set((booked ?? []).map(b => String(b.horario).slice(0, 5)))

  // Filter past times on today
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
  const nowMin = now.getHours() * 60 + now.getMinutes()

  const available = allSlots.filter(slot => {
    if (bookedSet.has(slot)) return false
    if (date === todayStr) {
      const [h, m] = slot.split(':').map(Number)
      return h * 60 + m > nowMin + 30
    }
    return true
  })

  return NextResponse.json({ slots: available })
}
