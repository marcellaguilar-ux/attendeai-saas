'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#181e23',
  border: '1px solid #2a343c',
  borderRadius: 8,
  color: '#e9eef3',
  fontSize: 14,
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

export default function CadastroPage() {
  return <Suspense><CadastroForm /></Suspense>
}

function CadastroForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plano = searchParams.get('plano') || 'pro'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ nome: '', email: '', password: '', barbearia: '', telefone: '' })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Erro ao criar conta')
      setLoading(false)
      return
    }

    const supabase = createClient()
    await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    router.push(`/pagamento?plano=${plano}&barbershop_id=${data.barbershop_id}`)
  }

  const fields = [
    { key: 'nome', label: 'Seu nome', placeholder: 'João Silva', type: 'text' },
    { key: 'barbearia', label: 'Nome da barbearia', placeholder: 'Barbearia Monteiro', type: 'text' },
    { key: 'telefone', label: 'Telefone / WhatsApp', placeholder: '(34) 99999-9999', type: 'text' },
    { key: 'email', label: 'Email', placeholder: 'seu@email.com', type: 'email' },
    { key: 'password', label: 'Senha', placeholder: '••••••••', type: 'password' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0d10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "var(--font-geist-sans, 'Inter', sans-serif)",
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 36 }}>
          <div style={{
            background: '#00e5a0',
            borderRadius: 10,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 800,
            color: '#000',
            letterSpacing: '-0.04em',
          }}>a</div>
          <span style={{ color: '#e9eef3', fontSize: 20, fontWeight: 600, letterSpacing: '-0.025em' }}>
            AttendeAI
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: '#13181c',
          border: '1px solid #1d2429',
          borderRadius: 16,
          padding: 32,
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', marginBottom: 6 }}>
            Cadastrar barbearia
          </h1>
          <p style={{ color: '#6c7884', fontSize: 13.5, letterSpacing: '-0.01em', marginBottom: 28 }}>
            Comece a usar o agente IA no WhatsApp
          </p>

          <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  required={key !== 'telefone'}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#00e5a0')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#2a343c')}
                />
              </div>
            ))}

            {error && (
              <p style={{ color: '#f87171', fontSize: 13, letterSpacing: '-0.01em', margin: '-4px 0' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px 0',
                background: loading ? '#0f1316' : '#00e5a0',
                color: loading ? '#6c7884' : '#000',
                border: loading ? '1px solid #1d2429' : 'none',
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all .15s',
                marginTop: 4,
              }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#6c7884', fontSize: 13, letterSpacing: '-0.01em', marginTop: 24 }}>
            Já tem conta?{' '}
            <Link href="/login" style={{ color: '#00e5a0', textDecoration: 'none', fontWeight: 500 }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
