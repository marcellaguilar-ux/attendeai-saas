import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, User } from 'lucide-react'
import TakeoverPanel from '@/components/TakeoverPanel'

export default async function ConversaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase
    .from('users').select('barbershop_id').eq('id', user!.id).single()

  const { data: conversa } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .eq('barbershop_id', userData?.barbershop_id)
    .single()

  if (!conversa) notFound()

  const { data: mensagens } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  function formatTime(date: string) {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <Link
          href="/dashboard/conversas"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            background: '#13181c',
            border: '1px solid #1d2429',
            borderRadius: 8,
            color: '#aab4bd',
            textDecoration: 'none',
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          <ArrowLeft style={{ width: 15, height: 15 }} />
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
              {conversa.client_nome || conversa.client_whatsapp}
            </h1>
            <span style={{
              padding: '3px 10px',
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 500,
              background: conversa.status === 'open' ? 'rgba(0,229,160,0.08)' : 'rgba(108,120,132,0.1)',
              color: conversa.status === 'open' ? '#00e5a0' : '#6c7884',
            }}>
              {conversa.status === 'open' ? 'Aberta' : 'Encerrada'}
            </span>
          </div>
          <p style={{ color: '#6c7884', fontSize: 13, marginTop: 3, letterSpacing: '-0.01em' }}>
            {conversa.client_whatsapp} · {mensagens?.length ?? 0} mensagens
          </p>
        </div>
      </div>

      {/* Intervenção humana */}
      {conversa.status === 'open' && (
        <TakeoverPanel
          conversationId={id}
          initialMode={conversa.mode || 'bot'}
          clientName={conversa.client_nome || conversa.client_whatsapp}
        />
      )}

      {/* Chat */}
      <div style={{
        background: '#13181c',
        border: '1px solid #1d2429',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Chat header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageCircle style={{ width: 14, height: 14, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Histórico da conversa
          </span>
        </div>

        {/* Messages */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 240 }}>
          {!mensagens?.length ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <MessageCircle style={{ width: 32, height: 32, color: '#2a343c', margin: '0 auto 10px' }} />
              <p style={{ color: '#6c7884', fontSize: 13.5 }}>Nenhuma mensagem nesta conversa</p>
            </div>
          ) : (
            mensagens.map(msg => {
              const isAssistant = msg.role === 'assistant'
              const isHumanAgent = msg.role === 'human'
              const isLeft = isAssistant || isHumanAgent

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isLeft ? 'flex-start' : 'flex-end',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    {isLeft && (
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: isHumanAgent ? 'rgba(251,191,36,0.15)' : 'rgba(0,229,160,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 700,
                        color: isHumanAgent ? '#fbbf24' : '#00e5a0',
                      }}>
                        {isHumanAgent ? <User style={{ width: 10, height: 10, color: '#fbbf24' }} /> : 'B'}
                      </div>
                    )}
                    <span style={{ color: '#3a444c', fontSize: 11, letterSpacing: '-0.01em' }}>
                      {isAssistant ? 'Bia' : isHumanAgent ? 'Atendente' : (conversa.client_nome || 'Cliente')} · {formatTime(msg.created_at)}
                    </span>
                    {!isLeft && (
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'rgba(91,156,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <User style={{ width: 10, height: 10, color: '#5b9cff' }} />
                      </div>
                    )}
                  </div>
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: isLeft ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                    background: isHumanAgent
                      ? 'rgba(251,191,36,0.07)'
                      : isAssistant
                        ? '#181e23'
                        : 'rgba(0,229,160,0.08)',
                    border: `1px solid ${isHumanAgent
                      ? 'rgba(251,191,36,0.2)'
                      : isAssistant
                        ? '#1d2429'
                        : 'rgba(0,229,160,0.15)'}`,
                    color: '#e9eef3',
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    letterSpacing: '-0.01em',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.content}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
