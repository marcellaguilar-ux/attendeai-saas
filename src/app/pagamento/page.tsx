'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const PLANS: Record<string, { name: string; price: string; description: string; features: string[] }> = {
  starter: {
    name: 'Starter',
    price: 'R$ 197/mês',
    description: 'Para começar a automatizar seus agendamentos',
    features: [
      'Agente IA no WhatsApp 24h',
      'Agendamentos automáticos',
      'Integração Google Calendar',
      'Até 200 mensagens/mês',
    ],
  },
  pro: {
    name: 'Pro',
    price: 'R$ 397/mês',
    description: 'Para barbearias que querem crescer',
    features: [
      'Tudo do Starter',
      'Mensagens ilimitadas',
      'Dashboard de agendamentos',
      'Status da conexão WhatsApp',
      'Suporte por e-mail',
    ],
  },
  business: {
    name: 'Business',
    price: 'R$ 697/mês',
    description: 'Configuração completa e suporte dedicado',
    features: [
      'Tudo do Pro',
      'Onboarding dedicado',
      'Configuração completa do agente',
      'Treinamento personalizado',
      'Suporte prioritário via WhatsApp',
      'Ativação em até 24h',
    ],
  },
}

export default function PagamentoPage() {
  return <Suspense><PagamentoForm /></Suspense>
}

function PagamentoForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plano = searchParams.get('plano') || 'pro'
  const barbershop_id = searchParams.get('barbershop_id') || ''

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const plan = PLANS[plano] || PLANS.pro

  useEffect(() => {
    if (!barbershop_id) router.replace('/cadastro')
  }, [barbershop_id, router])

  async function handlePagar() {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let customer: Record<string, string> = {}
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('nome, email, telefone')
        .eq('id', user.id)
        .single()
      if (userData) {
        customer = {
          name: userData.nome || '',
          email: userData.email || user.email || '',
          phone: userData.telefone || '',
        }
      }
    }

    const res = await fetch('/api/payment/create-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plano, barbershop_id, customer }),
    })

    const data = await res.json()

    if (!res.ok || !data.url) {
      setError(data.error || 'Erro ao gerar link de pagamento')
      setLoading(false)
      return
    }

    window.location.href = data.url
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
      <div style={{ width: '100%', maxWidth: 480 }}>
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

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 36 }}>
          {['Plano', 'Cadastro', 'Pagamento', 'Configuração'].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: i === 2 ? 1 : i < 2 ? 0.5 : 0.3,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: i < 2 ? '#00e5a0' : i === 2 ? '#00e5a0' : '#1d2429',
                  border: i === 2 ? '2px solid #00e5a0' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: i <= 2 ? '#000' : '#6c7884',
                }}>
                  {i < 2 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i === 2 ? '#e9eef3' : '#6c7884', fontWeight: i === 2 ? 500 : 400 }}>
                  {step}
                </span>
              </div>
              {i < 3 && <div style={{ width: 20, height: 1, background: '#1d2429' }} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: '#13181c',
          border: '1px solid #1d2429',
          borderRadius: 16,
          padding: 32,
        }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)',
              borderRadius: 100, padding: '4px 12px', marginBottom: 16,
            }}>
              <span style={{ fontSize: 11, color: '#00e5a0', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Plano {plan.name}
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e9eef3', letterSpacing: '-0.03em', marginBottom: 6 }}>
              {plan.price}
            </h1>
            <p style={{ color: '#6c7884', fontSize: 14, letterSpacing: '-0.01em' }}>
              {plan.description}
            </p>
          </div>

          {/* Features */}
          <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plan.features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'rgba(0,229,160,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: 13.5, color: '#aab4bd', letterSpacing: '-0.01em' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#1d2429', marginBottom: 24 }} />

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span style={{ color: '#6c7884', fontSize: 14 }}>Total hoje</span>
            <span style={{ color: '#e9eef3', fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em' }}>
              {plan.price}
            </span>
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: 13, marginBottom: 16, letterSpacing: '-0.01em' }}>
              {error}
            </p>
          )}

          <button
            onClick={handlePagar}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 0',
              background: loading ? '#0f1316' : '#00e5a0',
              color: loading ? '#6c7884' : '#000',
              border: loading ? '1px solid #1d2429' : 'none',
              borderRadius: 100,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all .15s',
            }}
          >
            {loading ? 'Redirecionando para pagamento...' : 'Pagar agora →'}
          </button>

          <p style={{ textAlign: 'center', color: '#6c7884', fontSize: 12, letterSpacing: '-0.01em', marginTop: 16 }}>
            Você será redirecionado para o checkout seguro da InfinitePay.
            <br />PIX e cartão de crédito aceitos.
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#6c7884', fontSize: 12, marginTop: 20 }}>
          Quer trocar de plano?{' '}
          <a href="/#precos" style={{ color: '#00e5a0', textDecoration: 'none' }}>Ver planos</a>
        </p>
      </div>
    </div>
  )
}
