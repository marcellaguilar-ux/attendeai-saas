import { createClient } from '@/lib/supabase-server'
import { MessagesSquare, Clock } from 'lucide-react'

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `${min}min atrás`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h atrás`
  const d = Math.floor(h / 24)
  return `${d}d atrás`
}

export default async function AdminConversasPage() {
  const supabase = await createClient()

  const { data: conversas } = await supabase
    .from('conversations')
    .select('id, client_nome, client_whatsapp, status, last_message_at, barbershop_id, barbershops(nome)')
    .order('last_message_at', { ascending: false })

  const total = conversas?.length ?? 0
  const abertas = conversas?.filter(c => c.status === 'open').length ?? 0
  const encerradas = total - abertas

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 900 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Conversas
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Histórico global de atendimentos da Bia
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Total', value: total, color: '#e9eef3' },
          { label: 'Abertas', value: abertas, color: '#00e5a0' },
          { label: 'Encerradas', value: encerradas, color: '#6c7884' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, padding: 24 }}>
            <p style={{ color: '#6c7884', fontSize: 12.5, fontWeight: 500 }}>{label}</p>
            <p style={{ fontSize: 36, fontWeight: 600, color, letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: 8 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessagesSquare style={{ width: 15, height: 15, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Todas as conversas
          </span>
        </div>

        {!conversas?.length ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <MessagesSquare style={{ width: 36, height: 36, color: '#2a343c', margin: '0 auto 12px' }} />
            <p style={{ color: '#6c7884', fontSize: 13.5 }}>Nenhuma conversa ainda</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {conversas.map((c, i) => {
              const barb = c.barbershops as unknown as { nome: string } | null
              return (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 24px',
                    borderBottom: i < conversas.length - 1 ? '1px solid #1d2429' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600, color: '#00e5a0', flexShrink: 0,
                    }}>
                      {(c.client_nome || c.client_whatsapp)[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500 }}>
                        {c.client_nome || c.client_whatsapp}
                      </p>
                      <p style={{ color: '#6c7884', fontSize: 12, marginTop: 2 }}>
                        {barb?.nome ?? '—'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6c7884', fontSize: 12 }}>
                      <Clock style={{ width: 11, height: 11 }} />
                      {timeAgo(c.last_message_at)}
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                      background: c.status === 'open' ? 'rgba(0,229,160,0.08)' : 'rgba(108,120,132,0.1)',
                      color: c.status === 'open' ? '#00e5a0' : '#6c7884',
                    }}>
                      {c.status === 'open' ? 'Aberta' : 'Encerrada'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
