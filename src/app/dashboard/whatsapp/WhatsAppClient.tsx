'use client'
import { useEffect, useState } from 'react'
import { MessageCircle, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

type QRState = {
  status: 'loading' | 'waiting_qr' | 'connected' | 'disconnected'
  qr: string | null
}

export default function WhatsAppClient() {
  const [state, setState] = useState<QRState>({ status: 'loading', qr: null })
  const [reconnecting, setReconnecting] = useState(false)

  useEffect(() => {
    let active = true

    async function poll() {
      try {
        const res = await fetch('/api/whatsapp/qr', { cache: 'no-store' })
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()
        if (active) setState({ status: data.status, qr: data.qr ?? null })
      } catch {
        if (active) setState(s => ({ ...s, status: 'disconnected' }))
      }
    }

    poll()
    const id = setInterval(poll, 4000)
    return () => { active = false; clearInterval(id) }
  }, [])

  async function handleReconnect() {
    setReconnecting(true)
    setState({ status: 'loading', qr: null })
    try {
      await fetch('/api/whatsapp/reconnect', { method: 'POST' })
    } catch { /* ignore */ }
    setTimeout(() => setReconnecting(false), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 640 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          WhatsApp
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Conexão do agente IA
        </p>
      </div>

      {/* Status card */}
      <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageCircle style={{ width: 15, height: 15, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Status da conexão
          </span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <StatusBadge status={state.status} />
          </span>
        </div>

        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {state.status === 'loading' && (
            <div style={{ padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <Loader2 style={{ width: 28, height: 28, color: '#3a4551', animationName: 'spin', animationDuration: '1s', animationIterationCount: 'infinite' }} />
              <p style={{ color: '#6c7884', fontSize: 13.5 }}>Verificando status...</p>
            </div>
          )}

          {state.status === 'connected' && (
            <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <CheckCircle style={{ width: 48, height: 48, color: '#4ade80' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#e9eef3', fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>
                  WhatsApp conectado
                </p>
                <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 6 }}>
                  Seu agente está respondendo automaticamente.
                </p>
              </div>
            </div>
          )}

          {state.status === 'waiting_qr' && state.qr && (
            <>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#e9eef3', fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' }}>
                  Escaneie o QR code
                </p>
                <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 6 }}>
                  Abra o WhatsApp → Dispositivos vinculados → Vincular dispositivo
                </p>
              </div>
              <div style={{
                padding: 16,
                background: '#fff',
                borderRadius: 14,
                display: 'inline-flex',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={state.qr} alt="QR code WhatsApp" style={{ width: 256, height: 256 }} />
              </div>
              <p style={{ color: '#3a4551', fontSize: 12, letterSpacing: '-0.005em' }}>
                Atualiza automaticamente a cada 4 segundos
              </p>
            </>
          )}

          {state.status === 'disconnected' && (
            <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <XCircle style={{ width: 48, height: 48, color: '#f87171' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#e9eef3', fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>
                  WhatsApp desconectado
                </p>
                <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 6 }}>
                  O servidor do agente não está acessível.
                </p>
              </div>
              <button
                onClick={handleReconnect}
                disabled={reconnecting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  background: reconnecting ? '#1d2429' : '#00e5a0',
                  color: reconnecting ? '#6c7884' : '#000',
                  border: 'none',
                  borderRadius: 100,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: reconnecting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <RefreshCw style={{ width: 14, height: 14 }} />
                {reconnecting ? 'Reconectando...' : 'Tentar reconectar'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

function StatusBadge({ status }: { status: QRState['status'] }) {
  const map = {
    loading:     { color: '#6c7884', bg: 'rgba(108,120,132,0.1)', label: 'Verificando' },
    waiting_qr:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  label: 'Aguardando QR' },
    connected:   { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  label: 'Conectado' },
    disconnected:{ color: '#f87171', bg: 'rgba(248,113,113,0.1)', label: 'Desconectado' },
  }
  const { color, bg, label } = map[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500,
      background: bg, color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  )
}
