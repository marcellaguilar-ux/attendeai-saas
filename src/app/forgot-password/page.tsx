'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Scissors, ArrowLeft, Mail } from 'lucide-react'

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

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    setLoading(false)
    if (error) {
      setError('Não foi possível enviar o email. Verifique o endereço e tente novamente.')
    } else {
      setSent(true)
    }
  }

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
            display: 'grid',
            placeItems: 'center',
          }}>
            <Scissors style={{ width: 18, height: 18, color: '#000' }} />
          </div>
          <span style={{ color: '#e9eef3', fontSize: 20, fontWeight: 600, letterSpacing: '-0.025em' }}>
            BarberAI
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: '#13181c',
          border: '1px solid #1d2429',
          borderRadius: 16,
          padding: 32,
        }}>
          {sent ? (
            /* Success state */
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 52,
                height: 52,
                background: 'rgba(0,229,160,0.08)',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 20px',
              }}>
                <Mail style={{ width: 22, height: 22, color: '#00e5a0' }} />
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', marginBottom: 10 }}>
                Email enviado
              </h1>
              <p style={{ color: '#6c7884', fontSize: 13.5, letterSpacing: '-0.01em', lineHeight: 1.55, marginBottom: 28 }}>
                Enviamos um link de recuperação para <span style={{ color: '#aab4bd', fontWeight: 500 }}>{email}</span>.
                Verifique sua caixa de entrada e spam.
              </p>
              <Link href="/login" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#00e5a0',
                fontSize: 13.5,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
              }}>
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Voltar ao login
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', marginBottom: 6 }}>
                Recuperar senha
              </h1>
              <p style={{ color: '#6c7884', fontSize: 13.5, letterSpacing: '-0.01em', marginBottom: 28 }}>
                Informe seu email e enviaremos um link para redefinir a senha.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', color: '#aab4bd', fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 8 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#00e5a0')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a343c')}
                  />
                </div>

                {error && (
                  <p style={{ color: '#f87171', fontSize: 13, letterSpacing: '-0.01em', margin: '-6px 0' }}>
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
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Link href="/login" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#6c7884',
                  fontSize: 13,
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                }}>
                  <ArrowLeft style={{ width: 13, height: 13 }} />
                  Voltar ao login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
