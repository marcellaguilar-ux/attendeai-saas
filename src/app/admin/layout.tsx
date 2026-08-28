import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminSidebar from './AdminSidebar'

const SUPER_ADMIN_EMAILS = ['attendeai.ia@gmail.com']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (!SUPER_ADMIN_EMAILS.includes(user.email ?? '')) redirect('/login')

  return (
    <div style={{ minHeight: '100vh', background: '#0a0d10', display: 'flex', fontFamily: "var(--font-geist-sans, 'Inter', sans-serif)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
