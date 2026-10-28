import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isPro } from '@/lib/plan'
import ReservasClient from './ReservasClient'

export default async function ReservasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase
    .from('users')
    .select('barbershop_id')
    .eq('id', user.id)
    .single()

  if (!userRow?.barbershop_id) redirect('/dashboard')

  const { data: barbershop } = await supabase
    .from('barbershops')
    .select('plano')
    .eq('id', userRow.barbershop_id)
    .single()

  if (!isPro(barbershop?.plano)) redirect('/dashboard')

  const { data: reservas } = await supabase
    .from('reservas_pousada')
    .select('*')
    .eq('barbershop_id', userRow.barbershop_id)
    .order('created_at', { ascending: false })
    .limit(100)

  return <ReservasClient reservas={reservas ?? []} barbershopId={userRow.barbershop_id} />
}
