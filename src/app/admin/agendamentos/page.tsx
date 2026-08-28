import { createClient } from '@/lib/supabase-server'
import { Calendar } from 'lucide-react'

export default async function AdminAgendamentosPage() {
  const supabase = await createClient()

  const { data: agendamentos } = await supabase
    .from('appointments')
    .select('id, client_nome, client_whatsapp, servico, data, horario, status, barbershop_id, barbershops(nome)')
    .order('data', { ascending: false })
    .order('horario', { ascending: false })

  const total = agendamentos?.length ?? 0
  const confirmados = agendamentos?.filter(a => a.status === 'confirmed').length ?? 0
  const pendentes = agendamentos?.filter(a => a.status === 'pending').length ?? 0
  const cancelados = agendamentos?.filter(a => a.status === 'cancelled').length ?? 0

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    confirmed:  { label: 'Confirmado', color: '#00e5a0', bg: 'rgba(0,229,160,0.08)' },
    pending:    { label: 'Pendente',   color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
    cancelled:  { label: 'Cancelado',  color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 960 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Agendamentos
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Todos os agendamentos da plataforma
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Total', value: total, color: '#e9eef3' },
          { label: 'Confirmados', value: confirmados, color: '#00e5a0' },
          { label: 'Pendentes', value: pendentes, color: '#fbbf24' },
          { label: 'Cancelados', value: cancelados, color: '#f87171' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, padding: 24 }}>
            <p style={{ color: '#6c7884', fontSize: 12.5, fontWeight: 500 }}>{label}</p>
            <p style={{ fontSize: 36, fontWeight: 600, color, letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: 8 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar style={{ width: 15, height: 15, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Todos os agendamentos
          </span>
        </div>

        {!agendamentos?.length ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Calendar style={{ width: 36, height: 36, color: '#2a343c', margin: '0 auto 12px' }} />
            <p style={{ color: '#6c7884', fontSize: 13.5 }}>Nenhum agendamento ainda</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1d2429' }}>
                  {['Cliente', 'Serviço', 'Barbearia', 'Data', 'Horário', 'Status'].map(h => (
                    <th key={h} style={{
                      padding: '10px 20px', textAlign: 'left',
                      color: '#6c7884', fontSize: 11.5, fontWeight: 500,
                      letterSpacing: '0.02em', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((a, i) => {
                  const barb = a.barbershops as unknown as { nome: string } | null
                  const s = statusMap[a.status] ?? statusMap['pending']
                  return (
                    <tr key={a.id} style={{ borderBottom: i < agendamentos.length - 1 ? '1px solid #1d2429' : 'none' }}>
                      <td style={{ padding: '13px 20px' }}>
                        <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500 }}>{a.client_nome}</p>
                        <p style={{ color: '#6c7884', fontSize: 12, marginTop: 1 }}>{a.client_whatsapp}</p>
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <span style={{ color: '#aab4bd', fontSize: 13 }}>{a.servico}</span>
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <span style={{ color: '#6c7884', fontSize: 13 }}>{barb?.nome ?? '—'}</span>
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <span style={{ color: '#e9eef3', fontSize: 13 }}>
                          {new Date(a.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </span>
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <span style={{ color: '#00e5a0', fontSize: 13, fontWeight: 500 }}>
                          {String(a.horario).slice(0, 5)}
                        </span>
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                          background: s.bg, color: s.color,
                        }}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
