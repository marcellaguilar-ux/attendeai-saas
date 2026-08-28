import { createClient } from '@/lib/supabase-server'
import { LayoutDashboard, Scissors, MessagesSquare, Calendar, CreditCard } from 'lucide-react'

const card: React.CSSProperties = {
  background: '#13181c',
  border: '1px solid #1d2429',
  borderRadius: 14,
  padding: 24,
}

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { data: allBarbearias },
    { count: totalConversas },
    { count: totalAgendamentos },
  ] = await Promise.all([
    supabase.from('barbershops').select('id, nome, slug, payment_status, created_at').order('created_at', { ascending: false }),
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
  ])

  const totalBarbearias = allBarbearias?.length ?? 0
  const paidBarbearias = allBarbearias?.filter(b => b.payment_status === 'paid').length ?? 0
  const recentBarbearias = allBarbearias?.slice(0, 5)

  const stats = [
    { label: 'Barbearias', value: totalBarbearias ?? 0, icon: Scissors, color: '#00e5a0', bg: 'rgba(0,229,160,0.08)' },
    { label: 'Pagas', value: paidBarbearias ?? 0, icon: CreditCard, color: '#5b9cff', bg: 'rgba(91,156,255,0.08)' },
    { label: 'Conversas', value: totalConversas ?? 0, icon: MessagesSquare, color: '#00e5a0', bg: 'rgba(0,229,160,0.08)' },
    { label: 'Agendamentos', value: totalAgendamentos ?? 0, icon: Calendar, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 960 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Visão Geral
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Métricas globais da plataforma AttendeAI
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={card}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6c7884', fontSize: 12.5, letterSpacing: '-0.01em', fontWeight: 500 }}>{label}</p>
                <p style={{ fontSize: 36, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: 8 }}>
                  {value}
                </p>
              </div>
              <div style={{ background: bg, borderRadius: 10, padding: 10, flexShrink: 0 }}>
                <Icon style={{ width: 18, height: 18, color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Últimas barbearias */}
      <div style={{ ...card, padding: 0 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
          <LayoutDashboard style={{ width: 15, height: 15, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Últimas barbearias cadastradas
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {!recentBarbearias?.length ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: '#6c7884', fontSize: 13.5 }}>Nenhuma barbearia cadastrada</p>
            </div>
          ) : recentBarbearias.map((b, i) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 24px',
                borderBottom: i < recentBarbearias.length - 1 ? '1px solid #1d2429' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 600, color: '#00e5a0', flexShrink: 0,
                }}>
                  {b.nome?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em' }}>{b.nome}</p>
                  <p style={{ color: '#6c7884', fontSize: 12, marginTop: 1 }}>{b.slug}</p>
                </div>
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                background: b.payment_status === 'paid' ? 'rgba(0,229,160,0.08)' : 'rgba(248,113,113,0.1)',
                color: b.payment_status === 'paid' ? '#00e5a0' : '#f87171',
              }}>
                {b.payment_status === 'paid' ? 'Paga' : 'Pendente'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
