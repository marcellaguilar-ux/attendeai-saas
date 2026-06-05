'use client'
import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Service = { id: string; nome: string; preco: number; duracao_min: number }
type Shop    = { id: string; nome: string; slug: string; endereco?: string; telefone?: string; logo_url?: string }
type Barber  = { id: string; nome: string; foto_url?: string }

// ── helpers ───────────────────────────────────────────────────────────────────
const R   = (n: number) => String(n).padStart(2, '0')
const BRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const PT_MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const PT_DOW    = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB']

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${R(d.getMonth()+1)}-${R(d.getDate())}`
}
function gcalLink(shop: Shop, sv: Service, date: Date, time: string) {
  const y = date.getFullYear(), mo = date.getMonth()+1, d = date.getDate()
  const [h, m] = time.split(':').map(Number)
  const end = new Date(y, mo-1, d, h, m + (sv.duracao_min || 30))
  const s = `${y}${R(mo)}${R(d)}T${R(h)}${R(m)}00`
  const e = `${end.getFullYear()}${R(end.getMonth()+1)}${R(end.getDate())}T${R(end.getHours())}${R(end.getMinutes())}00`
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${shop.nome} — ${sv.nome}`)}&dates=${s}/${e}&location=${encodeURIComponent(shop.endereco||'')}&details=${encodeURIComponent(`Serviço: ${sv.nome} (${BRL(sv.preco)})\nLocal: ${shop.endereco||''}`)}`
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes popIn   { 0%{transform:scale(0);opacity:0} 65%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(0,229,160,.6)} 50%{box-shadow:0 0 0 5px rgba(0,229,160,0)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes reveal  { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }

  .booking-wrap { font-family:'Inter',system-ui,sans-serif; }

  /* booking card */
  .bk { border:1px solid #1d2429; border-radius:20px; overflow:hidden; background:#0d1115; }

  /* header bar */
  .bk-head {
    display:flex; justify-content:space-between; align-items:center;
    padding:14px 22px; border-bottom:1px solid #1d2429; background:#0f1316;
    font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.15em;
    text-transform:uppercase; color:#6c7884;
  }
  .bk-dots { display:flex; gap:6px; align-items:center; }
  .bk-dot  { width:9px; height:9px; border-radius:50%; }
  .bk-meta { display:flex; gap:20px; align-items:center; }
  .bk-meta strong { color:#aab4bd; font-weight:500; display:flex; align-items:center; gap:6px; }
  .live-dot {
    display:inline-block; width:6px; height:6px; border-radius:50%; background:#00e5a0;
    animation:pulse 1.6s ease-in-out infinite;
  }

  /* 4-col grid */
  .bk-grid { display:grid; grid-template-columns:1.1fr 1fr 1fr 300px; min-height:620px; }

  /* barber cards */
  .barber-card {
    border:1px solid #1d2429; border-radius:10px; padding:14px;
    cursor:pointer; display:flex; flex-direction:column; gap:10px;
    transition:all .25s; background:transparent; font-family:inherit; text-align:left; width:100%;
  }
  .barber-card:hover { border-color:#aab4bd; }
  .barber-card.on    { border-color:#00e5a0; background:rgba(0,229,160,.08); }

  .barber-portrait {
    width:100%; aspect-ratio:4/3; border-radius:6px; position:relative;
    overflow:hidden;
    background:
      repeating-linear-gradient(45deg,#1d2429 0,#1d2429 1px,transparent 1px,transparent 8px),
      #0f1316;
  }
  .barber-portrait::after {
    content:'PORTRAIT';
    position:absolute; inset:0; display:grid; place-items:center;
    font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.2em; color:#3a4551;
  }
  .barber-portrait:has(img)::after { display:none; }
  .barber-portrait img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }

  .barber-nm {
    font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:500;
    letter-spacing:-.01em; color:#e9eef3;
  }
  .barber-tag {
    font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.1em;
    color:#3a4551; border-top:1px solid #1d2429; padding-top:8px; text-transform:uppercase;
  }
  .barber-card.on .barber-tag { border-color:rgba(0,229,160,.15); }

  .b-col {
    padding:22px 20px; border-right:1px solid #1d2429;
    display:flex; flex-direction:column; gap:14px; min-width:0; overflow:hidden;
  }
  .b-col:last-child { border-right:0; background:#0f1316; }

  /* column header */
  .b-col-head {
    display:flex; justify-content:space-between; align-items:center;
    padding-bottom:10px; border-bottom:1px solid #1d2429;
    font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.15em;
    text-transform:uppercase; color:#6c7884;
  }
  .b-step {
    width:22px; height:22px; border-radius:50%; border:1px solid #2a343c;
    display:grid; place-items:center; font-family:'JetBrains Mono',monospace;
    font-size:9.5px; color:#6c7884; flex-shrink:0; transition:all .3s;
  }
  .b-step.done { background:#00e5a0; color:#000; border-color:#00e5a0; }

  /* service rows */
  .svc-row {
    display:grid; grid-template-columns:1fr auto auto; gap:12px; align-items:center;
    padding:11px 14px; border:1px solid #1d2429; border-radius:10px;
    cursor:pointer; background:transparent; text-align:left; font-family:inherit;
    transition:all .2s; width:100%;
  }
  .svc-row:hover { border-color:#aab4bd; background:rgba(0,229,160,.05); }
  .svc-row.on    { border-color:#00e5a0; background:rgba(0,229,160,.1); }
  .svc-nm  { font-size:14px; font-weight:500; color:#e9eef3; }
  .svc-du  { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.08em; color:#6c7884; text-transform:uppercase; white-space:nowrap; }
  .svc-pr  { font-family:'JetBrains Mono',monospace; font-size:12px; color:#00e5a0; font-weight:500; white-space:nowrap; }

  /* calendar */
  .cal-head {
    display:flex; justify-content:space-between; align-items:center;
    font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:#e9eef3;
  }
  .cal-nav { background:transparent; border:1px solid #1d2429; color:#aab4bd; width:24px; height:24px; border-radius:50%; cursor:pointer; display:grid; place-items:center; transition:border-color .15s; }
  .cal-nav:hover { border-color:#aab4bd; }
  .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; }
  .cal-dow  { font-family:'JetBrains Mono',monospace; font-size:8.5px; letter-spacing:.1em; text-align:center; color:#6c7884; padding:4px 0; text-transform:uppercase; }
  .cal-day  {
    aspect-ratio:1/1; border:1px solid transparent; border-radius:6px; display:grid;
    place-items:center; font-family:'JetBrains Mono',monospace; font-size:11px;
    cursor:pointer; color:#e9eef3; transition:all .15s; background:transparent; position:relative;
    width:100%;
  }
  .cal-day.muted { color:#3a4551; }
  .cal-day.dis   { color:#3a4551; cursor:not-allowed; }
  .cal-day.today:not(.on) { border-color:rgba(0,229,160,.4); color:#00e5a0; }
  .cal-day:not(.dis):not(.muted):hover { border-color:#6c7884; }
  .cal-day.on    { background:#00e5a0; color:#000; border-color:#00e5a0; font-weight:700; }

  /* slots */
  .slots-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:5px; }
  .slot {
    border:1px solid #1d2429; background:transparent; color:#e9eef3;
    border-radius:6px; padding:7px 4px; font-family:'JetBrains Mono',monospace;
    font-size:11px; letter-spacing:.04em; cursor:pointer; transition:all .15s; text-align:center;
  }
  .slot:hover { border-color:#6c7884; }
  .slot.on    { background:#00e5a0; color:#000; border-color:#00e5a0; }
  .slot.dis   { color:#3a4551; text-decoration:line-through; cursor:not-allowed; opacity:.4; }

  /* summary */
  .sum-row { padding:10px 0; border-bottom:1px dashed #1d2429; display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
  .sum-k   { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.1em; color:#6c7884; text-transform:uppercase; flex-shrink:0; padding-top:2px; }
  .sum-v   { font-size:13px; text-align:right; color:#e9eef3; }
  .sum-v small { color:#6c7884; display:block; font-size:10.5px; }
  .sum-v.empty { color:#6c7884; font-style:italic; }
  .sum-total { display:flex; justify-content:space-between; align-items:baseline; padding-top:16px; margin-top:auto; }
  .sum-total-lbl { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.15em; text-transform:uppercase; color:#6c7884; }
  .sum-total-val { font-family:'Space Grotesk',sans-serif; font-size:30px; font-weight:400; letter-spacing:-.025em; color:#e9eef3; }
  .sum-total-val small { color:#6c7884; font-size:13px; margin-left:4px; }

  /* contact inputs */
  .contact-lbl { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:#6c7884; display:block; margin-bottom:5px; }
  .contact-inp { width:100%; background:transparent; border:0; border-bottom:1px solid #1d2429; color:#e9eef3; padding:7px 0; font-size:13.5px; outline:none; transition:border-color .2s; font-family:inherit; }
  .contact-inp:focus { border-bottom-color:#00e5a0; }
  .contact-inp::placeholder { color:#3a4551; }

  /* CTA */
  .btn-confirm {
    width:100%; padding:12px 14px; border-radius:999px; border:0;
    background:#00e5a0; color:#000; font-size:12.5px; font-weight:600;
    cursor:pointer; font-family:inherit; transition:all .18s ease;
    display:flex; align-items:center; justify-content:center; gap:6px;
    white-space:nowrap;
  }
  .btn-confirm:hover:not(:disabled) { filter:brightness(1.08); transform:translateY(-1px); box-shadow:0 8px 28px rgba(0,229,160,.3); }
  .btn-confirm:active:not(:disabled) { transform:scale(.975); }
  .btn-confirm:disabled { background:#181e23; color:#4a5568; cursor:not-allowed; }

  /* confirmed */
  .confirmed-wrap { padding:60px 32px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:18px; }
  .confirmed-check { width:68px; height:68px; border-radius:50%; background:#00e5a0; color:#000; display:grid; place-items:center; font-size:28px; font-weight:700; animation:popIn .5s cubic-bezier(.22,1,.36,1); }
  .confirmed-h  { font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:400; letter-spacing:-.025em; color:#e9eef3; }
  .confirmed-p  { color:#6c7884; font-size:14px; max-width:38ch; }
  .confirmed-recap { display:flex; gap:24px; flex-wrap:wrap; justify-content:center; padding-top:20px; border-top:1px solid #1d2429; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; color:#6c7884; text-transform:uppercase; width:100%; max-width:480px; }
  .confirmed-recap > div { display:flex; flex-direction:column; gap:5px; align-items:center; }
  .confirmed-recap strong { color:#e9eef3; font-weight:500; font-size:13px; font-family:'Inter',sans-serif; letter-spacing:0; text-transform:none; }
  .gcal-link { display:flex; align-items:center; gap:8px; padding:11px 22px; border:1px solid #2a343c; border-radius:999px; color:#aab4bd; font-size:13px; text-decoration:none; font-family:inherit; transition:all .15s; }
  .gcal-link:hover { border-color:#00e5a0; color:#00e5a0; }
  .btn-ghost { background:transparent; border:1px solid #2a343c; color:#aab4bd; border-radius:999px; padding:9px 18px; font-size:13px; cursor:pointer; font-family:inherit; transition:all .15s; }
  .btn-ghost:hover { border-color:#6c7884; color:#e9eef3; }

  /* hero */
  .hero-cover { position:relative; height:180px; overflow:hidden; background:linear-gradient(135deg,#0c2a1d 0%,#0e1c26 45%,#080f14 100%); }
  .hero-glow   { position:absolute; top:-80px; left:50%; transform:translateX(-50%); width:480px; height:480px; border-radius:50%; background:radial-gradient(circle,rgba(0,229,160,.08) 0%,transparent 65%); pointer-events:none; }
  .hero-dots   { position:absolute; inset:0; opacity:.03; background-image:radial-gradient(#fff 1px,transparent 1px); background-size:22px 22px; }
  .hero-avatar { position:absolute; bottom:-28px; left:50%; transform:translateX(-50%); width:68px; height:68px; border-radius:18px; border:3px solid #0a0d10; overflow:hidden; flex-shrink:0; box-shadow:0 4px 22px rgba(0,0,0,.55); }
  .hero-shop-info { text-align:center; padding:46px 20px 0; }
  .hero-name { font-family:'Space Grotesk',sans-serif; font-size:20px; font-weight:500; letter-spacing:-.025em; color:#e9eef3; margin:0 0 8px; }
  .hero-meta { display:flex; justify-content:center; flex-wrap:wrap; gap:14px; }
  .hero-meta span { display:flex; align-items:center; gap:5px; color:#6c7884; font-size:12px; font-family:'JetBrains Mono',monospace; letter-spacing:.04em; }
  .hero-meta svg { width:11px; height:11px; color:#00e5a0; }

  /* stagger-in on slots */
  .slot-in { animation:fadeUp .18s both; }

  /* responsive */
  @media(max-width:980px) {
    .bk-grid { grid-template-columns:1fr 1fr; }
    .b-col:nth-child(2) { border-right:0; }
    .b-col:nth-child(3) { border-top:1px solid #1d2429; border-right:1px solid #1d2429; }
    .b-col:nth-child(4) { border-top:1px solid #1d2429; border-right:0; }
  }
  @media(max-width:580px) {
    .bk-grid { grid-template-columns:1fr; }
    .b-col    { border-right:0 !important; border-top:1px solid #1d2429; }
    .b-col:first-child { border-top:0; }
  }
  @media(max-width:480px) {
    .bk-head .bk-meta span:first-child { display:none; }
  }
`

