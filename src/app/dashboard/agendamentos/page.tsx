import { createClient } from '@/lib/supabase-server'
import AgendamentosClient from './AgendamentosClient'

export default async function AgendamentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('barbershop_id').eq('id', user!.id).single()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('barbershop_id', userData?.barbershop_id)
    .order('data', { ascending: false })
    .order('horario', { ascending: false })

  return <AgendamentosClient appointments={appointments ?? []} />
}
