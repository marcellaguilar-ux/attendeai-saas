import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isPro } from '@/lib/plan'
import ConhecimentoClient from './ConhecimentoClient'

export default async function ConhecimentoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users').select('barbershop_id, barbershops(plano)').eq('id', user.id).single()

  const plano = (userData?.barbershops as unknown as { plano: string | null } | null)?.plano
  if (!isPro(plano)) redirect('/dashboard')

  return <ConhecimentoClient />
}
