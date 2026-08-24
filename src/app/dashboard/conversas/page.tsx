import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { MessageCircle, Clock } from 'lucide-react'

const card: React.CSSProperties = {
  background: '#13181c',
  border: '1px solid #1d2429',
  borderRadius: 14,
  overflow: 'hidden',
}

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

export default async function ConversasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase
    .from('users').select('barbershop_id').eq('id', user!.id).single()

  const { data: conversas } = await supabase
    .from('conversations')
    .select('*, messages(content, role, created_at)')
    .eq('barbershop_id', userData?.barbershop_id)
    .order('last_message_at', { ascending: false })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 800 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Conversas
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Histórico de atendimentos da Bia
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Total de conversas', value: conversas?.length ?? 0, color: '#00e5a0' },
          { label: 'Abertas', value: conversas?.filter(c => c.status === 'open').length ?? 0, color: '#5b9cff' },
          { label: 'Encerradas', value: conversas?.filter(c => c.status === 'closed').length ?? 0, color: '#6c7884' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, padding: 24 }}>
            <p style={{ color: '#6c7884', fontSize: 12.5, fontWeight: 500, letterSpacing: '-0.01em' }}>{label}</p>
            <p style={{ fontSize: 36, fontWeight: 600, color, letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: 8 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={card}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageCircle style={{ width: 15, height: 15, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Todas as conversas
          </span>
        </div>

        {!conversas?.length ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <MessageCircle style={{ width: 36, height: 36, color: '#2a343c', margin: '0 auto 12px' }} />
            <p style={{ color: '#6c7884', fontSize: 13.5 }}>Nenhuma conversa ainda</p>
            <p style={{ color: '#3a444c', fontSize: 12.5, marginTop: 4 }}>As conversas da Bia aparecerão aqui</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {conversas.map((c, i) => {
              const msgs = (c.messages as any[]) ?? []
              const lastMsg = msgs.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0]

              return (
                <Link
                  key={c.id}
                  href={`/dashboard/conversas/${c.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    borderBottom: i < conversas.length - 1 ? '1px solid #1d2429' : 'none',
                    textDecoration: 'none',
                    transition: 'background .15s',
                  }}

                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'rgba(0,229,160,0.1)',
                      border: '1px solid rgba(0,229,160,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#00e5a0',
                      letterSpacing: '-0.02em',
                    }}>
                      {(c.client_nome || c.client_whatsapp)[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em' }}>
                        {c.client_nome || c.client_whatsapp}
                      </p>
                      <p style={{ color: '#6c7884', fontSize: 12, marginTop: 2, maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lastMsg
                          ? `${lastMsg.role === 'assistant' ? 'Bia: ' : ''}${lastMsg.content}`
                          : 'Sem mensagens'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6c7884', fontSize: 12 }}>
                      <Clock style={{ width: 11, height: 11 }} />
                      {timeAgo(c.last_message_at)}
                    </div>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 500,
                      background: c.status === 'open' ? 'rgba(0,229,160,0.08)' : 'rgba(108,120,132,0.1)',
                      color: c.status === 'open' ? '#00e5a0' : '#6c7884',
                    }}>
                      {c.status === 'open' ? 'Aberta' : 'Encerrada'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
