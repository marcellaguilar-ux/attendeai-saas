import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// GET — lista documentos da barbearia (agrupados por doc_name)
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await supabase
    .from('users').select('barbershop_id').eq('id', user.id).single()
  if (!userData?.barbershop_id) return NextResponse.json({ docs: [] })

  const { data } = await supabase
    .from('knowledge_chunks')
    .select('doc_name, created_at')
    .eq('barbershop_id', userData.barbershop_id)
    .order('created_at', { ascending: false })

  // Agrupa por doc_name com contagem de chunks e data mais recente
  const map = new Map<string, { doc_name: string; chunks: number; created_at: string }>()
  for (const row of data ?? []) {
    if (!map.has(row.doc_name)) {
      map.set(row.doc_name, { doc_name: row.doc_name, chunks: 0, created_at: row.created_at })
    }
    map.get(row.doc_name)!.chunks++
  }

  return NextResponse.json({ docs: Array.from(map.values()) })
}

// DELETE — remove todos os chunks de um documento
export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await supabase
    .from('users').select('barbershop_id').eq('id', user.id).single()
  if (!userData?.barbershop_id) return NextResponse.json({ error: 'No barbershop' }, { status: 400 })

  const { doc_name } = await req.json()
  if (!doc_name) return NextResponse.json({ error: 'doc_name obrigatório' }, { status: 400 })

  const { error } = await supabase
    .from('knowledge_chunks')
    .delete()
    .eq('barbershop_id', userData.barbershop_id)
    .eq('doc_name', doc_name)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
