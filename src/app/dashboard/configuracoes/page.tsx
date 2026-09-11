import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isPro } from '@/lib/plan'
import ConfiguracoesClient from './ConfiguracoesClient'

export default async function ConfiguracoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('barbershop_id, barbershops(plano)').eq('id', user!.id).single()

  const plano = (userData?.barbershops as unknown as { plano: string | null } | null)?.plano
  if (!isPro(plano)) redirect('/dashboard')

  return <ConfiguracoesClient />
}
