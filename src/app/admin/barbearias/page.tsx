import { createClient } from '@/lib/supabase-server'
import { Scissors } from 'lucide-react'

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  return `${d}d atrás`
}

export default async function AdminBarbeariasPage() {
  const supabase = await createClient()

  const { data: barbearias } = await supabase
    .from('barbershops')
    .select('id, nome, slug, payment_status, created_at, telefone')
    .order('created_at', { ascending: false })

  const total = barbearias?.length ?? 0
  const pagas = barbearias?.filter(b => b.payment_status === 'paid').length ?? 0
  const pendentes = total - pagas

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 900 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Barbearias
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Todos os estabelecimentos cadastrados na plataforma
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Total', value: total, color: '#e9eef3' },
          { label: 'Pagas', value: pagas, color: '#00e5a0' },
          { label: 'Pendentes', value: pendentes, color: '#f87171' },
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
          <Scissors style={{ width: 15, height: 15, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Todas as barbearias
          </span>
        </div>

        {!barbearias?.length ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Scissors style={{ width: 36, height: 36, color: '#2a343c', margin: '0 auto 12px' }} />
            <p style={{ color: '#6c7884', fontSize: 13.5 }}>Nenhuma barbearia cadastrada</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1d2429' }}>
                  {['Nome', 'Slug', 'Telefone', 'Status', 'Cadastro'].map(h => (
                    <th key={h} style={{
                      padding: '10px 24px', textAlign: 'left',
                      color: '#6c7884', fontSize: 11.5, fontWeight: 500,
                      letterSpacing: '0.02em', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {barbearias.map((b, i) => (
                  <tr
                    key={b.id}
                    style={{ borderBottom: i < barbearias.length - 1 ? '1px solid #1d2429' : 'none' }}
                  >
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 600, color: '#00e5a0', flexShrink: 0,
                        }}>
                          {b.nome?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500 }}>{b.nome}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ color: '#6c7884', fontSize: 13, fontFamily: 'monospace' }}>{b.slug}</span>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ color: '#aab4bd', fontSize: 13 }}>{b.telefone || '—'}</span>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                        background: b.payment_status === 'paid' ? 'rgba(0,229,160,0.08)' : 'rgba(248,113,113,0.1)',
                        color: b.payment_status === 'paid' ? '#00e5a0' : '#f87171',
                      }}>
                        {b.payment_status === 'paid' ? 'Paga' : 'Pendente'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ color: '#6c7884', fontSize: 12.5 }}>{timeAgo(b.created_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
