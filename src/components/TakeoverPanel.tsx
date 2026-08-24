'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, User, Send } from 'lucide-react'

interface Props {
  conversationId: string
  initialMode: string
  clientName: string
}

export default function TakeoverPanel({ conversationId, initialMode, clientName }: Props) {
  const [mode, setMode] = useState(initialMode || 'bot')
  const [toggling, setToggling] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const router = useRouter()

  const isHuman = mode === 'human'

  async function toggleMode() {
    const newMode = isHuman ? 'bot' : 'human'
    setToggling(true)
    await fetch('/api/takeover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: conversationId, mode: newMode }),
    })
    setMode(newMode)
    setToggling(false)
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: conversationId, text: text.trim() }),
    })
    setText('')
    setSending(false)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Barra de modo */}
      <div style={{
        background: '#13181c',
        border: `1px solid ${isHuman ? 'rgba(251,191,36,0.3)' : '#1d2429'}`,
        borderRadius: 14,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: isHuman ? 'rgba(251,191,36,0.12)' : 'rgba(0,229,160,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {isHuman
              ? <User style={{ width: 15, height: 15, color: '#fbbf24' }} />
              : <Bot style={{ width: 15, height: 15, color: '#00e5a0' }} />
            }
          </div>
          <div>
            <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em' }}>
              {isHuman ? 'Atendimento humano ativo' : 'Atendimento automático pela Bia'}
            </p>
            <p style={{ color: '#6c7884', fontSize: 12, marginTop: 2 }}>
              {isHuman
                ? 'A Bia está pausada. Você está respondendo manualmente.'
                : 'A Bia responde automaticamente pelo WhatsApp.'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleMode}
          disabled={toggling}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: `1px solid ${isHuman ? 'rgba(251,191,36,0.35)' : 'rgba(0,229,160,0.3)'}`,
            background: isHuman ? 'rgba(251,191,36,0.08)' : 'rgba(0,229,160,0.08)',
            color: isHuman ? '#fbbf24' : '#00e5a0',
            fontSize: 12.5,
            fontWeight: 500,
            cursor: toggling ? 'wait' : 'pointer',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {toggling ? '...' : isHuman ? '↩ Devolver para Bia' : '✋ Assumir atendimento'}
        </button>
      </div>

      {/* Caixa de resposta — apenas no modo humano */}
      {isHuman && (
        <form onSubmit={sendMessage} style={{
          background: '#13181c',
          border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 16px',
            borderBottom: '1px solid #1d2429',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <User style={{ width: 12, height: 12, color: '#fbbf24' }} />
            <span style={{ color: '#fbbf24', fontSize: 12, fontWeight: 500 }}>
              Respondendo como atendente → {clientName}
            </span>
          </div>
          <div style={{ display: 'flex' }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(e as unknown as React.FormEvent)
                }
              }}
              placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
              rows={3}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '14px 16px',
                color: '#e9eef3',
                fontSize: 13.5,
                resize: 'none',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em',
                lineHeight: 1.5,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'flex-end', padding: '0 12px 12px' }}>
              <button
                type="submit"
                disabled={sending || !text.trim()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: text.trim() && !sending ? '#fbbf24' : '#1d2429',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: text.trim() && !sending ? 'pointer' : 'default',
                  transition: 'background .15s',
                  flexShrink: 0,
                }}
              >
                <Send style={{ width: 15, height: 15, color: text.trim() && !sending ? '#000' : '#3a444c' }} />
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
