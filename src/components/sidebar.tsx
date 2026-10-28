'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useTheme } from '@/lib/theme'
import { LayoutDashboard, Calendar, Settings, MessageCircle, MessagesSquare, LogOut, ExternalLink, BarChart2, Zap, BookOpen, BedDouble, UtensilsCrossed, ClipboardList, Sun, Moon } from 'lucide-react'
import { isPro, isBusiness, PLAN_LABEL, PLAN_COLOR } from '@/lib/plan'

type Barbershop = { id: string; nome: string; slug?: string; payment_status: string; plano: string | null }

const ALL_LINKS = [
  { href: '/dashboard',                label: 'Visão Geral',    icon: LayoutDashboard, minPlan: 'starter'  },
  { href: '/dashboard/agendamentos',   label: 'Agendamentos',   icon: Calendar,        minPlan: 'pro'      },
  { href: '/dashboard/conversas',      label: 'Conversas',      icon: MessagesSquare,  minPlan: 'pro'      },
  { href: '/dashboard/whatsapp',       label: 'WhatsApp',       icon: MessageCircle,   minPlan: 'pro'      },
  { href: '/dashboard/conhecimento',   label: 'Conhecimento',   icon: BookOpen,        minPlan: 'pro'      },
  { href: '/dashboard/relatorios',     label: 'Relatórios',     icon: BarChart2,       minPlan: 'business' },
  { href: '/dashboard/configuracoes',  label: 'Configurações',  icon: Settings,        minPlan: 'pro'      },
]

function canAccess(plano: string | null | undefined, minPlan: string) {
  if (minPlan === 'starter') return true
  if (minPlan === 'pro') return isPro(plano)
  if (minPlan === 'business') return isBusiness(plano)
  return false
}

