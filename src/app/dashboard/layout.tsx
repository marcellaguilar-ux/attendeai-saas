import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Sidebar from '@/components/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('*, barbershops(*)')
    .eq('id', user.id)
    .single()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0d10', display: 'flex', fontFamily: "var(--font-geist-sans, 'Inter', sans-serif)" }}>
      <Sidebar barbershop={userData?.barbershops} />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
