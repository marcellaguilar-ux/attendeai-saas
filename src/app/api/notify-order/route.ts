import { NextResponse } from 'next/server'

const AGENT_BASES: Record<string, string> = {
  'd9f37169-8894-461c-96c2-8d4ec54dfb78': 'http://129.121.39.54:8084', // Pingo Doce
}

const SECRET = process.env.NOTIFY_ORDER_SECRET!
if (!process.env.NOTIFY_ORDER_SECRET) throw new Error('NOTIFY_ORDER_SECRET environment variable is required')

const ALLOWED_ORIGINS = [
  'https://attendeai.ia.br',
  'https://web-pink-eta-99.vercel.app',
]

// Rate limiting: max 20 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 20
const RATE_WINDOW = 60_000 // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }
}, 300_000)

export async function POST(req: Request) {
  const origin = req.headers.get('origin') || ''
  const referer = req.headers.get('referer') || ''
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const body = await req.json()
  const { secret, barbershop_id, number, template, params, fallback_text } = body

  // Auth: either valid secret (server-to-server) or allowed origin (browser)
  const hasValidSecret = secret && secret === SECRET
  const hasAllowedOrigin = ALLOWED_ORIGINS.some(o => origin.startsWith(o) || referer.startsWith(o))

  if (!hasValidSecret && !hasAllowedOrigin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Rate limit
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  if (!number) return NextResponse.json({ error: 'Missing number' }, { status: 400 })
  if (!barbershop_id) return NextResponse.json({ error: 'Missing barbershop_id' }, { status: 400 })

  const agentBase = AGENT_BASES[barbershop_id]
  if (!agentBase) return NextResponse.json({ error: 'Agent not configured' }, { status: 404 })

  try {
    const res = await fetch(`${agentBase}/send-template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number, template, params, fallback_text }),
      signal: AbortSignal.timeout(10000),
    })
    const data = await res.json()
    return NextResponse.json({ ok: true, data })
  } catch (e: any) {
    console.error('[notify-order] Error:', e.message)
    return NextResponse.json({ error: 'Failed to send' }, { status: 502 })
  }
}
