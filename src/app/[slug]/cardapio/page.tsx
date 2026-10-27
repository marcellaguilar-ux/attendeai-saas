import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import CardapioPage from './CardapioPage'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: shop } = await supabase.from('barbershops').select('nome').eq('slug', slug).single()
  if (!shop) return { title: 'Cardápio não encontrado' }
  return { title: `${shop.nome} — Cardápio Digital` }
}

export default async function CardapioServerPage({ params, searchParams }: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ mesa?: string }>
}) {
  const { slug } = await params
  const { mesa } = await searchParams

  const { data: shop } = await supabase
    .from('barbershops')
    .select('id, nome, slug, telefone, endereco, logo_url, cover_url')
    .eq('slug', slug)
    .eq('ativo', true)
    .single()

  if (!shop) notFound()

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase
      .from('menu_categories')
      .select('id, name, channel, sort_order')
      .eq('barbershop_id', shop.id)
      .eq('active', true)
      .order('sort_order'),
    supabase
      .from('menu_products')
      .select('id, category_id, name, description, price, price_variants, image_url, channel, available')
      .eq('barbershop_id', shop.id)
      .eq('available', true)
      .order('sort_order'),
  ])

  return (
    <CardapioPage
      shop={shop}
      categories={categories ?? []}
      products={products ?? []}
      mesa={mesa ? parseInt(mesa, 10) : null}
    />
  )
}
