import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Sidebar from '@/components/sidebar'

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

  const barbershop = userData?.barbershops as { id: string; payment_status: string } | null

  // Bloqueia acesso se pagamento não confirmado
  if (!barbershop || barbershop.payment_status !== 'paid') {
    const barbershopId = barbershop?.id || ''
    redirect(`/pagamento?plano=pro&barbershop_id=${barbershopId}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0d10', display: 'flex', fontFamily: "var(--font-geist-sans, 'Inter', sans-serif)" }}>
      <Sidebar barbershop={userData?.barbershops} />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
