'use client'
import { useState, useEffect } from 'react'
import { Calendar, List, ChevronLeft, ChevronRight } from 'lucide-react'

type Appointment = {
  id: string
  client_nome: string
  client_email?: string
  servico: string
  data: string   // YYYY-MM-DD
  horario: string // HH:MM or HH:MM:SS
  status: string
}

type ViewMode = 'list' | 'day' | 'week' | 'month'

const STATUS_COLOR: Record<string, string> = {
  confirmed: '#00e5a0',
  cancelled: '#f87171',
  done: '#6c7884',
}
const STATUS_BG: Record<string, string> = {
  confirmed: 'rgba(0,229,160,0.13)',
  cancelled: 'rgba(248,113,113,0.10)',
  done: 'rgba(108,120,132,0.10)',
}
const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  done: 'Concluído',
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 08–20
const HOUR_H = 64 // px per hour

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function weekStart(d: Date) {
  const c = new Date(d)
  c.setDate(c.getDate() - c.getDay())
  c.setHours(0,0,0,0)
  return c
}

// ── Event chip (shared) ───────────────────────────────────────────────────────
function EventChip({ a, style }: { a: Appointment; style?: React.CSSProperties }) {
  const color = STATUS_COLOR[a.status] || '#00e5a0'
  const bg = STATUS_BG[a.status] || STATUS_BG.confirmed
  return (
    <div style={{
      background: bg,
      borderLeft: `2px solid ${color}`,
      borderRadius: 5,
      padding: '3px 6px',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{ color, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {a.horario.slice(0,5)} {a.client_nome.split(' ')[0]}
      </div>
      <div style={{ color: '#6c7884', fontSize: 10.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
        {a.servico}
      </div>
    </div>
  )
}

// ── Month view ────────────────────────────────────────────────────────────────
function MonthView({ current, appointments }: { current: Date; appointments: Appointment[] }) {
  const year = current.getFullYear()
  const month = current.getMonth()
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = toDateStr(new Date())

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #1d2429' }}>
        {DAYS.map(d => (
          <div key={d} style={{ padding: '10px 8px', textAlign: 'center', color: '#6c7884', fontSize: 11.5, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {cells.map((day, i) => {
          if (!day) return (
            <div key={i} style={{ minHeight: 96, borderRight: i % 7 < 6 ? '1px solid #1d2429' : 'none', borderBottom: '1px solid #1d2429', background: '#0f1316' }} />
          )
          const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const appts = appointments.filter(a => a.data === dateStr)
          const isToday = dateStr === todayStr
          return (
            <div key={i} style={{ minHeight: 96, padding: '6px 6px 4px', borderRight: i % 7 < 6 ? '1px solid #1d2429' : 'none', borderBottom: '1px solid #1d2429' }}>
              <div style={{ marginBottom: 4 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 24, height: 24, borderRadius: '50%',
                  background: isToday ? '#00e5a0' : 'transparent',
                  color: isToday ? '#000' : '#aab4bd',
                  fontSize: 12.5, fontWeight: isToday ? 700 : 400,
                }}>{day}</span>
              </div>
              {appts.slice(0, 3).map(a => (
                <div key={a.id} style={{
                  background: STATUS_BG[a.status] || STATUS_BG.confirmed,
                  color: STATUS_COLOR[a.status] || '#00e5a0',
                  fontSize: 10.5, padding: '2px 5px', borderRadius: 4,
                  marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {a.horario.slice(0,5)} {a.client_nome.split(' ')[0]}
                </div>
              ))}
              {appts.length > 3 && <div style={{ color: '#6c7884', fontSize: 10, marginTop: 2 }}>+{appts.length - 3} mais</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Week view ─────────────────────────────────────────────────────────────────
function WeekView({ current, appointments }: { current: Date; appointments: Appointment[] }) {
  const ws = weekStart(current)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ws)
    d.setDate(ws.getDate() + i)
    return d
  })
  const todayStr = toDateStr(new Date())
  const [nowMin, setNowMin] = useState<number | null>(null)

  useEffect(() => {
    function update() {
      const n = new Date()
      setNowMin(n.getHours() * 60 + n.getMinutes())
    }
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ display: 'flex', overflowX: 'auto' }}>
      {/* Time gutter */}
      <div style={{ width: 52, flexShrink: 0, borderRight: '1px solid #1d2429' }}>
        <div style={{ height: 48, borderBottom: '1px solid #1d2429' }} />
        {HOURS.map(h => (
          <div key={h} style={{ height: HOUR_H, borderBottom: '1px solid #0f1316', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: 8, paddingTop: 4 }}>
            <span style={{ color: '#6c7884', fontSize: 10.5 }}>{String(h).padStart(2,'0')}:00</span>
          </div>
        ))}
      </div>
      {/* Days */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minWidth: 0 }}>
        {days.map((day, di) => {
          const dateStr = toDateStr(day)
          const isToday = dateStr === todayStr
          const appts = appointments.filter(a => a.data === dateStr)
          return (
            <div key={di} style={{ borderRight: di < 6 ? '1px solid #1d2429' : 'none' }}>
              {/* Header */}
              <div style={{ height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1d2429', gap: 1 }}>
                <span style={{ color: '#6c7884', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{DAYS[day.getDay()]}</span>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: isToday ? '#00e5a0' : 'transparent',
                  color: isToday ? '#000' : '#e9eef3',
                  fontSize: 13.5, fontWeight: isToday ? 700 : 400,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{day.getDate()}</div>
              </div>
              {/* Grid */}
              <div style={{ position: 'relative' }}>
                {HOURS.map(h => (
                  <div key={h} style={{ height: HOUR_H, borderBottom: '1px solid #1d2429' }} />
                ))}
                {/* Now line */}
                {isToday && nowMin !== null && nowMin >= 8*60 && nowMin <= 20*60 && (
                  <div style={{
                    position: 'absolute',
                    top: (nowMin - 8*60) / 60 * HOUR_H,
                    left: 0, right: 0,
                    height: 2, background: '#f87171',
                    zIndex: 10,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171', position: 'absolute', left: -4, top: -3 }} />
                  </div>
                )}
                {/* Events */}
                {appts.map(a => {
                  const [h, m] = a.horario.split(':').map(Number)
                  const top = (h - 8) * HOUR_H + (m / 60) * HOUR_H
                  return (
                    <div key={a.id} style={{ position: 'absolute', top: top + 2, left: 2, right: 2, zIndex: 5 }}>
                      <EventChip a={a} />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Day view ──────────────────────────────────────────────────────────────────
function DayView({ current, appointments }: { current: Date; appointments: Appointment[] }) {
  const dateStr = toDateStr(current)
  const appts = appointments.filter(a => a.data === dateStr)
  const todayStr = toDateStr(new Date())
  const isToday = dateStr === todayStr
  const [nowMin, setNowMin] = useState<number | null>(null)

  useEffect(() => {
    function update() {
      const n = new Date()
      setNowMin(n.getHours() * 60 + n.getMinutes())
    }
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      {/* Time gutter */}
      <div style={{ width: 52, flexShrink: 0, borderRight: '1px solid #1d2429' }}>
        <div style={{ height: 48, borderBottom: '1px solid #1d2429' }} />
        {HOURS.map(h => (
          <div key={h} style={{ height: HOUR_H, borderBottom: '1px solid #0f1316', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: 8, paddingTop: 4 }}>
            <span style={{ color: '#6c7884', fontSize: 10.5 }}>{String(h).padStart(2,'0')}:00</span>
          </div>
        ))}
      </div>
      {/* Day column */}
      <div style={{ flex: 1 }}>
        <div style={{ height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1d2429', gap: 1 }}>
          <span style={{ color: '#6c7884', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{DAYS[current.getDay()]}</span>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: isToday ? '#00e5a0' : 'transparent',
            color: isToday ? '#000' : '#e9eef3',
            fontSize: 13.5, fontWeight: isToday ? 700 : 400,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{current.getDate()}</div>
        </div>
        <div style={{ position: 'relative' }}>
          {HOURS.map(h => (
            <div key={h} style={{ height: HOUR_H, borderBottom: '1px solid #1d2429' }} />
          ))}
          {isToday && nowMin !== null && nowMin >= 8*60 && nowMin <= 20*60 && (
            <div style={{ position: 'absolute', top: (nowMin - 8*60) / 60 * HOUR_H, left: 0, right: 0, height: 2, background: '#f87171', zIndex: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171', position: 'absolute', left: -4, top: -3 }} />
            </div>
          )}
          {appts.map(a => {
            const [h, m] = a.horario.split(':').map(Number)
            const top = (h - 8) * HOUR_H + (m / 60) * HOUR_H
            return (
              <div key={a.id} style={{ position: 'absolute', top: top + 2, left: 8, right: 8, zIndex: 5 }}>
                <EventChip a={a} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── List view ─────────────────────────────────────────────────────────────────
function ListView({ appointments }: { appointments: Appointment[] }) {
  if (!appointments.length) return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <Calendar style={{ width: 36, height: 36, color: '#2a343c', margin: '0 auto 12px' }} />
      <p style={{ color: '#6c7884', fontSize: 14, fontWeight: 500 }}>Nenhum agendamento ainda</p>
      <p style={{ color: '#2a343c', fontSize: 13, marginTop: 4 }}>Os agendamentos feitos pela Bia aparecerão aqui</p>
    </div>
  )
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 110px', padding: '10px 20px', borderBottom: '1px solid #1d2429' }}>
        {['Cliente', 'Data', 'Horário', 'Status'].map(h => (
          <span key={h} style={{ color: '#6c7884', fontSize: 11.5, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</span>
        ))}
      </div>
      {appointments.map((a, i) => {
        const color = STATUS_COLOR[a.status] || '#6c7884'
        const bg = STATUS_BG[a.status] || 'rgba(108,120,132,0.08)'
        const label = STATUS_LABEL[a.status] || a.status
        return (
          <div key={a.id} className="appt-row" style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 110px', alignItems: 'center', padding: '14px 20px', borderBottom: i < appointments.length - 1 ? '1px solid #1d2429' : 'none', background: 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: 'rgba(0,229,160,0.08)', borderRadius: 8, padding: 7, flexShrink: 0 }}>
                <Calendar style={{ width: 13, height: 13, color: '#00e5a0' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.client_nome}</p>
                <p style={{ color: '#6c7884', fontSize: 12, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.servico}{a.client_email ? ` · ${a.client_email}` : ''}</p>
              </div>
            </div>
            <span style={{ color: '#aab4bd', fontSize: 13.5 }}>{new Date(a.data + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
            <span style={{ color: '#aab4bd', fontSize: 13.5 }}>{String(a.horario).slice(0,5)}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 500, background: bg, color, width: 'fit-content' }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AgendamentosClient({ appointments }: { appointments: Appointment[] }) {
  const [view, setView] = useState<ViewMode>('list')
  const [current, setCurrent] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d })

  function navigate(dir: 1 | -1) {
    setCurrent(prev => {
      const d = new Date(prev)
      if (view === 'month') d.setMonth(d.getMonth() + dir)
      else if (view === 'week') d.setDate(d.getDate() + dir * 7)
      else if (view === 'day') d.setDate(d.getDate() + dir)
      return d
    })
  }

  function goToday() { const d = new Date(); d.setHours(0,0,0,0); setCurrent(d) }

  function getTitle() {
    if (view === 'month') return `${MONTHS[current.getMonth()]} de ${current.getFullYear()}`
    if (view === 'week') {
      const ws = weekStart(current)
      const we = new Date(ws); we.setDate(ws.getDate() + 6)
      if (ws.getMonth() === we.getMonth())
        return `${ws.getDate()} – ${we.getDate()} de ${MONTHS[ws.getMonth()]} de ${ws.getFullYear()}`
      return `${ws.getDate()} de ${MONTHS[ws.getMonth()]} – ${we.getDate()} de ${MONTHS[we.getMonth()]}`
    }
    if (view === 'day') return `${DAYS[current.getDay()]}, ${current.getDate()} de ${MONTHS[current.getMonth()]} de ${current.getFullYear()}`
    return ''
  }

  const calView = view !== 'list'
  const todayStr = toDateStr(new Date())

  const viewButtons: { id: ViewMode; label: string }[] = [
    { id: 'list', label: 'Lista' },
    { id: 'day', label: 'Dia' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mês' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: calView ? 'none' : 960 }}>
      <style>{`.appt-row { transition: background .12s; } .appt-row:hover { background: #181e23 !important; }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em', lineHeight: 1.15 }}>Agendamentos</h1>
          <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4, letterSpacing: '-0.01em' }}>{appointments.length} agendamentos no total</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: '#13181c', border: '1px solid #1d2429', borderRadius: 10, padding: 3, gap: 2 }}>
            {viewButtons.map(({ id, label }) => (
              <button key={id} onClick={() => setView(id)} style={{
                padding: '6px 14px', borderRadius: 7, border: 'none',
                background: view === id ? '#00e5a0' : 'transparent',
                color: view === id ? '#000' : '#6c7884',
                fontSize: 13, fontWeight: view === id ? 600 : 400,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
              }}>{label}</button>
            ))}
          </div>

          {/* Calendar navigation */}
          {calView && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={goToday} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #2a343c', background: 'transparent', color: '#aab4bd', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Hoje
              </button>
              <button onClick={() => navigate(-1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #2a343c', background: 'transparent', color: '#aab4bd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft style={{ width: 15, height: 15 }} />
              </button>
              <button onClick={() => navigate(1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #2a343c', background: 'transparent', color: '#aab4bd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight style={{ width: 15, height: 15 }} />
              </button>
              <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em', minWidth: 160 }}>
                {getTitle()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, overflow: 'hidden' }}>
        {view === 'list' && <ListView appointments={appointments} />}
        {view === 'month' && <MonthView current={current} appointments={appointments} />}
        {view === 'week' && <WeekView current={current} appointments={appointments} />}
        {view === 'day' && <DayView current={current} appointments={appointments} />}
      </div>
    </div>
  )
}