// ── Calendar ──────────────────────────────────────────────────────────────────
function CalPicker({ value, today, viewMonth, setViewMonth, onChange }: {
  value: Date|null; today: Date; viewMonth: Date;
  setViewMonth: (d:Date)=>void; onChange:(d:Date)=>void
}) {
  const y = viewMonth.getFullYear(), mo = viewMonth.getMonth()
  const first = new Date(y, mo, 1).getDay()
  const dim   = new Date(y, mo+1, 0).getDate()

  const cells: {d:Date;muted:boolean}[] = []
  for (let i=0;i<first;i++) { const d=new Date(y,mo,-first+i+1); cells.push({d,muted:true}) }
  for (let i=1;i<=dim;i++)  cells.push({d:new Date(y,mo,i),muted:false})
  while(cells.length%7) { const last=cells[cells.length-1].d; cells.push({d:new Date(last.getFullYear(),last.getMonth(),last.getDate()+1),muted:true}) }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div className="cal-head">
        <button className="cal-nav" onClick={()=>setViewMonth(new Date(y,mo-1,1))}>
          <ChevronLeft style={{width:12,height:12}} />
        </button>
        <span>{PT_MONTHS[mo]} {y}</span>
        <button className="cal-nav" onClick={()=>setViewMonth(new Date(y,mo+1,1))}>
          <ChevronRight style={{width:12,height:12}} />
        </button>
      </div>
      <div className="cal-grid">
        {PT_DOW.map(d=><div key={d} className="cal-dow">{d}</div>)}
        {cells.map((c,i)=>{
          const past  = c.d < today
          const sun   = c.d.getDay()===0
          const sel   = value && c.d.toDateString()===value.toDateString()
          const isToday = c.d.toDateString()===today.toDateString()
          const dis   = past||sun||c.muted
          let cls = 'cal-day'
          if(c.muted) cls+=' muted'
          if(dis&&!c.muted) cls+=' dis'
          if(isToday&&!c.muted) cls+=' today'
          if(sel) cls+=' on'
          return (
            <button key={i} type="button" className={cls} disabled={dis}
              onClick={()=>!dis&&onChange(c.d)}>
              {c.d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BookingPage({ shop, services, barbers }: { shop:Shop; services:Service[]; barbers:Barber[] }) {
  const today = useMemo(()=>{ const d=new Date();d.setHours(0,0,0,0);return d },[])
  const [vm, setVm]   = useState(()=>new Date(today.getFullYear(),today.getMonth(),1))
  const [svc, setSvc] = useState<Service|null>(null)
  const [barber, setBarber] = useState<Barber|null>(()=> barbers.length === 1 ? barbers[0] : null)
  const [date, setDate] = useState<Date|null>(null)
  const [time, setTime] = useState<string|null>(null)
  const [slots, setSlots]     = useState<string[]>([])
  const [loadingSlots, setLS] = useState(false)
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoad] = useState(false)
  const [error, setError]  = useState('')
  const [confirmed, setConf] = useState(false)

  // Fetch slots when date changes
  useEffect(()=>{
    if(!date) return
    setTime(null)
    setLS(true); setSlots([])
    const ds = toDateStr(date)
    fetch(`/api/book/${shop.slug}/slots?date=${ds}`)
      .then(r=>r.json()).then(j=>{ setSlots(j.slots??[]); setLS(false) })
      .catch(()=>setLS(false))
  },[date, shop.slug])

  const canConfirm = !!(svc && barber && date && time && name.trim() && email.trim())

  async function handleBook() {
    if(!canConfirm) return
    setLoad(true); setError('')
    const res = await fetch(`/api/book/${shop.slug}`,{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ nome:name, email, servico:svc!.nome, preco:svc!.preco, data:toDateStr(date!), horario:time, barbeiro:barber?.nome ?? null })
    })
    const j = await res.json()
    if(!res.ok){ setError(j.error||'Erro ao confirmar'); setLoad(false) }
    else setConf(true)
  }

  const dateLabel = date ? date.toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'}) : null

  return (
    <div className="booking-wrap" style={{minHeight:'100vh',background:'#0a0d10',paddingBottom:60}}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <div style={{width:'100%',lineHeight:0}}>
        <img src="/header-barbearia-monteiro.svg" alt={shop.nome} style={{width:'100%',display:'block',maxHeight:220,objectFit:'cover',objectPosition:'center'}} />
      </div>

      {/* ── SHOP INFO ── */}
      <div className="hero-shop-info" style={{animation:'fadeUp .4s both',paddingTop:20}}>
        <div className="hero-meta">
          {shop.endereco && (
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {shop.endereco}
            </span>
          )}
          {shop.telefone && (
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.22 7.39 19.79 19.79 0 01.14 2.82 2 2 0 012.11 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09A16 16 0 0015.1 16.27l.47-.47a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              {shop.telefone}
            </span>
          )}
        </div>
      </div>

      {/* ── BOOKING CARD ── */}
      <div style={{maxWidth:1100,margin:'28px auto',padding:'0 16px',animation:'fadeUp .5s .1s both'}}>
        <div className="bk">

          {/* header bar */}
          <div className="bk-head">
            <div className="bk-dots">
              <div className="bk-dot" style={{background:'#f59e42'}} />
              <div className="bk-dot" style={{background:'#00e5a0'}} />
              <div className="bk-dot" style={{background:'#3b82f6'}} />
              <span style={{marginLeft:12}}>{shop.nome.toUpperCase()} · AGENDAMENTO ONLINE</span>
            </div>
            <div className="bk-meta">
              <span>HORÁRIO LOCAL · GMT-3</span>
              <strong><span className="live-dot" />SLOTS EM TEMPO REAL</strong>
            </div>
          </div>

          {/* ── CONFIRMED STATE ── */}
          {confirmed ? (
            <div className="confirmed-wrap">
              <div className="confirmed-check">✓</div>
              <h3 className="confirmed-h">Agendamento confirmado.</h3>
              <p className="confirmed-p">
                Enviamos a confirmação para <strong style={{color:'#e9eef3'}}>{email}</strong>. Você receberá um lembrete antes do horário.
              </p>
              <div className="confirmed-recap">
                {[
                  ['Serviço',  svc?.nome],
                  ['Barbeiro', barber?.nome],
                  ['Data',     date?.toLocaleDateString('pt-BR')],
                  ['Horário',  time],
                  ['Total',    svc ? BRL(svc.preco) : '—'],
                ].map(([lbl,val])=>(
                  <div key={lbl}><span>{lbl}</span><strong>{val}</strong></div>
                ))}
              </div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center',marginTop:4}}>
                <a href={gcalLink(shop, svc!, date!, time!)} target="_blank" rel="noopener noreferrer" className="gcal-link">
                  <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Adicionar ao Google Agenda
                </a>
                <button className="btn-ghost" onClick={()=>{ setConf(false);setSvc(null);setBarber(barbers.length===1?barbers[0]:null);setDate(null);setTime(null);setName('');setEmail('') }}>
                  Novo agendamento →
                </button>
              </div>
            </div>
          ) : (

          /* ── 4-COL GRID ── */
          <div className="bk-grid">

            {/* COL 1 — SERVIÇO */}
            <div className="b-col">
              <div className="b-col-head">
                <span>/ 01 · Serviço</span>
                <div className={`b-step${svc?' done':''}`}>{svc?'✓':'1'}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6,overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'#1d2429 transparent'}}>
                {services.map(sv=>(
                  <button key={sv.id} type="button" className={`svc-row${svc?.id===sv.id?' on':''}`} onClick={()=>setSvc(sv)}>
                    <span className="svc-nm">{sv.nome}</span>
                    <span className="svc-du">{sv.duracao_min}min</span>
                    <span className="svc-pr">{BRL(sv.preco)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* COL 2 — BARBEIRO */}
            <div className="b-col">
              <div className="b-col-head">
                <span>/ 02 · Barbeiro</span>
                <div className={`b-step${barber?' done':''}`}>{barber?'✓':'2'}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {barbers.map(b=>(
                  <button key={b.id} type="button" className={`barber-card${barber?.id===b.id?' on':''}`} onClick={()=>setBarber(b)}>
                    <div className="barber-portrait">
                      {b.foto_url && <img src={b.foto_url} alt={b.nome} />}
                    </div>
                    <div className="barber-nm">{b.nome}</div>
                    <div className="barber-tag">Barbeiro · {shop.nome}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* COL 3 — DATA & HORÁRIO */}
            <div className="b-col">
              <div className="b-col-head">
                <span>/ 03 · Data &amp; Horário</span>
                <div className={`b-step${(date&&time)?' done':''}`}>{(date&&time)?'✓':'3'}</div>
              </div>

              <CalPicker value={date} today={today} viewMonth={vm} setViewMonth={setVm} onChange={d=>{setDate(d);setTime(null)}} />

              {/* slots below calendar */}
              {date && loadingSlots && (
                <div style={{display:'flex',alignItems:'center',gap:8,paddingTop:4}}>
                  <div style={{width:16,height:16,border:'2px solid #1d2429',borderTopColor:'#00e5a0',borderRadius:'50%',animation:'spin .7s linear infinite',flexShrink:0}} />
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.1em',color:'#6c7884',textTransform:'uppercase'}}>Carregando horários...</span>
                </div>
              )}

              {date && !loadingSlots && slots.length===0 && (
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.1em',color:'#6c7884',textTransform:'uppercase',textAlign:'center',paddingTop:8}}>
                  Sem horários disponíveis.
                </div>
              )}

              {date && !loadingSlots && slots.length>0 && (
                <div>
                  {dateLabel && (
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.1em',color:'#6c7884',textTransform:'uppercase',marginBottom:8}}>{dateLabel}</div>
                  )}
                  <div className="slots-grid">
                    {slots.map((s,i)=>(
                      <button key={s} type="button" className={`slot slot-in${time===s?' on':''}`}
                        style={{animationDelay:`${i*0.025}s`}} onClick={()=>setTime(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!date && (
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.1em',color:'#3a4551',textTransform:'uppercase',textAlign:'center',paddingTop:4}}>
                  ▸ Selecione uma data
                </div>
              )}
            </div>

            {/* COL 4 — RESUMO */}
            <div className="b-col" style={{justifyContent:'space-between'}}>
              <div style={{display:'flex',flexDirection:'column',gap:18,flex:1}}>
                <div className="b-col-head">
                  <span>/ 04 · Resumo</span>
                  <div className="b-step" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>#</div>
                </div>

                {/* sum rows */}
                <div>
                  <div className="sum-row">
                    <span className="sum-k">Serviço</span>
                    <span className={`sum-v${!svc?' empty':''}`}>
                      {svc ? <>{svc.nome}<small>{svc.duracao_min} min</small></> : '— a escolher'}
                    </span>
                  </div>
                  <div className="sum-row">
                    <span className="sum-k">Barbeiro</span>
                    <span className={`sum-v${!barber?' empty':''}`}>
                      {barber ? barber.nome : '— a escolher'}
                    </span>
                  </div>
                  <div className="sum-row">
                    <span className="sum-k">Quando</span>
                    <span className={`sum-v${!(date&&time)?' empty':''}`}>
                      {date&&time ? <>{date.toLocaleDateString('pt-BR')}<small>{PT_DOW[date.getDay()]} · {time}</small></> : '— a escolher'}
                    </span>
                  </div>
                </div>

                {/* contact */}
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div>
                    <label className="contact-lbl">Seu nome</label>
                    <input className="contact-inp" type="text" placeholder="Nome completo" value={name} onChange={e=>setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="contact-lbl">E-mail</label>
                    <input className="contact-inp" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
                  </div>
                </div>

                {/* total */}
                <div className="sum-total" style={{borderTop:'1px solid #1d2429'}}>
                  <span className="sum-total-lbl">Total</span>
                  <span className="sum-total-val">
                    {svc ? BRL(svc.preco) : 'R$ —'}
                    {svc && <small>· {svc.duracao_min}min</small>}
                  </span>
                </div>
              </div>

              {error && (
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:'#f87171',background:'rgba(248,113,113,.06)',border:'1px solid rgba(248,113,113,.15)',borderRadius:8,padding:'9px 12px',letterSpacing:'.03em',marginBottom:4}}>
                  {error}
                </p>
              )}

              <button type="button" className="btn-confirm" disabled={!canConfirm||loading} onClick={handleBook}>
                {loading && <div style={{width:14,height:14,border:'2px solid rgba(0,0,0,.2)',borderTopColor:'#000',borderRadius:'50%',animation:'spin .7s linear infinite'}} />}
                {loading ? 'Confirmando...' : <>Confirmar agendamento <span style={{fontSize:16}}>→</span></>}
              </button>
            </div>

          </div>
          )}
        </div>

        <p style={{textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,letterSpacing:'.12em',color:'#2a343c',marginTop:18,textTransform:'uppercase'}}>
          Agendamento online · <span style={{color:'#00e5a0'}}>AttendeAI</span>
        </p>
      </div>
    </div>
  )
}