export default function Sidebar({ barbershop, plano }: { barbershop?: Barbershop | null; plano?: string | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { theme, toggle } = useTheme()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const planLabel = plano ? (PLAN_LABEL[plano] ?? plano) : null
  const planColor = plano ? (PLAN_COLOR[plano] ?? 'var(--dash-text-muted)') : 'var(--dash-text-muted)'
  const isPousada = barbershop?.slug === 'el-capitan'
  const isCafe = barbershop?.slug === 'pingo-doce'
  const links = isPousada
    ? ALL_LINKS.filter(l => !['agendamentos'].includes(l.href.split('/').pop()!))
        .concat([{ href: '/dashboard/reservas', label: 'Reservas', icon: BedDouble, minPlan: 'pro' }])
        .sort((a, b) => {
          const order = ['dashboard', 'reservas', 'conversas', 'whatsapp', 'conhecimento', 'relatorios', 'configuracoes']
          return order.indexOf(a.href.split('/').pop()!) - order.indexOf(b.href.split('/').pop()!)
        })
    : isCafe
    ? ALL_LINKS.filter(l => !['agendamentos'].includes(l.href.split('/').pop()!))
        .concat([
          { href: '/dashboard/cardapio', label: 'Cardápio', icon: UtensilsCrossed, minPlan: 'pro' },
          { href: '/dashboard/pedidos', label: 'Pedidos', icon: ClipboardList, minPlan: 'pro' },
        ])
        .sort((a, b) => {
          const order = ['dashboard', 'cardapio', 'pedidos', 'conversas', 'whatsapp', 'conhecimento', 'relatorios', 'configuracoes']
          return order.indexOf(a.href.split('/').pop()!) - order.indexOf(b.href.split('/').pop()!)
        })
    : ALL_LINKS
  const visibleLinks = links.filter(l => canAccess(plano, l.minPlan))

  return (
    <aside style={{
      width: 232,
      flexShrink: 0,
      background: 'var(--dash-bg-sidebar)',
      borderRight: '1px solid var(--dash-border)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      transition: 'background-color .2s ease, border-color .2s ease',
    }}>
      {/* Logo + plano */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--dash-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: 'var(--dash-accent)', borderRadius: 8, width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 18, fontWeight: 800, color: '#000', letterSpacing: '-0.04em',
          }}>a</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: 'var(--dash-text)', fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              AttendeAI
            </p>
            <p style={{
              color: 'var(--dash-text-muted)', fontSize: 11.5, letterSpacing: '-0.01em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              maxWidth: 152, lineHeight: 1.3, marginTop: 1,
            }}>
              {barbershop?.nome || '–'}
            </p>
          </div>
        </div>
        {planLabel && (
          <div style={{
            marginTop: 10,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 8px', borderRadius: 6,
            background: `${planColor}18`,
            border: `1px solid ${planColor}33`,
            fontSize: 11, fontWeight: 600, letterSpacing: '.04em',
            textTransform: 'uppercase', color: planColor,
          }}>
            <Zap style={{ width: 10, height: 10 }} />
            Plano {planLabel}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visibleLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '9px 12px', borderRadius: 10, fontSize: 13.5,
              letterSpacing: '-0.01em', fontWeight: active ? 500 : 400,
              background: active ? 'var(--dash-accent)' : 'transparent',
              color: active ? '#000' : 'var(--dash-text-secondary)',
              textDecoration: 'none', transition: 'background .15s, color .15s',
            }}>
              <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
              {label}
            </Link>
          )
        })}

        {/* Upgrade CTA para Starter */}
        {plano === 'starter' && (
          <div style={{
            marginTop: 12,
            padding: '12px',
            background: 'rgba(91,156,255,0.06)',
            border: '1px solid rgba(91,156,255,0.2)',
            borderRadius: 10,
          }}>
            <p style={{ color: '#5b9cff', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Quer mais recursos?
            </p>
            <p style={{ color: 'var(--dash-text-muted)', fontSize: 11.5, lineHeight: 1.5, marginBottom: 10 }}>
              Faça upgrade para Pro e acesse painel completo, histórico, conversas e configurações.
            </p>
            <a href="/precos" style={{
              display: 'block', textAlign: 'center',
              padding: '7px 0', borderRadius: 7,
              background: '#5b9cff', color: '#000',
              fontSize: 12, fontWeight: 600, textDecoration: 'none',
            }}>
              Ver planos
            </a>
          </div>
        )}
      </nav>

      {/* Perfil Público */}
      {barbershop?.slug && (
        <div style={{ padding: '0 8px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href={`/${barbershop.slug}`} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px',
            borderRadius: 10, fontSize: 13.5, letterSpacing: '-0.01em', fontWeight: 400,
            color: 'var(--dash-accent)', textDecoration: 'none',
            border: '1px solid var(--dash-accent-border)', transition: 'background .15s, border-color .15s',
          }}>
            <ExternalLink style={{ width: 15, height: 15, flexShrink: 0 }} />
            Perfil Público
          </a>
          {isCafe && (
            <a href={`/${barbershop.slug}/cardapio`} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px',
              borderRadius: 10, fontSize: 13.5, letterSpacing: '-0.01em', fontWeight: 400,
              color: 'var(--dash-accent)', textDecoration: 'none',
              border: '1px solid var(--dash-accent-border)', transition: 'background .15s, border-color .15s',
            }}>
              <UtensilsCrossed style={{ width: 15, height: 15, flexShrink: 0 }} />
              Cardápio Digital
            </a>
          )}
        </div>
      )}

      {/* Theme toggle + Logout */}
      <div style={{ padding: '8px 8px 12px', borderTop: '1px solid var(--dash-border)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button onClick={toggle} style={{
          display: 'flex', alignItems: 'center', gap: 9, width: '100%',
          padding: '9px 12px', borderRadius: 10, fontSize: 13.5, letterSpacing: '-0.01em',
          color: 'var(--dash-text-muted)', background: 'transparent', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s, color .15s',
        }}>
          {theme === 'dark'
            ? <><Sun style={{ width: 15, height: 15 }} /> Modo claro</>
            : <><Moon style={{ width: 15, height: 15 }} /> Modo escuro</>
          }
        </button>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 9, width: '100%',
          padding: '9px 12px', borderRadius: 10, fontSize: 13.5, letterSpacing: '-0.01em',
          color: 'var(--dash-text-muted)', background: 'transparent', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s, color .15s',
        }}>
          <LogOut style={{ width: 15, height: 15 }} />
          Sair
        </button>
      </div>
    </aside>
  )
}
