import { createClient } from '@/lib/supabase-server'
import { CreditCard, Scissors, TrendingUp } from 'lucide-react'

const PRECO_MENSAL = 97 // R$ por barbearia paga

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const d = Math.floor(diff / 86400000)
  if (d < 1) return 'hoje'
  if (d === 1) return 'ontem'
  return `${d}d atrás`
}

export default async function AdminFaturamentoPage() {
  const supabase = await createClient()

  const { data: barbearias } = await supabase
    .from('barbershops')
    .select('id, nome, slug, payment_status, created_at')
    .order('created_at', { ascending: false })

  const pagas = barbearias?.filter(b => b.payment_status === 'paid') ?? []
  const pendentes = barbearias?.filter(b => b.payment_status !== 'paid') ?? []

  const mrr = pagas.length * PRECO_MENSAL
  const arr = mrr * 12

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 900 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Faturamento
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>
          Receita recorrente da plataforma AttendeAI
        </p>
      </div>

      {/* MRR / ARR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6c7884', fontSize: 12.5, fontWeight: 500 }}>MRR</p>
              <p style={{ fontSize: 30, fontWeight: 600, color: '#00e5a0', letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: 8 }}>
                {formatBRL(mrr)}
              </p>
              <p style={{ color: '#6c7884', fontSize: 12, marginTop: 6 }}>por mês</p>
            </div>
            <div style={{ background: 'rgba(0,229,160,0.08)', borderRadius: 10, padding: 10 }}>
              <TrendingUp style={{ width: 18, height: 18, color: '#00e5a0' }} />
            </div>
          </div>
        </div>

        <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6c7884', fontSize: 12.5, fontWeight: 500 }}>ARR</p>
              <p style={{ fontSize: 30, fontWeight: 600, color: '#5b9cff', letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: 8 }}>
                {formatBRL(arr)}
              </p>
              <p style={{ color: '#6c7884', fontSize: 12, marginTop: 6 }}>projeção anual</p>
            </div>
            <div style={{ background: 'rgba(91,156,255,0.08)', borderRadius: 10, padding: 10 }}>
              <CreditCard style={{ width: 18, height: 18, color: '#5b9cff' }} />
            </div>
          </div>
        </div>

        <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6c7884', fontSize: 12.5, fontWeight: 500 }}>Clientes ativos</p>
              <p style={{ fontSize: 36, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: 8 }}>
                {pagas.length}
              </p>
              <p style={{ color: '#6c7884', fontSize: 12, marginTop: 6 }}>
                {pendentes.length} pendente{pendentes.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ background: 'rgba(233,238,243,0.06)', borderRadius: 10, padding: 10 }}>
              <Scissors style={{ width: 18, height: 18, color: '#aab4bd' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Clientes pagos */}
      <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CreditCard style={{ width: 15, height: 15, color: '#00e5a0' }} />
          <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Clientes pagos
          </span>
          <span style={{
            marginLeft: 'auto',
            padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
            background: 'rgba(0,229,160,0.08)', color: '#00e5a0',
          }}>
            {pagas.length} ativo{pagas.length !== 1 ? 's' : ''}
          </span>
        </div>

        {!pagas.length ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <CreditCard style={{ width: 36, height: 36, color: '#2a343c', margin: '0 auto 12px' }} />
            <p style={{ color: '#6c7884', fontSize: 13.5 }}>Nenhum cliente pago ainda</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pagas.map((b, i) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 24px',
                  borderBottom: i < pagas.length - 1 ? '1px solid #1d2429' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 600, color: '#00e5a0', flexShrink: 0,
                  }}>
                    {b.nome?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500 }}>{b.nome}</p>
                    <p style={{ color: '#6c7884', fontSize: 12, marginTop: 1 }}>
                      cadastro {timeAgo(b.created_at)}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#00e5a0', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
                    {formatBRL(PRECO_MENSAL)}<span style={{ color: '#6c7884', fontSize: 11, fontWeight: 400 }}>/mês</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clientes pendentes */}
      {pendentes.length > 0 && (
        <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #1d2429', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard style={{ width: 15, height: 15, color: '#f87171' }} />
            <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
              Pendentes de pagamento
            </span>
            <span style={{
              marginLeft: 'auto',
              padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
              background: 'rgba(248,113,113,0.1)', color: '#f87171',
            }}>
              {pendentes.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pendentes.map((b, i) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 24px',
                  borderBottom: i < pendentes.length - 1 ? '1px solid #1d2429' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 600, color: '#f87171', flexShrink: 0,
                  }}>
                    {b.nome?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500 }}>{b.nome}</p>
                    <p style={{ color: '#6c7884', fontSize: 12, marginTop: 1 }}>
                      cadastro {timeAgo(b.created_at)}
                    </p>
                  </div>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                  background: 'rgba(248,113,113,0.1)', color: '#f87171',
                }}>
                  Sem pagamento
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
