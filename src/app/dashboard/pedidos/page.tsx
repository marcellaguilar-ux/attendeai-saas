import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isPro } from '@/lib/plan'
import PedidosClient from './PedidosClient'

export default async function PedidosPage() {
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

  const { data: orders } = await supabase
    .from('menu_orders')
    .select('*, menu_order_items(*)')
    .eq('barbershop_id', barbershopId)
    .order('created_at', { ascending: false })
    .limit(50)

  return <PedidosClient barbershopId={barbershopId!} initialOrders={orders ?? []} />
}
