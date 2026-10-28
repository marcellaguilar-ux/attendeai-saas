import { createClient } from '@/lib/supabase-server'
import { Calendar, CheckCircle, TrendingUp } from 'lucide-react'

const card: React.CSSProperties = {
  background: 'var(--dash-bg-card)',
  border: '1px solid var(--dash-border)',
  borderRadius: 14,
  padding: 24,
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('barbershop_id').eq('id', user!.id).single()

  const barbershopId = userData?.barbershop_id
  const today = new Date().toISOString().split('T')[0]
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  const [{ count: totalHoje }, { count: totalMes }, { count: confirmados }] = await Promise.all([
    supabase.from('reservas_pousada').select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId).eq('data_checkin', today),
    supabase.from('reservas_pousada').select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId).gte('created_at', firstOfMonth),
    supabase.from('reservas_pousada').select('*', { count: 'exact', head: true })
      .eq('barbershop_id', barbershopId).eq('status', 'confirmada'),
  ])

  const { data: proximosAgendamentos } = await supabase
    .from('reservas_pousada')
    .select('*')
    .eq('barbershop_id', barbershopId)
    .gte('data_checkin', today)
    .in('status', ['confirmada', 'aguardando_pagamento'])
    .order('data_checkin', { ascending: true })
    .limit(5)

  const stats = [
    { label: 'Check-ins hoje', value: totalHoje ?? 0, icon: Calendar, color: 'var(--dash-accent)', bg: 'rgba(0,229,160,0.08)' },
    { label: 'Este mês', value: totalMes ?? 0, icon: TrendingUp, color: '#5b9cff', bg: 'rgba(91,156,255,0.08)' },
    { label: 'Confirmadas', value: confirmados ?? 0, icon: CheckCircle, color: 'var(--dash-accent)', bg: 'rgba(0,229,160,0.08)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 960 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--dash-text)', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Visão Geral
        </h1>
        <p style={{ color: 'var(--dash-text-muted)', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Acompanhe suas reservas
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={card}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--dash-text-muted)', fontSize: 12.5, letterSpacing: '-0.01em', fontWeight: 500 }}>{label}</p>
                <p style={{ fontSize: 36, fontWeight: 600, color: 'var(--dash-text)', letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: 8 }}>
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

      {/* Próximos agendamentos */}
      <div style={card}>
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar style={{ width: 15, height: 15, color: 'var(--dash-accent)' }} />
          <span style={{ color: 'var(--dash-text)', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Próximas reservas
          </span>
        </div>

        {!proximosAgendamentos?.length ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Calendar style={{ width: 36, height: 36, color: 'var(--dash-text-dim)', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--dash-text-muted)', fontSize: 13.5 }}>Nenhuma reserva próxima</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {proximosAgendamentos.map(a => (
              <div key={a.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--dash-bg-input)',
                borderRadius: 10,
                border: '1px solid var(--dash-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: 'rgba(0,229,160,0.08)', borderRadius: 8, padding: 8 }}>
                    <Calendar style={{ width: 14, height: 14, color: 'var(--dash-accent)' }} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--dash-text)', fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em' }}>
                      {a.cliente_nome}
                    </p>
                    <p style={{ color: 'var(--dash-text-muted)', fontSize: 12, marginTop: 2 }}>{a.acomodacao_nome}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--dash-accent)', fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em' }}>
                    {new Date(a.data_checkin + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </p>
                  <p style={{ color: 'var(--dash-text-muted)', fontSize: 12, marginTop: 2 }}>
                    {new Date(a.data_checkout + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
