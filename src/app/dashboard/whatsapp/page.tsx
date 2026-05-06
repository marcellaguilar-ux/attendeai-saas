import { createClient } from '@/lib/supabase-server'
import { MessageCircle, CheckCircle, XCircle, Server } from 'lucide-react'

export default async function WhatsAppPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('barbershop_id').eq('id', user!.id).single()

  const { data: instance } = await supabase
    .from('whatsapp_instances')
    .select('*')
    .eq('barbershop_id', userData?.barbershop_id)
    .single()

  const connected = instance?.status === 'connected'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 640 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          WhatsApp
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Status da conexão do agente IA
        </p>
      </div>

      {/* Connection card */}
      <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageCircle style={{ width: 15, height: 15, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Conexão WhatsApp
          </span>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Status row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            background: '#181e23',
            borderRadius: 10,
            border: '1px solid #1d2429',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {connected
                ? <CheckCircle style={{ width: 18, height: 18, color: '#4ade80' }} />
                : <XCircle style={{ width: 18, height: 18, color: '#f87171' }} />}
              <div>
                <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em' }}>
                  {instance?.numero || 'Não configurado'}
                </p>
                <p style={{ color: '#6c7884', fontSize: 12, marginTop: 2 }}>Número conectado</p>
              </div>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 500,
              background: connected ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
              color: connected ? '#4ade80' : '#f87171',
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: connected ? '#4ade80' : '#f87171',
                display: 'inline-block',
              }} />
              {connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>

          {/* Info box */}
          <div style={{
            padding: '14px 16px',
            background: 'rgba(0,229,160,0.04)',
            border: '1px solid rgba(0,229,160,0.15)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <Server style={{ width: 15, height: 15, color: '#00e5a0', marginTop: 1, flexShrink: 0 }} />
            <div>
              <p style={{ color: '#00e5a0', fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em' }}>
                Servidor ativo no VPS
              </p>
              <p style={{ color: '#6c7884', fontSize: 12.5, marginTop: 4, lineHeight: 1.5, letterSpacing: '-0.005em' }}>
                O agente Bia está rodando 24/7 no servidor. Qualquer mensagem recebida no número acima é respondida automaticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
