import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isPro } from '@/lib/plan'
import CardapioClient from './CardapioClient'

export default async function CardapioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users')
    .select('barbershop_id, barbershops(plano)')
    .eq('id', user!.id)
    .single()

  const plano = (userData?.barbershops as unknown as { plano: string | null } | null)?.plano
  if (!isPro(plano)) redirect('/dashboard')

  const barbershopId = userData?.barbershop_id

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase
      .from('menu_categories')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .order('sort_order'),
    supabase
      .from('menu_products')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .order('sort_order'),
  ])

  return (
    <CardapioClient
      barbershopId={barbershopId!}
      categories={categories ?? []}
      products={products ?? []}
    />
  )
}
