import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { embed, chunkText } from '@/lib/embed'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await supabase
    .from('users').select('barbershop_id').eq('id', user.id).single()
  if (!userData?.barbershop_id) return NextResponse.json({ error: 'No barbershop' }, { status: 400 })

  const { doc_name, content } = await req.json()
  if (!doc_name?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'doc_name e content são obrigatórios' }, { status: 400 })
  }

  const chunks = chunkText(content)
  if (chunks.length === 0) {
    return NextResponse.json({ error: 'Conteúdo muito curto ou vazio' }, { status: 400 })
  }

  // Embeddings em paralelo (máx 5 simultâneos para não estourar rate limit)
  const rows: { barbershop_id: string; doc_name: string; content: string; embedding: string }[] = []
  for (let i = 0; i < chunks.length; i += 5) {
    const batch = chunks.slice(i, i + 5)
    const embeddings = await Promise.all(batch.map(c => embed(c)))
    for (let j = 0; j < batch.length; j++) {
      rows.push({
        barbershop_id: userData.barbershop_id,
        doc_name: doc_name.trim(),
        content: batch[j],
        embedding: JSON.stringify(embeddings[j]),
      })
    }
  }

  const { error } = await supabase.from('knowledge_chunks').insert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, chunks: rows.length })
}
