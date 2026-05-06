'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function PagamentoConcluido() {
  return <Suspense><PagamentoConcluidoContent /></Suspense>
}

function PagamentoConcluidoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const capture_method = searchParams.get('capture_method')
  const order_nsu = searchParams.get('order_nsu') || ''

  const [userName, setUserName] = useState('')

  const paymentLabel = capture_method === 'pix' ? 'PIX' : capture_method === 'credit_card' ? 'Cartão de Crédito' : 'pagamento'

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('users').select('nome').eq('id', user.id).single()
      if (data?.nome) setUserName(data.nome.split(' ')[0])
    }
    fetchUser()
  }, [])

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
      <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
        {/* Success icon */}
        <div style={{
          width: 72, height: 72,
          background: 'rgba(0,229,160,0.1)',
          border: '1px solid rgba(0,229,160,0.25)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 16l6 6 10-10" stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e9eef3', letterSpacing: '-0.03em', marginBottom: 12 }}>
          Pagamento confirmado!
        </h1>

        <p style={{ color: '#6c7884', fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
          {userName ? `Olá, ${userName}! ` : ''}Recebemos seu pagamento via {paymentLabel}.
        </p>
        <p style={{ color: '#6c7884', fontSize: 14, lineHeight: 1.6, marginBottom: 40 }}>
          Nossa equipe vai entrar em contato em breve para configurar seu agente de WhatsApp.
        </p>

        {/* Info card */}
        <div style={{
          background: '#13181c',
          border: '1px solid #1d2429',
          borderRadius: 12,
          padding: 20,
          marginBottom: 32,
          textAlign: 'left',
        }}>
          <p style={{ color: '#aab4bd', fontSize: 13, letterSpacing: '-0.01em', marginBottom: 12, fontWeight: 500 }}>
            Próximos passos:
          </p>
          {[
            'Você receberá um e-mail de confirmação',
            'Nossa equipe configura seu agente em até 24h',
            'Você acompanha tudo pela dashboard',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: 'rgba(0,229,160,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
                fontSize: 11, fontWeight: 700, color: '#00e5a0',
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 13.5, color: '#aab4bd', letterSpacing: '-0.01em', lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          style={{
            width: '100%',
            padding: '13px 0',
            background: '#00e5a0',
            color: '#000',
            border: 'none',
            borderRadius: 100,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Acessar dashboard →
        </button>

        {order_nsu && (
          <p style={{ color: '#6c7884', fontSize: 11, marginTop: 20, letterSpacing: '0.02em' }}>
            Pedido: {order_nsu}
          </p>
        )}
      </div>
    </div>
  )
}
