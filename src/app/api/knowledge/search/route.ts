import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { embed } from '@/lib/embed'

// Endpoint usado pelo agente VPS para busca semântica
// Autenticado via x-api-key (mesma chave do VPS)
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (apiKey !== process.env.VPS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { query, barbershop_id, limit = 4 } = await req.json()
  if (!query || !barbershop_id) {
    return NextResponse.json({ error: 'query e barbershop_id obrigatórios' }, { status: 400 })
  }

  let queryEmbedding: number[]
  try {
    queryEmbedding = await embed(query)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: `Embed failed: ${msg}` }, { status: 500 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.rpc('match_knowledge_chunks', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_barbershop_id: barbershop_id,
    match_count: limit,
    match_threshold: 0.4,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ chunks: data ?? [] })
}
