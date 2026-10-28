import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const VPS_BASE_URL = process.env.VPS_BASE_URL ?? 'http://129.121.39.54:8080'
const VPS_API_KEY = process.env.VPS_API_KEY ?? 'attendeai-internal-vps-key'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Busca a instância WhatsApp do barbershop do usuário logado
  const { data: userRow } = await supabase
    .from('users')
    .select('barbershop_id')
    .eq('id', user.id)
    .single()

  let vpsUrl = VPS_BASE_URL
  if (userRow?.barbershop_id) {
    const { data: instance } = await supabase
      .from('whatsapp_instances')
      .select('vps_url')
      .eq('barbershop_id', userRow.barbershop_id)
      .single()
    if (instance?.vps_url) vpsUrl = instance.vps_url
  }

  try {
    const headers: Record<string, string> = { 'cache-control': 'no-store' }
    if (vpsUrl === VPS_BASE_URL) headers['x-api-key'] = VPS_API_KEY

    const res = await fetch(`${vpsUrl}/qr.json`, { headers, cache: 'no-store' })

    if (!res.ok) {
      return NextResponse.json({ status: 'disconnected', qr: null })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ status: 'disconnected', qr: null })
  }
}
