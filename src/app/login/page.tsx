'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
    } else {
      router.push('/dashboard')
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
            Entrar
          </h1>
          <p style={{ color: '#6c7884', fontSize: 13.5, letterSpacing: '-0.01em', marginBottom: 28 }}>
            Acesse o painel da sua barbearia
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ color: '#aab4bd', fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em' }}>
                  Senha
                </label>
                <Link href="/forgot-password" style={{ color: '#6c7884', fontSize: 12.5, letterSpacing: '-0.01em', textDecoration: 'none' }}>
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#6c7884', fontSize: 13, letterSpacing: '-0.01em', marginTop: 24 }}>
            Não tem conta?{' '}
            <Link href="/cadastro" style={{ color: '#00e5a0', textDecoration: 'none', fontWeight: 500 }}>
              Cadastre sua barbearia
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
