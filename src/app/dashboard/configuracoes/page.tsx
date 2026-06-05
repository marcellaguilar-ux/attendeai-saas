'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Settings, Check } from 'lucide-react'
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

export default function ConfiguracoesPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [barbershopId, setBarbershopId] = useState('')
  const [form, setForm] = useState({ nome: '', endereco: '', telefone: '' })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userData } = await supabase.from('users')
        .select('barbershop_id, barbershops(*)').eq('id', user!.id).single()
      const shop = (userData as any)?.barbershops
      if (shop) {
        setBarbershopId(shop.id)
        setForm({ nome: shop.nome || '', endereco: shop.endereco || '', telefone: shop.telefone || '' })
      }
      setLoading(false)
    }
    load()
  }, [])

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('barbershops').update(form).eq('id', barbershopId)
    setSaving(false)
    if (error) toast.error('Erro ao salvar')
    else toast.success('Configurações salvas!')
  }

  if (loading) return (
    <p style={{ color: '#6c7884', fontSize: 13.5, letterSpacing: '-0.01em' }}>Carregando...</p>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 560 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Configurações
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Dados da sua barbearia
        </p>
      </div>

      {/* Form card */}
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
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
                {saving
                  ? 'Salvando...'
                  : <><Check style={{ width: 14, height: 14 }} /> Salvar alterações</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
