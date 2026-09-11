import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isBusiness } from '@/lib/plan'
import { BarChart2, TrendingUp, Calendar, DollarSign, Users, Scissors } from 'lucide-react'

const card: React.CSSProperties = {
  background: '#13181c',
  border: '1px solid #1d2429',
  borderRadius: 14,
  overflow: 'hidden',
}

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export default async function RelatoriosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('barbershop_id, barbershops(plano, nome)').eq('id', user!.id).single()

  const barbershop = userData?.barbershops as unknown as { plano: string | null; nome: string } | null
  if (!isBusiness(barbershop?.plano)) redirect('/dashboard')

  // Last 90 days
  const since = new Date()
  since.setDate(since.getDate() - 90)
  const sinceStr = since.toISOString().split('T')[0]

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('barbershop_id', userData?.barbershop_id)
    .gte('data', sinceStr)
    .order('data', { ascending: false })

  const appts = appointments ?? []

  // Stats
  const total = appts.length
  const confirmed = appts.filter(a => a.status === 'confirmed').length
  const done = appts.filter(a => a.status === 'done').length
  const cancelled = appts.filter(a => a.status === 'cancelled').length
  const revenue = appts
    .filter(a => a.status === 'done' && a.preco)
    .reduce((sum, a) => sum + Number(a.preco), 0)
  const cancelRate = total > 0 ? Math.round((cancelled / total) * 100) : 0

  // Top services
  const serviceCounts: Record<string, { count: number; revenue: number }> = {}
  for (const a of appts) {
    if (!a.servico) continue
    if (!serviceCounts[a.servico]) serviceCounts[a.servico] = { count: 0, revenue: 0 }
    serviceCounts[a.servico].count++
    if (a.status === 'done' && a.preco) serviceCounts[a.servico].revenue += Number(a.preco)
  }
  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)

  // Top barbeiros
  const barbeiroCounts: Record<string, number> = {}
  for (const a of appts) {
    if (!a.barbeiro) continue
    barbeiroCounts[a.barbeiro] = (barbeiroCounts[a.barbeiro] || 0) + 1
  }
  const topBarbeiros = Object.entries(barbeiroCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Monthly breakdown (last 3 months)
  const monthly: Record<string, { total: number; done: number; revenue: number }> = {}
  for (const a of appts) {
    const [y, m] = a.data.split('-')
    const key = `${y}-${m}`
    if (!monthly[key]) monthly[key] = { total: 0, done: 0, revenue: 0 }
    monthly[key].total++
    if (a.status === 'done') {
      monthly[key].done++
      if (a.preco) monthly[key].revenue += Number(a.preco)
    }
  }
  const monthlyEntries = Object.entries(monthly)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 3)

  const statCards = [
    { label: 'Agendamentos', value: total, color: '#00e5a0', icon: Calendar },
    { label: 'Concluídos', value: done, color: '#5b9cff', icon: TrendingUp },
    { label: 'Cancelados', value: cancelled, color: '#f87171', icon: Users },
    { label: 'Taxa de cancelamento', value: `${cancelRate}%`, color: '#fbbf24', icon: BarChart2 },
    { label: 'Receita (concluídos)', value: `R$ ${revenue.toFixed(2).replace('.',',')}`, color: '#00e5a0', icon: DollarSign },
    { label: 'Agendados (pendentes)', value: confirmed, color: '#aab4bd', icon: Scissors },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 960 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Relatórios
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Últimos 90 dias · {barbershop?.nome}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {statCards.map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <p style={{ color: '#6c7884', fontSize: 12.5, fontWeight: 500, letterSpacing: '-0.01em' }}>{label}</p>
              <div style={{ background: `${color}14`, borderRadius: 8, padding: 6 }}>
                <Icon style={{ width: 14, height: 14, color }} />
              </div>
            </div>
            <p style={{ fontSize: 32, fontWeight: 600, color, letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: 10 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Top services */}
        <div style={card}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Scissors style={{ width: 14, height: 14, color: '#00e5a0' }} />
            <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
              Serviços mais populares
            </span>
          </div>
          {topServices.length === 0 ? (
            <p style={{ color: '#6c7884', fontSize: 13, padding: '32px 24px', textAlign: 'center' }}>Sem dados ainda</p>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {topServices.map(([servico, { count, revenue }], i) => {
                const max = topServices[0][1].count
                const pct = Math.round((count / max) * 100)
                return (
                  <div key={servico} style={{ padding: '10px 24px', borderBottom: i < topServices.length - 1 ? '1px solid #1d2429' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500 }}>{servico}</span>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ color: '#6c7884', fontSize: 12 }}>{count}x</span>
                        {revenue > 0 && (
                          <span style={{ color: '#00e5a0', fontSize: 12, fontWeight: 500 }}>
                            R$ {revenue.toFixed(2).replace('.',',')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ background: '#1d2429', borderRadius: 4, height: 4 }}>
                      <div style={{ background: '#00e5a0', borderRadius: 4, height: 4, width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Monthly breakdown */}
        <div style={card}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp style={{ width: 14, height: 14, color: '#5b9cff' }} />
            <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
              Resumo por mês
            </span>
          </div>
          {monthlyEntries.length === 0 ? (
            <p style={{ color: '#6c7884', fontSize: 13, padding: '32px 24px', textAlign: 'center' }}>Sem dados ainda</p>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {monthlyEntries.map(([key, { total, done, revenue }], i) => {
                const [y, m] = key.split('-').map(Number)
                return (
                  <div key={key} style={{ padding: '14px 24px', borderBottom: i < monthlyEntries.length - 1 ? '1px solid #1d2429' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>
                          {MONTHS[m-1]} {y}
                        </p>
                        <p style={{ color: '#6c7884', fontSize: 12.5, marginTop: 3 }}>
                          {total} agendamentos · {done} concluídos
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: '#00e5a0', fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' }}>
                          R$ {revenue.toFixed(2).replace('.',',')}
                        </p>
                        <p style={{ color: '#6c7884', fontSize: 11.5, marginTop: 2 }}>receita</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Barbeiros */}
      {topBarbeiros.length > 0 && (
        <div style={card}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users style={{ width: 14, height: 14, color: '#5b9cff' }} />
            <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
              Barbeiros
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 24 }}>
            {topBarbeiros.map(([nome, count]) => (
              <div key={nome} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#0f1316', border: '1px solid #1d2429', borderRadius: 10,
                padding: '10px 16px',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(91,156,255,0.1)', border: '1px solid rgba(91,156,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#5b9cff', fontSize: 13, fontWeight: 600,
                }}>
                  {nome[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500 }}>{nome}</p>
                  <p style={{ color: '#6c7884', fontSize: 12, marginTop: 1 }}>{count} agendamentos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
