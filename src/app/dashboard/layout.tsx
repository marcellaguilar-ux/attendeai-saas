import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardShell from '@/components/dashboard-shell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Super admin não passa pelo dashboard — vai direto para /admin
  const SUPER_ADMIN_EMAILS = ['attendeai.ia@gmail.com']
  if (SUPER_ADMIN_EMAILS.includes(user.email ?? '')) redirect('/admin')

  const { data: userData } = await supabase
    .from('users')
    .select('*, barbershops(*)')
    .eq('id', user.id)
    .single()

  const barbershop = userData?.barbershops as {
    id: string
    nome: string
    slug?: string
    payment_status: string
    plano: string | null
  } | null

  // Bloqueia acesso se pagamento não confirmado
  if (!barbershop || barbershop.payment_status !== 'paid') {
    const barbershopId = barbershop?.id || ''
    redirect(`/pagamento?plano=pro&barbershop_id=${barbershopId}`)
  }

  return (
    <DashboardShell barbershop={barbershop}>
      {children}
    </DashboardShell>
  )
}
