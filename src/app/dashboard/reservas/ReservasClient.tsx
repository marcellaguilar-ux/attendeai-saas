'use client'
import { useState } from 'react'
import { BedDouble, Calendar, User, Mail, Phone, ChevronDown, ChevronUp, RefreshCw, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'

type Reserva = {
  id: string
  acomodacao_nome: string
  acomodacao_id: string
  data_checkin: string
  data_checkout: string
  noites: number
  adultos: number
  criancas: number
  cliente_nome: string
  cliente_email: string | null
  cliente_whatsapp: string
  valor_total: number | null
  valor_entrada: number | null
  status: string
  created_at: string
  expires_at: string | null
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  aguardando_pagamento: { label: 'Aguardando Pagamento', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  confirmada:           { label: 'Confirmada',           color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  cancelada:            { label: 'Cancelada',            color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  expirada:             { label: 'Expirada',             color: 'var(--dash-text-muted)', bg: 'rgba(108,120,132,0.1)' },
}

function fmt(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fmtWa(wa: string) {
  const d = wa.replace(/\D/g, '')
  if (d.startsWith('55') && d.length >= 12) {
    const rest = d.slice(2)
    return `(${rest.slice(0,2)}) ${rest.slice(2,7)}-${rest.slice(7)}`
  }
  return wa
}

export default function ReservasClient({ reservas: initial, barbershopId }: { reservas: Reserva[]; barbershopId: string }) {
  const [reservas, setReservas] = useState(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [view, setView] = useState<'lista' | 'calendario'>('lista')
  const supabase = createClient()

  const filtered = filter === 'all' ? reservas : reservas.filter(r => r.status === filter)

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    if (status === 'confirmada') {
      // Rota de confirmação: atualiza Supabase + envia email
      const res = await fetch('/api/reservas/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reserva_id: id, barbershop_id: barbershopId }),
      })
      if (res.ok) setReservas(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } else {
      const { error } = await supabase
        .from('reservas_pousada')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('barbershop_id', barbershopId)
      if (!error) setReservas(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    }
    setUpdating(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: view === 'calendario' ? 'none' : 800 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--dash-text)', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            Reservas
          </h1>
          <p style={{ color: 'var(--dash-text-muted)', fontSize: 13.5, marginTop: 4 }}>
            {reservas.length} reserva{reservas.length !== 1 ? 's' : ''} registrada{reservas.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Toggle lista/calendário */}
          <div style={{ display: 'flex', background: 'var(--dash-bg-card)', border: '1px solid var(--dash-border)', borderRadius: 100, padding: 3, gap: 2 }}>
            {([['lista', List, 'Lista'], ['calendario', Calendar, 'Calendário']] as const).map(([v, Icon, label]) => (
              <button key={v} onClick={() => setView(v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                  background: view === v ? 'var(--dash-border)' : 'transparent',
                  color: view === v ? 'var(--dash-text)' : 'var(--dash-text-muted)',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          {/* Filtros (só na lista) */}
          {view === 'lista' && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[['all', 'Todas'], ['aguardando_pagamento', 'Aguardando'], ['confirmada', 'Confirmadas'], ['cancelada', 'Canceladas']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)}
                  style={{
                    padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                    border: filter === val ? 'none' : '1px solid var(--dash-border)',
                    background: filter === val ? 'var(--dash-accent)' : 'transparent',
                    color: filter === val ? '#000' : 'var(--dash-text-muted)',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {view === 'calendario' && <CalendarioOcupacao reservas={reservas} />}

      {/* Lista */}
      {view === 'lista' && (
        filtered.length === 0 ? (
          <div style={{
            background: 'var(--dash-bg-card)', border: '1px solid var(--dash-border)', borderRadius: 14,
            padding: '60px 24px', textAlign: 'center',
          }}>
            <BedDouble style={{ width: 32, height: 32, color: 'var(--dash-text-dim)', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--dash-text-muted)', fontSize: 14 }}>Nenhuma reserva encontrada.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(r => {
              const st = STATUS_MAP[r.status] ?? { label: r.status, color: 'var(--dash-text-muted)', bg: 'rgba(108,120,132,0.1)' }
              const open = expanded === r.id
              return (
                <div key={r.id} style={{ background: 'var(--dash-bg-card)', border: '1px solid var(--dash-border)', borderRadius: 14, overflow: 'hidden' }}>
                  {/* Row */}
                  <button
                    onClick={() => setExpanded(open ? null : r.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                      padding: '16px 20px', background: 'transparent', border: 'none',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    }}>
                    <BedDouble style={{ width: 16, height: 16, color: 'var(--dash-accent)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--dash-text)', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
                          {r.cliente_nome}
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 100,
                          background: st.bg, color: st.color,
                        }}>{st.label}</span>
                      </div>
                      <div style={{ color: 'var(--dash-text-muted)', fontSize: 12.5, marginTop: 3 }}>
                        {r.acomodacao_nome} · {fmt(r.data_checkin)} → {fmt(r.data_checkout)} · {r.noites} noite{r.noites !== 1 ? 's' : ''}
                        {r.valor_total ? ` · R$ ${Number(r.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
                      </div>
                    </div>
                    {open ? <ChevronUp style={{ width: 14, height: 14, color: 'var(--dash-text-dim)', flexShrink: 0 }} />
                          : <ChevronDown style={{ width: 14, height: 14, color: 'var(--dash-text-dim)', flexShrink: 0 }} />}
                  </button>

                  {/* Detalhe expandido */}
                  {open && (
                    <div style={{ borderTop: '1px solid var(--dash-border)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <InfoItem icon={<BedDouble size={13} />} label="Acomodação" value={`${r.acomodacao_nome} (${r.acomodacao_id})`} />
                        <InfoItem icon={<Calendar size={13} />} label="Período" value={`${fmt(r.data_checkin)} → ${fmt(r.data_checkout)} (${r.noites}n)`} />
                        <InfoItem icon={<User size={13} />} label="Hóspedes" value={`${r.adultos} adulto${r.adultos !== 1 ? 's' : ''}${r.criancas ? ` + ${r.criancas} criança${r.criancas !== 1 ? 's' : ''}` : ''}`} />
                        <InfoItem icon={<Phone size={13} />} label="WhatsApp" value={fmtWa(r.cliente_whatsapp)} />
                        {r.cliente_email && <InfoItem icon={<Mail size={13} />} label="E-mail" value={r.cliente_email} />}
                        {r.valor_total && (
                          <InfoItem icon={null} label="Valores"
                            value={`Total: R$ ${Number(r.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} · Entrada (50%): R$ ${Number(r.valor_entrada).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                        )}
                      </div>

                      <div style={{ fontSize: 11, color: 'var(--dash-text-dim)' }}>
                        ID: {r.id} · Criada em {new Date(r.created_at).toLocaleString('pt-BR')}
                      </div>

                      {/* Ações */}
                      {r.status === 'aguardando_pagamento' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <ActionButton
                            label="Confirmar Pagamento"
                            loading={updating === r.id}
                            color="var(--dash-accent)"
                            textColor="#000"
                            onClick={() => updateStatus(r.id, 'confirmada')}
                          />
                          <ActionButton
                            label="Cancelar"
                            loading={updating === r.id}
                            color="transparent"
                            textColor="#f87171"
                            border="1px solid rgba(248,113,113,0.3)"
                            onClick={() => updateStatus(r.id, 'cancelada')}
                          />
                        </div>
                      )}
                      {r.status === 'confirmada' && (
                        <ActionButton
                          label="Cancelar Reserva"
                          loading={updating === r.id}
                          color="transparent"
                          textColor="#f87171"
                          border="1px solid rgba(248,113,113,0.3)"
                          onClick={() => updateStatus(r.id, 'cancelada')}
                        />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--dash-text-dim)', marginBottom: 2 }}>
        {icon}
        <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</span>
      </div>
      <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13 }}>{value}</p>
    </div>
  )
}

function ActionButton({ label, loading, color, textColor, border, onClick }: {
  label: string; loading: boolean; color: string; textColor: string; border?: string; onClick: () => void
}) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
      borderRadius: 100, fontSize: 13, fontWeight: 600,
      background: loading ? 'var(--dash-border)' : color,
      color: loading ? 'var(--dash-text-dim)' : textColor,
      border: border ?? 'none', cursor: loading ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit',
    }}>
      {loading && <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />}
      {label}
    </button>
  )
}

// ─── Calendário de Ocupação ────────────────────────────────────────────────────

const UNIDADES = [
  { id: 'CHALE-DUPLO',      nome: 'Chalé Duplo' },
  { id: 'CHALE-TRIPLO',     nome: 'Chalé Triplo' },
  { id: 'QUARTO-DUPLO-01',  nome: 'Quarto Duplo 01' },
  { id: 'QUARTO-DUPLO-02',  nome: 'Quarto Duplo 02' },
  { id: 'QUARTO-TRIPLO-01', nome: 'Quarto Triplo 01' },
  { id: 'QUARTO-TRIPLO-02', nome: 'Quarto Triplo 02' },
]

const CELL_W = 38
const ROW_H  = 48
const COL_W  = 148

function CalendarioOcupacao({ reservas }: { reservas: Reserva[] }) {
  const [mes, setMes] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const ano     = mes.getFullYear()
  const numMes  = mes.getMonth()
  const totalDias = new Date(ano, numMes + 1, 0).getDate()
  const dias    = Array.from({ length: totalDias }, (_, i) => i + 1)

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const diaHoje = hoje.getFullYear() === ano && hoje.getMonth() === numMes ? hoje.getDate() : null

  const mesInicio  = new Date(ano, numMes, 1)
  const mesFim     = new Date(ano, numMes + 1, 0)

  function getBar(r: Reserva) {
    if (['cancelada', 'expirada'].includes(r.status)) return null
    const ini = new Date(r.data_checkin  + 'T12:00:00')
    const fim = new Date(r.data_checkout + 'T12:00:00')
    if (fim <= mesInicio || ini > mesFim) return null
    const startDay = ini < mesInicio ? 1 : ini.getDate()
    const endDay   = fim > mesFim    ? totalDias : fim.getDate()
    return { startDay, span: endDay - startDay + 1 }
  }

  return (
    <div style={{ background: 'var(--dash-bg-card)', border: '1px solid var(--dash-border)', borderRadius: 14, overflow: 'hidden' }}>
      {/* Nav do mês */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--dash-border)' }}>
        <button onClick={() => setMes(new Date(ano, numMes - 1, 1))} style={{
          background: 'transparent', border: '1px solid var(--dash-border)', borderRadius: 8,
          color: 'var(--dash-text-muted)', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center',
        }}>
          <ChevronLeft size={14} />
        </button>
        <span style={{ color: 'var(--dash-text)', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em', minWidth: 160, textAlign: 'center', textTransform: 'capitalize' }}>
          {mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => setMes(new Date(ano, numMes + 1, 1))} style={{
          background: 'transparent', border: '1px solid var(--dash-border)', borderRadius: 8,
          color: 'var(--dash-text-muted)', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center',
        }}>
          <ChevronRight size={14} />
        </button>
        <button onClick={() => { const d = new Date(); setMes(new Date(d.getFullYear(), d.getMonth(), 1)) }}
          style={{
            background: 'transparent', border: '1px solid var(--dash-border)', borderRadius: 8,
            color: 'var(--dash-text-muted)', cursor: 'pointer', padding: '4px 10px', fontSize: 11, fontFamily: 'inherit',
          }}>
          Hoje
        </button>
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: COL_W + dias.length * CELL_W }}>

          {/* Header: dias */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--dash-border)' }}>
            <div style={{ width: COL_W, flexShrink: 0 }} />
            {dias.map(d => {
              const isHoje = d === diaHoje
              const dow = new Date(ano, numMes, d).getDay()
              const isWeekend = dow === 0 || dow === 6
              return (
                <div key={d} style={{
                  width: CELL_W, flexShrink: 0, textAlign: 'center',
                  padding: '8px 0',
                  fontSize: 11, fontWeight: isHoje ? 700 : 400,
                  color: isHoje ? 'var(--dash-accent)' : isWeekend ? 'var(--dash-text-secondary)' : 'var(--dash-text-muted)',
                  background: isHoje ? 'rgba(0,229,160,0.06)' : 'transparent',
                  borderLeft: '1px solid var(--dash-border)',
                }}>
                  {d}
                </div>
              )
            })}
          </div>

          {/* Linhas por unidade */}
          {UNIDADES.map((unidade, ui) => {
            const resUnidade = reservas.filter(r => r.acomodacao_id === unidade.id)
            const bars = resUnidade.map(r => ({ r, bar: getBar(r) })).filter(x => x.bar !== null)

            return (
              <div key={unidade.id} style={{
                display: 'flex', alignItems: 'center',
                height: ROW_H,
                borderTop: ui > 0 ? '1px solid var(--dash-border)' : undefined,
                position: 'relative',
              }}>
                {/* Nome da unidade */}
                <div style={{
                  width: COL_W, flexShrink: 0, padding: '0 16px',
                  fontSize: 12, fontWeight: 500, color: 'var(--dash-text-secondary)',
                  whiteSpace: 'nowrap',
                }}>
                  {unidade.nome}
                </div>

                {/* Células dos dias */}
                <div style={{ position: 'relative', display: 'flex', height: '100%', flex: 1 }}>
                  {dias.map(d => {
                    const isHoje = d === diaHoje
                    const dow = new Date(ano, numMes, d).getDay()
                    const isWeekend = dow === 0 || dow === 6
                    return (
                      <div key={d} style={{
                        width: CELL_W, flexShrink: 0, height: '100%',
                        borderLeft: '1px solid var(--dash-border)',
                        background: isHoje
                          ? 'rgba(0,229,160,0.04)'
                          : isWeekend
                          ? 'rgba(255,255,255,0.01)'
                          : 'transparent',
                      }} />
                    )
                  })}

                  {/* Barras de reserva */}
                  {bars.map(({ r, bar }) => {
                    const st = STATUS_MAP[r.status] ?? { color: 'var(--dash-text-muted)', bg: 'rgba(108,120,132,0.2)', label: r.status }
                    return (
                      <div key={r.id} title={`${r.cliente_nome} — ${fmt(r.data_checkin)} → ${fmt(r.data_checkout)}`}
                        style={{
                          position: 'absolute',
                          left: (bar!.startDay - 1) * CELL_W + 3,
                          width: bar!.span * CELL_W - 6,
                          height: 30,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: st.bg,
                          border: `1px solid ${st.color}33`,
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          paddingLeft: 7,
                          overflow: 'hidden',
                          fontSize: 11,
                          color: st.color,
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          cursor: 'default',
                        }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: st.color, flexShrink: 0 }} />
                        {r.cliente_nome}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, padding: '12px 20px', borderTop: '1px solid var(--dash-border)', flexWrap: 'wrap' }}>
        {Object.entries(STATUS_MAP).filter(([k]) => k !== 'cancelada' && k !== 'expirada').map(([, st]) => (
          <div key={st.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: st.bg, border: `1px solid ${st.color}` }} />
            <span style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>{st.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
