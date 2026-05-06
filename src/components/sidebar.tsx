'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LayoutDashboard, Calendar, Settings, MessageCircle, LogOut } from 'lucide-react'

const links = [
  { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/dashboard/agendamentos', label: 'Agendamentos', icon: Calendar },
  { href: '/dashboard/whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Sidebar({ barbershop }: { barbershop?: { nome: string } }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside style={{
      width: 232,
      flexShrink: 0,
      background: '#0f1316',
      borderRight: '1px solid #1d2429',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #1d2429' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: '#00e5a0',
            borderRadius: 8,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 18,
            fontWeight: 800,
            color: '#000',
            letterSpacing: '-0.04em',
          }}>a</div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              color: '#e9eef3',
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>AttendeAI</p>
            <p style={{
              color: '#6c7884',
              fontSize: 11.5,
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 152,
              lineHeight: 1.3,
              marginTop: 1,
            }}>
              {barbershop?.nome || '–'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '9px 12px',
                borderRadius: 10,
                fontSize: 13.5,
                letterSpacing: '-0.01em',
                fontWeight: active ? 500 : 400,
                background: active ? '#00e5a0' : 'transparent',
                color: active ? '#000' : '#aab4bd',
                textDecoration: 'none',
                transition: 'background .15s, color .15s',
              }}
            >
              <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '8px 8px 12px', borderTop: '1px solid #1d2429' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            width: '100%',
            padding: '9px 12px',
            borderRadius: 10,
            fontSize: 13.5,
            letterSpacing: '-0.01em',
            color: '#6c7884',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background .15s, color .15s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = '#181e23'
            el.style.color = '#e9eef3'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'transparent'
            el.style.color = '#6c7884'
          }}
        >
          <LogOut style={{ width: 15, height: 15 }} />
          Sair
        </button>
      </div>
    </aside>
  )
}
