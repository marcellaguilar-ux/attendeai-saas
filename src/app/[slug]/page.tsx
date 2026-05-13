import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import BookingPage from './BookingPage'

// Reserved paths that should not be treated as slugs
const RESERVED = ['login', 'cadastro', 'dashboard', 'pagamento', 'pagamento-concluido', 'auth', 'api', 'forgot-password', 'reset-password', '_next', 'favicon.ico']

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (RESERVED.includes(slug)) return {}
  const supabase = await createClient()
  const { data: shop } = await supabase.from('barbershops').select('nome').eq('slug', slug).eq('ativo', true).single()
  if (!shop) return { title: 'Barbearia não encontrada' }
  return { title: `${shop.nome} — Agendamento Online` }
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (RESERVED.includes(slug)) notFound()

  const supabase = await createClient()
  const { data: shop } = await supabase
    .from('barbershops')
    .select('id, nome, slug, endereco, telefone')
    .eq('slug', slug)
    .eq('ativo', true)
    .single()

  if (!shop) notFound()

  const { data: services } = await supabase
    .from('services')
    .select('id, nome, preco, duracao_min')
    .eq('barbershop_id', shop.id)
    .eq('ativo', true)
    .order('nome')

  const { data: barbers } = await supabase
    .from('barbers')
    .select('id, nome, foto_url')
    .eq('barbershop_id', shop.id)
    .eq('ativo', true)
    .order('nome')

  return <BookingPage shop={shop} services={services ?? []} barbers={barbers ?? []} />
}
