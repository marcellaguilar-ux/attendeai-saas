'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Scissors, Eye, EyeOff, CheckCircle } from 'lucide-react'

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

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError('Não foi possível redefinir a senha. O link pode ter expirado, solicite um novo.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2500)
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
          {done ? (
            /* Success */
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
                <CheckCircle style={{ width: 24, height: 24, color: '#00e5a0' }} />
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', marginBottom: 10 }}>
                Senha redefinida!
              </h1>
              <p style={{ color: '#6c7884', fontSize: 13.5, letterSpacing: '-0.01em', lineHeight: 1.55 }}>
                Redirecionando para o dashboard...
              </p>
            </div>
          ) : (
            /* Form */
            <>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', marginBottom: 6 }}>
                Nova senha
              </h1>
              <p style={{ color: '#6c7884', fontSize: 13.5, letterSpacing: '-0.01em', marginBottom: 28 }}>
                Escolha uma nova senha para sua conta.
              </p>

              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', color: '#aab4bd', fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 8 }}>
                    Nova senha
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      style={{ ...inputStyle, paddingRight: 44 }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#00e5a0')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#2a343c')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: '#6c7884', padding: 4,
                      }}
                    >
                      {showPass
                        ? <EyeOff style={{ width: 15, height: 15 }} />
                        : <Eye style={{ width: 15, height: 15 }} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#aab4bd', fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 8 }}>
                    Confirmar senha
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Repita a nova senha"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#00e5a0')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a343c')}
                  />
                </div>

                {/* Password strength hint */}
                {password.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, margin: '-8px 0' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        height: 3,
                        flex: 1,
                        borderRadius: 100,
                        background: password.length >= i * 3
                          ? i <= 1 ? '#f87171' : i <= 2 ? '#fbbf24' : '#00e5a0'
                          : '#1d2429',
                        transition: 'background .2s',
                      }} />
                    ))}
                  </div>
                )}

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
                  {loading ? 'Salvando...' : 'Redefinir senha'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
