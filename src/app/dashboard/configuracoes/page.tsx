'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Settings, Check, Bot } from 'lucide-react'
import { toast } from 'sonner'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#181e23',
  border: '1px solid #2a343c',
  borderRadius: 8,
  color: '#e9eef3',
  fontSize: 13.5,
  letterSpacing: '-0.01em',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color .15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#aab4bd',
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  marginBottom: 8,
}

const SaveButton = ({ saving, label }: { saving: boolean; label?: string }) => (
  <button
    type="submit"
    disabled={saving}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '10px 20px',
      background: saving ? '#0f1316' : '#00e5a0',
      color: saving ? '#6c7884' : '#000',
      border: saving ? '1px solid #1d2429' : 'none',
      borderRadius: 100,
      fontSize: 13.5,
      fontWeight: 600,
      letterSpacing: '-0.01em',
      cursor: saving ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit',
      transition: 'all .15s',
    }}
  >
    {saving ? 'Salvando...' : <><Check style={{ width: 14, height: 14 }} /> {label ?? 'Salvar alterações'}</>}
  </button>
)

const DEFAULT_PROMPT = `Você é a Bia, assistente virtual da {NOME_BARBEARIA}. Seu papel é atender clientes pelo WhatsApp de forma simpática e eficiente.

Você pode:
- Informar os serviços e preços disponíveis
- Verificar horários disponíveis e fazer agendamentos
- Confirmar, cancelar ou remarcar agendamentos existentes
- Responder dúvidas gerais sobre a barbearia (endereço, horário de funcionamento, formas de pagamento)

Instruções:
- Seja sempre cordial, objetivo e use linguagem informal mas respeitosa
- Confirme os dados antes de finalizar um agendamento (nome, serviço, data e horário)
- Se não souber responder algo, peça para o cliente entrar em contato diretamente com a barbearia
- Não invente informações sobre preços ou disponibilidade que não foram fornecidas`

export default function ConfiguracoesPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [savingInfo, setSavingInfo] = useState(false)
  const [savingPrompt, setSavingPrompt] = useState(false)
  const [barbershopId, setBarbershopId] = useState('')
  const [form, setForm] = useState({ nome: '', endereco: '', telefone: '' })
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userData } = await supabase.from('users')
        .select('barbershop_id, barbershops(*)').eq('id', user!.id).single()
      const shop = (userData as any)?.barbershops
      if (shop) {
        setBarbershopId(shop.id)
        setForm({ nome: shop.nome || '', endereco: shop.endereco || '', telefone: shop.telefone || '' })
        setPrompt(shop.ai_prompt || DEFAULT_PROMPT.replace('{NOME_BARBEARIA}', shop.nome || 'barbearia'))
      }
      setLoading(false)
    }
    load()
  }, [])

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault()
    setSavingInfo(true)
    const { error } = await supabase.from('barbershops').update(form).eq('id', barbershopId)
    setSavingInfo(false)
    if (error) toast.error('Erro ao salvar')
    else toast.success('Configurações salvas!')
  }

  async function handleSavePrompt(e: React.FormEvent) {
    e.preventDefault()
    setSavingPrompt(true)
    const { error } = await supabase.from('barbershops').update({ ai_prompt: prompt }).eq('id', barbershopId)
    setSavingPrompt(false)
    if (error) toast.error('Erro ao salvar script')
    else toast.success('Script da Bia atualizado!')
  }

  if (loading) return (
    <p style={{ color: '#6c7884', fontSize: 13.5, letterSpacing: '-0.01em' }}>Carregando...</p>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 640 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Configurações
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Dados da barbearia e comportamento da Bia
        </p>
      </div>

      {/* Informações gerais */}
      <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings style={{ width: 15, height: 15, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Informações gerais
          </span>
        </div>
        <div style={{ padding: 24 }}>
          <p style={{ color: '#6c7884', fontSize: 13, letterSpacing: '-0.01em', marginBottom: 24 }}>
            Essas informações são usadas pela Bia ao atender clientes
          </p>
          <form onSubmit={handleSaveInfo} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>Nome da barbearia</label>
              <input
                value={form.nome}
                onChange={e => set('nome', e.target.value)}
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#00e5a0')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2a343c')}
              />
            </div>
            <div>
              <label style={labelStyle}>Endereço</label>
              <input
                value={form.endereco}
                onChange={e => set('endereco', e.target.value)}
                placeholder="Av. Exemplo, 123 — Centro, Cidade/UF"
                style={{ ...inputStyle, color: form.endereco ? '#e9eef3' : '#6c7884' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#00e5a0')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2a343c')}
              />
            </div>
            <div>
              <label style={labelStyle}>Telefone / WhatsApp</label>
              <input
                value={form.telefone}
                onChange={e => set('telefone', e.target.value)}
                placeholder="(34) 99999-9999"
                style={{ ...inputStyle, color: form.telefone ? '#e9eef3' : '#6c7884' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#00e5a0')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2a343c')}
              />
            </div>
            <div style={{ paddingTop: 4 }}>
              <SaveButton saving={savingInfo} />
            </div>
          </form>
        </div>
      </div>

      {/* Script de atendimento */}
      <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bot style={{ width: 15, height: 15, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Script de atendimento da Bia
          </span>
        </div>
        <div style={{ padding: 24 }}>
          <p style={{ color: '#6c7884', fontSize: 13, letterSpacing: '-0.01em', marginBottom: 20, lineHeight: 1.5 }}>
            Defina como a Bia deve se comportar, o tom de voz, o que ela pode ou não dizer, e quais informações ela deve priorizar.
          </p>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(0,229,160,0.04)',
            border: '1px solid rgba(0,229,160,0.12)',
            borderRadius: 8,
            marginBottom: 20,
          }}>
            <p style={{ color: '#00e5a0', fontSize: 12.5, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 4 }}>
              Dica
            </p>
            <p style={{ color: '#6c7884', fontSize: 12.5, lineHeight: 1.5 }}>
              Use <code style={{ background: '#181e23', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 11.5, color: '#aab4bd' }}>{'{NOME_BARBEARIA}'}</code> para inserir o nome da barbearia automaticamente no script.
            </p>
          </div>
          <form onSubmit={handleSavePrompt} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Prompt / Script da IA</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={16}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  lineHeight: 1.6,
                  fontFamily: 'monospace',
                  fontSize: 13,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#00e5a0')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2a343c')}
              />
              <p style={{ color: '#3a444c', fontSize: 12, marginTop: 6, letterSpacing: '-0.01em' }}>
                {prompt.length} caracteres
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setPrompt(DEFAULT_PROMPT.replace('{NOME_BARBEARIA}', form.nome || 'barbearia'))}
                style={{
                  background: 'transparent',
                  border: '1px solid #2a343c',
                  borderRadius: 100,
                  color: '#6c7884',
                  fontSize: 13,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.01em',
                  transition: 'border-color .15s, color .15s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#3a444c'
                  el.style.color = '#aab4bd'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#2a343c'
                  el.style.color = '#6c7884'
                }}
              >
                Restaurar padrão
              </button>
              <SaveButton saving={savingPrompt} label="Salvar script" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
