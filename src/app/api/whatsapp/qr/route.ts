import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const VPS_BASE_URL = process.env.VPS_BASE_URL ?? 'http://129.121.39.54:8080'
const VPS_API_KEY = process.env.VPS_API_KEY ?? 'attendeai-internal-vps-key'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const res = await fetch(`${VPS_BASE_URL}/qr.json`, {
      headers: { 'x-api-key': VPS_API_KEY },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ status: 'disconnected', qr: null })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ status: 'disconnected', qr: null })
  }
}
