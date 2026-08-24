'use client'
import { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&family=Instrument+Serif&display=swap');

/* ═══════════════════════════ TOKENS ═══════════════════════════ */
:root {
  --bg: #0a0d10; --bg-elev: #0f1316; --surface: #13181c; --surface-2: #181e23;
  --border: #1d2429; --border-strong: #2a343c;
  --text: #e9eef3; --text-2: #aab4bd; --muted: #6c7884;
  --accent: #00e5a0; --accent-ink: #000;
  --accent-soft: rgba(0,229,160,.08); --accent-line: rgba(0,229,160,.22);
  --font-sans: 'Geist','Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  --font-mono: 'Geist Mono','SF Mono',Menlo,monospace;
  --container: 1200px; --r-sm:8px; --r-md:12px; --r-lg:18px; --r-xl:24px;
  color-scheme: dark;
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
body{background:var(--bg);color:var(--text);font-family:var(--font-sans);font-weight:400;font-size:15px;line-height:1.5;letter-spacing:-.005em;overflow-x:hidden;}
a{color:inherit;text-decoration:none;}
button{font-family:inherit;}
::selection{background:var(--accent);color:var(--accent-ink);}

body::before{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:.35;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

/* ═══════════════════════════ LAYOUT ═══════════════════════════ */
.wrap{max-width:var(--container);margin:0 auto;padding:0 32px;}
@media(max-width:700px){.wrap{padding:0 20px;}}
section{padding:100px 0;position:relative;}
.section-head{max-width:640px;margin-bottom:64px;}
.section-head.center{margin-left:auto;margin-right:auto;text-align:center;}

/* ═══════════════════════════ TYPE ═══════════════════════════ */
h1,h2,h3{font-family:var(--font-sans);font-weight:600;letter-spacing:-.025em;line-height:1.05;}

.eyebrow{font-family:var(--font-mono);font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:inline-flex;align-items:center;gap:8px;margin-bottom:20px;}
.eyebrow::before{content:'';width:14px;height:1px;background:var(--accent);}
.section-head.center .eyebrow{justify-content:center;}
.section-title{font-size:clamp(2rem,4vw,3.2rem);font-weight:500;letter-spacing:-.035em;line-height:1.02;margin-bottom:20px;}
.section-sub{color:var(--text-2);font-size:17px;line-height:1.55;font-weight:400;max-width:520px;letter-spacing:-.01em;}
.section-head.center .section-sub{margin:0 auto;}

/* ═══════════════════════════ SCROLL BAR ═══════════════════════════ */
.scroll-bar{position:fixed;top:0;left:0;z-index:200;height:2px;background:var(--accent);width:0%;transition:width .1s linear;}

/* ═══════════════════════════ NAV ═══════════════════════════ */
nav{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:100;width:calc(100% - 32px);max-width:calc(var(--container) - 64px);display:flex;align-items:center;justify-content:space-between;padding:10px 10px 10px 20px;background:color-mix(in oklab,var(--bg-elev) 85%,transparent);backdrop-filter:blur(20px) saturate(1.4);-webkit-backdrop-filter:blur(20px) saturate(1.4);border:1px solid var(--border);border-radius:100px;transition:all .3s;}
.logo{font-family:var(--font-sans);font-weight:600;font-size:16px;letter-spacing:-.02em;color:var(--text);display:flex;align-items:center;gap:8px;}
.logo-mark{width:20px;height:20px;border-radius:6px;background:var(--accent);display:grid;place-items:center;color:var(--accent-ink);font-weight:800;font-size:12px;letter-spacing:0;}
.nav-links{display:flex;gap:6px;list-style:none;}
.nav-links a{color:var(--text-2);font-size:13.5px;font-weight:400;padding:8px 14px;border-radius:100px;transition:all .2s;}
.nav-links a:hover{color:var(--text);background:var(--surface-2);}
.nav-links a.nav-active{color:var(--text);}
.nav-right{display:flex;align-items:center;gap:4px;}
.nav-login-link{color:var(--text-2);font-size:13.5px;padding:8px 14px;border-radius:100px;transition:all .2s;}
.nav-login-link:hover{color:var(--text);background:var(--surface-2);}
.nav-cta{background:var(--accent);color:var(--accent-ink);padding:9px 18px;border-radius:100px;font-size:13.5px;font-weight:500;border:none;white-space:nowrap;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px;text-decoration:none;}
.nav-cta:hover{filter:brightness(1.08);transform:translateY(-1px);}
@media(max-width:780px){.nav-links{display:none;}nav{padding:8px 8px 8px 16px;}}

/* ═══════════════════════════ ANIMATIONS ═══════════════════════════ */
@keyframes pulse{0%,100%{box-shadow:0 0 0 3px var(--accent-soft);}50%{box-shadow:0 0 0 6px transparent;}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.fade-up{opacity:0;transform:translateY(20px);}
.fade-up.visible{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) both;}
@media(prefers-reduced-motion:reduce){.fade-up,.fade-up.visible{animation:none;opacity:1;transform:none;}}

/* ═══════════════════════════ HERO PREÇOS ═══════════════════════════ */
.ph-hero{padding:160px 0 80px;text-align:center;position:relative;overflow:hidden;}
.ph-hero-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 70% 50% at 50% 0%,var(--accent-soft) 0%,transparent 65%);pointer-events:none;}
.ph-hero-grid{position:absolute;inset:0;z-index:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse at 50% 0%,black 5%,transparent 65%);-webkit-mask-image:radial-gradient(ellipse at 50% 0%,black 5%,transparent 65%);opacity:.6;}
.ph-hero .wrap{position:relative;z-index:1;}
.ph-hero h1{font-size:clamp(2.5rem,5.5vw,4.5rem);font-weight:500;letter-spacing:-.04em;line-height:1.0;margin-bottom:20px;text-wrap:balance;}
.ph-hero h1 em{font-style:normal;color:var(--accent);}
.ph-hero-sub{font-size:18px;color:var(--text-2);line-height:1.55;max-width:520px;margin:0 auto 48px;letter-spacing:-.01em;}

/* ═══════════════════════════ BILLING TOGGLE ═══════════════════════════ */
.billing-toggle{display:inline-flex;padding:4px;background:var(--surface);border:1px solid var(--border);border-radius:100px;gap:2px;}
.billing-toggle button{padding:8px 20px;border-radius:100px;border:none;background:transparent;color:var(--text-2);font-size:13px;cursor:pointer;font-family:inherit;letter-spacing:-.005em;display:inline-flex;align-items:center;gap:8px;transition:all .2s;}
.billing-toggle button.active{background:var(--bg);color:var(--text);box-shadow:0 1px 2px rgba(0,0,0,.2);}
.save-tag{font-family:var(--font-mono);font-size:10px;background:var(--accent-soft);color:var(--accent);padding:2px 7px;border-radius:100px;letter-spacing:.03em;border:1px solid var(--accent-line);}

/* ═══════════════════════════ PLAN CARDS ═══════════════════════════ */
.ph-plans{padding:0 0 100px;}
.plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start;}
@media(max-width:960px){.plans-grid{grid-template-columns:1fr;max-width:460px;margin:0 auto;}}

.plan-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:32px 28px;display:flex;flex-direction:column;position:relative;transition:border-color .3s;}
.plan-card:hover{border-color:var(--border-strong);}
.plan-card.featured{border-color:var(--border-strong);background:linear-gradient(180deg,color-mix(in oklab,var(--accent) 5%,var(--surface)) 0%,var(--surface) 50%);box-shadow:0 24px 64px -30px color-mix(in oklab,var(--accent) 35%,transparent),inset 0 1px 0 0 var(--accent-line);}

.plan-badge{position:absolute;top:20px;right:20px;font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;background:var(--accent);color:var(--accent-ink);padding:3px 10px;border-radius:100px;font-weight:500;}
.plan-name-label{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:20px;}
.plan-price-row{display:flex;align-items:baseline;gap:4px;margin-bottom:6px;}
.plan-cur{font-size:18px;font-weight:500;color:var(--text-2);}
.plan-amt{font-family:var(--font-sans);font-size:52px;font-weight:500;line-height:1;letter-spacing:-.03em;transition:opacity .2s;}
.plan-per{font-size:12.5px;color:var(--muted);font-family:var(--font-mono);}
.plan-saving{font-family:var(--font-mono);font-size:11px;color:var(--accent);height:18px;margin-bottom:4px;transition:opacity .2s;}
.plan-desc{font-size:13.5px;color:var(--text-2);line-height:1.55;margin:16px 0;padding-bottom:20px;border-bottom:1px solid var(--border);}
.plan-feats{list-style:none;display:flex;flex-direction:column;gap:9px;flex:1;margin-bottom:24px;margin-top:4px;}
.plan-feats li{font-size:13px;display:flex;align-items:flex-start;gap:10px;line-height:1.5;letter-spacing:-.005em;}
.plan-feats svg{width:14px;height:14px;flex-shrink:0;margin-top:2px;}
.chk{color:var(--accent);}
.crs{color:var(--muted);opacity:.4;}
.plan-feats li.dim{color:var(--muted);}
.btn-plan{width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .2s;letter-spacing:-.005em;display:inline-flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;}
.btn-plan.outline{background:transparent;color:var(--text);border:1px solid var(--border-strong);}
.btn-plan.outline:hover{border-color:var(--text-2);background:var(--surface-2);}
.btn-plan.filled{background:var(--accent);color:var(--accent-ink);border:1px solid var(--accent);}
.btn-plan.filled:hover{filter:brightness(1.08);}
.btn-plan svg{width:14px;height:14px;transition:transform .2s;}
.btn-plan:hover svg{transform:translateX(3px);}

/* ═══════════════════════════ TRUST BAND ═══════════════════════════ */
.trust-band{border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:28px 0;background:var(--bg-elev);}
.trust-items{display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;}
.trust-item{display:flex;align-items:center;gap:10px;font-size:13.5px;color:var(--text-2);}
.trust-item svg{width:16px;height:16px;color:var(--accent);flex-shrink:0;}
@media(max-width:600px){.trust-items{gap:20px;flex-direction:column;align-items:flex-start;padding:0 20px;}}

/* ═══════════════════════════ COMPARISON TABLE ═══════════════════════════ */
.ph-compare{padding:100px 0;}
.compare-table-wrap{overflow-x:auto;border-radius:var(--r-lg);border:1px solid var(--border);}
.compare-table{width:100%;border-collapse:collapse;font-size:13.5px;}
.compare-table th,.compare-table td{padding:14px 20px;text-align:left;border-bottom:1px solid var(--border);}
.compare-table tr:last-child td{border-bottom:none;}
.compare-table thead th{background:var(--surface-2);font-weight:500;letter-spacing:-.005em;position:sticky;top:0;}
.compare-table thead th:not(:first-child){text-align:center;font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);}
.compare-table thead th.th-featured{color:var(--accent);}
.compare-table .cat-row td{background:var(--surface);color:var(--muted);font-family:var(--font-mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;padding:10px 20px;}
.compare-table td:not(:first-child){text-align:center;color:var(--text-2);}
.compare-table td.col-feat{color:var(--text);font-weight:400;letter-spacing:-.005em;}
.compare-table tr:hover td{background:color-mix(in oklab,var(--surface-2) 60%,transparent);}
.compare-table .cat-row:hover td{background:var(--surface);}
.chk-icon{color:var(--accent);display:inline-flex;}
.crs-icon{color:var(--muted);opacity:.35;display:inline-flex;}
.val-tag{font-family:var(--font-mono);font-size:11px;background:var(--surface-2);padding:2px 8px;border-radius:6px;color:var(--text-2);border:1px solid var(--border);}
.val-tag.accent{background:var(--accent-soft);color:var(--accent);border-color:var(--accent-line);}

/* ═══════════════════════════ ROI SECTION ═══════════════════════════ */
.ph-roi{padding:80px 0;background:var(--bg-elev);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.roi-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
@media(max-width:760px){.roi-grid{grid-template-columns:1fr;gap:40px;}}
.roi-calc{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-xl);padding:36px;}
.roi-label{font-size:13px;color:var(--text-2);margin-bottom:10px;letter-spacing:-.005em;}
.roi-range{-webkit-appearance:none;appearance:none;width:100%;height:4px;background:var(--border-strong);border-radius:2px;outline:none;margin-bottom:24px;cursor:pointer;}
.roi-range::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--accent);cursor:pointer;box-shadow:0 0 0 4px var(--accent-soft);}
.roi-result{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.roi-metric{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;}
.roi-metric .rm-val{font-size:26px;font-weight:500;letter-spacing:-.03em;color:var(--accent);}
.roi-metric .rm-label{font-size:11.5px;color:var(--muted);margin-top:2px;letter-spacing:-.005em;}
.roi-copy h2{font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:500;letter-spacing:-.035em;line-height:1.05;margin-bottom:20px;}
.roi-copy p{color:var(--text-2);font-size:15.5px;line-height:1.6;letter-spacing:-.005em;}
.roi-note{font-size:12px;color:var(--muted);font-family:var(--font-mono);margin-top:20px;}

/* ═══════════════════════════ FAQ ═══════════════════════════ */
.ph-faq{padding:100px 0;}
.faq-wrap{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:0;}
.faq-item{border-bottom:1px solid var(--border);}
.faq-item:first-child{border-top:1px solid var(--border);}
.faq-q{width:100%;background:none;border:none;padding:20px 0;display:flex;align-items:center;justify-content:space-between;gap:16px;cursor:pointer;color:var(--text);font-size:15px;font-weight:500;letter-spacing:-.015em;text-align:left;transition:color .2s;}
.faq-q:hover{color:var(--accent);}
.faq-arrow{width:24px;height:24px;border-radius:50%;border:1px solid var(--border);display:grid;place-items:center;flex-shrink:0;transition:all .3s;}
.faq-arrow svg{width:12px;height:12px;transition:transform .3s;}
[data-open="true"] .faq-arrow{background:var(--accent-soft);border-color:var(--accent-line);}
[data-open="true"] .faq-arrow svg{transform:rotate(45deg);}
.faq-a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s cubic-bezier(.22,1,.36,1);}
[data-open="true"] .faq-a{grid-template-rows:1fr;}
.faq-a-inner{overflow:hidden;}
.faq-a-inner p{padding:0 0 20px;color:var(--text-2);font-size:14.5px;line-height:1.65;letter-spacing:-.005em;}

/* ═══════════════════════════ CTA FINAL ═══════════════════════════ */
.cta-final{padding:100px 0;text-align:center;position:relative;overflow:hidden;}
.cta-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 70% 60% at 50% 50%,var(--accent-soft) 0%,transparent 65%);pointer-events:none;}
.cta-final .wrap{position:relative;z-index:1;}
.cta-final h2{font-size:clamp(2rem,4.5vw,3.6rem);font-weight:500;letter-spacing:-.04em;line-height:1.0;margin-bottom:16px;text-wrap:balance;}
.cta-final p{color:var(--text-2);font-size:16px;line-height:1.6;max-width:460px;margin:0 auto 40px;letter-spacing:-.01em;}
.cta-actions{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;}
.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;border-radius:10px;font-size:14.5px;font-weight:500;letter-spacing:-.005em;cursor:pointer;border:none;transition:all .2s;font-family:inherit;text-decoration:none;}
.btn-primary{background:var(--accent);color:var(--accent-ink);box-shadow:0 0 0 1px color-mix(in oklab,var(--accent) 30%,transparent),0 8px 24px -8px color-mix(in oklab,var(--accent) 40%,transparent);}
.btn-primary:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 0 0 1px color-mix(in oklab,var(--accent) 40%,transparent),0 14px 32px -8px color-mix(in oklab,var(--accent) 55%,transparent);}
.btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border-strong);}
.btn-ghost:hover{border-color:var(--text-2);background:var(--surface);}
.btn svg{width:15px;height:15px;}

/* ═══════════════════════════ FOOTER ═══════════════════════════ */
footer{border-top:1px solid var(--border);padding:32px 0;}
.footer-inner{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:20px;}
.footer-links{display:flex;gap:4px;flex-wrap:wrap;}
.footer-links a{color:var(--muted);font-size:13px;padding:6px 10px;border-radius:8px;transition:color .2s;}
.footer-links a:hover{color:var(--text-2);}
.footer-copy{display:flex;align-items:center;justify-content:space-between;color:var(--muted);font-size:12px;font-family:var(--font-mono);letter-spacing:-.005em;}
@media(max-width:600px){.footer-inner{flex-direction:column;align-items:flex-start;}.footer-copy{flex-direction:column;gap:4px;align-items:flex-start;}}
`

const Chk = () => (
  <svg className="chk-icon" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const Crs = () => (
  <svg className="crs-icon" viewBox="0 0 16 16" fill="none">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const faqItems = [
  {
    q: 'Existe taxa de adesão ou contrato de fidelidade?',
    a: 'Não. Nenhuma taxa de ativação, nenhuma multa, nenhum contrato. Você começa hoje e cancela quando quiser — sem burocracia.'
  },
  {
    q: 'O que acontece se eu cancelar no meio do mês?',
    a: 'Você continua com acesso até o fim do período já pago. Não fazemos cobrança proporcional nem reembolsamos dias restantes. Simples assim.'
  },
  {
    q: 'Posso mudar de plano depois?',
    a: 'Sim, a qualquer momento. Upgrades têm efeito imediato (com desconto proporcional). Downgrades entram em vigor no próximo ciclo de cobrança.'
  },
  {
    q: 'O desconto anual vale para qualquer plano?',
    a: 'Sim. Ao escolher o faturamento anual, você economiza 20% em qualquer um dos três planos. O valor é cobrado uma vez ao ano, sem custo adicional.'
  },
  {
    q: 'O que está incluído no onboarding dedicado do Business?',
    a: 'Nossa equipe configura tudo para você: integra o WhatsApp, ajusta os horários da barbearia, personaliza as respostas do agente e faz uma sessão de testes. A barbearia fica pronta em até 24h após a contratação.'
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Cartão de crédito, Pix e boleto bancário. Pagamentos anuais também aceitam transferência bancária. O ambiente é 100% seguro e certificado.'
  },
  {
    q: 'Posso usar em mais de uma barbearia?',
    a: 'Cada assinatura cobre uma unidade. Se você tem múltiplas unidades, entre em contato pelo WhatsApp — temos condições especiais para redes e franquias.'
  },
]

const compareCategories = [
  {
    cat: 'WhatsApp & Agendamento',
    rows: [
      { feat: 'Agente IA no WhatsApp', s: true, p: true, b: true },
      { feat: 'Agendamento automático', s: true, p: true, b: true },
      { feat: 'Verificação de disponibilidade em tempo real', s: true, p: true, b: true },
      { feat: 'Confirmação automática por mensagem', s: true, p: true, b: true },
      { feat: 'Lembretes de agendamento', s: false, p: true, b: true },
      { feat: 'Cancelamento e remarcação pelo WhatsApp', s: true, p: true, b: true },
      { feat: 'Respostas fora do horário de funcionamento', s: false, p: true, b: true },
    ]
  },
  {
    cat: 'Gestão & Painel',
    rows: [
      { feat: 'Painel de controle', s: false, p: true, b: true },
      { feat: 'Histórico completo de agendamentos', s: false, p: true, b: true },
      { feat: 'Relatórios de desempenho', s: false, p: false, b: true },
      { feat: 'Exportação de dados (CSV)', s: false, p: false, b: true },
      { feat: 'Número de barbeiros', sv: '1', pv: '3', bv: 'Ilimitado' },
    ]
  },
  {
    cat: 'Suporte & Onboarding',
    rows: [
      { feat: 'Configuração self-service', s: true, p: true, b: true },
      { feat: 'Suporte por e-mail', s: true, p: true, b: true },
      { feat: 'Suporte prioritário por WhatsApp', s: false, p: false, b: true },
      { feat: 'Onboarding dedicado', s: false, p: false, b: true },
      { feat: 'Configuração completa do agente', s: false, p: false, b: true },
      { feat: 'Ativação em até 24h', s: false, p: false, b: true },
    ]
  },
]

function PrecosInner() {
  const searchParams = useSearchParams()
  const barbershopId = searchParams.get('barbershop_id') || ''
  const planLink = (plano: string) => barbershopId
    ? `/pagamento?plano=${plano}&barbershop_id=${barbershopId}`
    : `/cadastro?plano=${plano}`

  const [billing, setBilling] = useState<'m'|'a'>('m')
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const [leads, setLeads] = useState(30)
  const progressRef = useRef<HTMLDivElement>(null)

  // Prices
  const prices = {
    starter: billing === 'm' ? 197 : 158,
    pro:     billing === 'm' ? 397 : 318,
    biz:     billing === 'm' ? 697 : 558,
  }
  const savings = {
    starter: billing === 'a' ? 'Economize R$468/ano' : '',
    pro:     billing === 'a' ? 'Economize R$948/ano' : '',
    biz:     billing === 'a' ? 'Economize R$1.668/ano' : '',
  }

  // ROI calc
  const ticket = 60
  const recoveryRate = 0.65
  const recovered = Math.round(leads * recoveryRate)
  const revenue = recovered * ticket
  const planCost = prices.pro

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const el = progressRef.current
      if (!el) return
      const h = document.documentElement.scrollHeight - window.innerHeight
      el.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // fade-up observer
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up')
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          el.style.animationDelay = `${(Number(el.dataset.delay) || 0) * 0.08}s`
          el.classList.add('visible')
          obs.unobserve(el)
        }
      })
    }, { threshold: 0.08 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <div ref={progressRef} className="scroll-bar" />

      {/* NAV */}
      <nav>
        <a href="/" className="logo">
          <span className="logo-mark">a</span>
          attende<span style={{color:'var(--muted)',fontWeight:400}}>.ai</span>
        </a>
        <ul className="nav-links">
          <li><a href="/#como-funciona">Como funciona</a></li>
          <li><a href="/#demo">Demonstração</a></li>
          <li><a href="/precos" className="nav-active">Preços</a></li>
          <li><a href="/#faq">Dúvidas</a></li>
        </ul>
        <div className="nav-right">
          <a href="/login" className="nav-login-link">Entrar</a>
          <a href="/cadastro" className="nav-cta">
            Começar grátis
            <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="ph-hero">
        <div className="ph-hero-bg" />
        <div className="ph-hero-grid" />
        <div className="wrap">
          <div className="eyebrow fade-up">Planos e preços</div>
          <h1 className="fade-up" data-delay="1">
            Simples, transparente.<br/>
            <em>Sem surpresas.</em>
          </h1>
          <p className="ph-hero-sub fade-up" data-delay="2">
            Escolha o plano certo para sua barbearia. Sem taxa de adesão, sem fidelidade. Cancele quando quiser.
          </p>
          <div className="billing-toggle fade-up" data-delay="3">
            <button className={billing === 'm' ? 'active' : ''} onClick={() => setBilling('m')}>
              Mensal
            </button>
            <button className={billing === 'a' ? 'active' : ''} onClick={() => setBilling('a')}>
              Anual <span className="save-tag">-20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* PLAN CARDS */}
      <section className="ph-plans">
        <div className="wrap">
          <div className="plans-grid">

            {/* STARTER */}
            <div className="plan-card fade-up" data-delay="0">
              <div className="plan-name-label">Starter</div>
              <div className="plan-price-row">
                <span className="plan-cur">R$</span>
                <span className="plan-amt">{prices.starter}</span>
              </div>
              <div className="plan-per">por mês{billing === 'a' ? ' · faturado anualmente' : ''}</div>
              <div className="plan-saving">{savings.starter}</div>
              <p className="plan-desc">Ideal para barbearias que querem automatizar o agendamento pelo WhatsApp sem complicação.</p>
              <ul className="plan-feats">
                <li><Chk /><span>Agente IA no WhatsApp</span></li>
                <li><Chk /><span>Agendamento automático</span></li>
                <li><Chk /><span>Verificação de disponibilidade em tempo real</span></li>
                <li><Chk /><span>Confirmação automática por mensagem</span></li>
                <li><Chk /><span>Cancelamento e remarcação pelo WhatsApp</span></li>
                <li><Chk /><span>1 número de WhatsApp · 1 barbeiro</span></li>
                <li className="dim"><Crs /><span>Lembretes automáticos</span></li>
                <li className="dim"><Crs /><span>Painel de gestão</span></li>
              </ul>
              <a href={planLink('starter')} className="btn-plan outline">
                Começar agora
                <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>

            {/* PRO */}
            <div className="plan-card featured fade-up" data-delay="1">
              <div className="plan-badge">Mais popular</div>
              <div className="plan-name-label">Pro</div>
              <div className="plan-price-row">
                <span className="plan-cur">R$</span>
                <span className="plan-amt">{prices.pro}</span>
              </div>
              <div className="plan-per">por mês{billing === 'a' ? ' · faturado anualmente' : ''}</div>
              <div className="plan-saving">{savings.pro}</div>
              <p className="plan-desc">Para barbearias que querem automação completa com visibilidade total do negócio.</p>
              <ul className="plan-feats">
                <li><Chk /><span>Tudo do Starter</span></li>
                <li><Chk /><span>Lembretes automáticos de agendamento</span></li>
                <li><Chk /><span>Respostas fora do horário</span></li>
                <li><Chk /><span>Painel de gestão completo</span></li>
                <li><Chk /><span>Histórico de agendamentos</span></li>
                <li><Chk /><span>Até 3 barbeiros</span></li>
                <li><Chk /><span>Suporte por e-mail</span></li>
                <li className="dim"><Crs /><span>Relatórios e exportação</span></li>
              </ul>
              <a href={planLink('pro')} className="btn-plan filled">
                Começar agora
                <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>

            {/* BUSINESS */}
            <div className="plan-card fade-up" data-delay="2">
              <div className="plan-name-label">Business</div>
              <div className="plan-price-row">
                <span className="plan-cur">R$</span>
                <span className="plan-amt">{prices.biz}</span>
              </div>
              <div className="plan-per">por mês{billing === 'a' ? ' · faturado anualmente' : ''}</div>
              <div className="plan-saving">{savings.biz}</div>
              <p className="plan-desc">Para quem quer começar sem complicação — nossa equipe configura tudo para você em até 24h.</p>
              <ul className="plan-feats">
                <li><Chk /><span>Tudo do Pro</span></li>
                <li><Chk /><span>Barbeiros ilimitados</span></li>
                <li><Chk /><span>Relatórios de desempenho</span></li>
                <li><Chk /><span>Exportação de dados (CSV)</span></li>
                <li><Chk /><span>Onboarding dedicado</span></li>
                <li><Chk /><span>Configuração completa do agente</span></li>
                <li><Chk /><span>Suporte prioritário por WhatsApp</span></li>
                <li><Chk /><span>Ativação em até 24h</span></li>
              </ul>
              <a href={planLink('business')} className="btn-plan outline">
                Começar agora
                <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>

          {/* foot */}
          <div style={{textAlign:'center',marginTop:28,fontSize:'12.5px',color:'var(--muted)',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2"/></svg>
            Pagamento 100% seguro · Cartão, Pix ou boleto
          </div>
        </div>
      </section>

      {/* TRUST BAND */}
      <div className="trust-band">
        <div className="wrap">
          <div className="trust-items">
            <div className="trust-item">
              <svg viewBox="0 0 16 16" fill="none"><path d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" stroke="currentColor" strokeWidth="1.2"/></svg>
              Sem taxa de adesão
            </div>
            <div className="trust-item">
              <svg viewBox="0 0 16 16" fill="none"><path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/></svg>
              Cancele quando quiser
            </div>
            <div className="trust-item">
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Ativação em minutos
            </div>
            <div className="trust-item">
              <svg viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2"/></svg>
              Dados seguros e criptografados
            </div>
            <div className="trust-item">
              <svg viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Sem fidelidade
            </div>
          </div>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <section className="ph-compare">
        <div className="wrap">
          <div className="section-head center fade-up">
            <div className="eyebrow">Comparativo</div>
            <h2 className="section-title">O que está em cada plano</h2>
            <p className="section-sub">Compare todas as funcionalidades e escolha o que faz sentido para o tamanho da sua operação.</p>
          </div>
          <div className="compare-table-wrap fade-up">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{width:'40%'}}>Funcionalidade</th>
                  <th>Starter<br/><span style={{fontFamily:'var(--font-sans)',fontSize:'12px',fontWeight:400,color:'var(--text-2)',letterSpacing:0}}>R${prices.starter}/mês</span></th>
                  <th className="th-featured">Pro<br/><span style={{fontFamily:'var(--font-sans)',fontSize:'12px',fontWeight:400,letterSpacing:0}}>R${prices.pro}/mês</span></th>
                  <th>Business<br/><span style={{fontFamily:'var(--font-sans)',fontSize:'12px',fontWeight:400,color:'var(--text-2)',letterSpacing:0}}>R${prices.biz}/mês</span></th>
                </tr>
              </thead>
              <tbody>
                {compareCategories.map(cat => (
                  <>
                    <tr className="cat-row" key={cat.cat}>
                      <td colSpan={4}>{cat.cat}</td>
                    </tr>
                    {cat.rows.map(row => (
                      <tr key={row.feat}>
                        <td className="col-feat">{row.feat}</td>
                        <td>
                          {'sv' in row
                            ? <span className={'val-tag' + (row.sv === 'Ilimitado' ? ' accent' : '')}>{row.sv}</span>
                            : row.s ? <Chk /> : <Crs />}
                        </td>
                        <td>
                          {'pv' in row
                            ? <span className={'val-tag' + (row.pv === 'Ilimitado' ? ' accent' : '')}>{row.pv}</span>
                            : row.p ? <Chk /> : <Crs />}
                        </td>
                        <td>
                          {'bv' in row
                            ? <span className="val-tag accent">{row.bv}</span>
                            : row.b ? <Chk /> : <Crs />}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ROI SECTION */}
      <section className="ph-roi">
        <div className="wrap">
          <div className="roi-grid">
            <div className="roi-copy fade-up">
              <div className="eyebrow">Retorno sobre investimento</div>
              <h2>Calcule quanto você está perdendo hoje</h2>
              <p>Cada mensagem sem resposta é um agendamento perdido. Quantas vezes por mês você deixa um cliente esperando?</p>
              <p className="roi-note">* Cálculo estimado com taxa de recuperação de 65% e ticket médio de R$60.</p>
            </div>
            <div className="roi-calc fade-up" data-delay="1">
              <div className="roi-label">Clientes que ficam sem resposta por mês: <strong style={{color:'var(--text)'}}>{leads}</strong></div>
              <input
                type="range" className="roi-range"
                min={5} max={150} value={leads}
                onChange={e => setLeads(Number(e.target.value))}
              />
              <div className="roi-result">
                <div className="roi-metric">
                  <div className="rm-val">{recovered}</div>
                  <div className="rm-label">agendamentos recuperados/mês</div>
                </div>
                <div className="roi-metric">
                  <div className="rm-val">R${revenue.toLocaleString('pt-BR')}</div>
                  <div className="rm-label">receita recuperada/mês</div>
                </div>
                <div className="roi-metric" style={{gridColumn:'1 / -1',background:'var(--accent-soft)',border:'1px solid var(--accent-line)'}}>
                  <div className="rm-val" style={{fontSize:'32px'}}>
                    {revenue > planCost
                      ? `${Math.round(revenue / planCost)}×`
                      : '< 1×'}
                  </div>
                  <div className="rm-label">retorno sobre o investimento no plano Pro (R${planCost}/mês)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ph-faq">
        <div className="wrap">
          <div className="section-head center fade-up">
            <div className="eyebrow">Dúvidas sobre preços</div>
            <h2 className="section-title">Respostas diretas</h2>
          </div>
          <div className="faq-wrap">
            {faqItems.map((item, i) => (
              <div key={i} className="faq-item fade-up" data-delay={i} data-open={openFaq === i ? 'true' : undefined}>
                <button type="button" className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {item.q}
                  <span className="faq-arrow">
                    <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </span>
                </button>
                <div className="faq-a"><div className="faq-a-inner"><p>{item.a}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <div className="cta-bg" />
        <div className="wrap">
          <div className="eyebrow fade-up">Pronto para começar?</div>
          <h2 className="fade-up" data-delay="1">Seu agente está<br/>pronto em minutos.</h2>
          <p className="fade-up" data-delay="2">Nenhum cartão de crédito necessário para testar. Configure sua barbearia e veja o agente funcionando antes de assinar.</p>
          <div className="cta-actions fade-up" data-delay="3">
            <a href="/cadastro" className="btn btn-primary">
              <svg viewBox="0 0 16 16" fill="none"><path d="M8 2C5.2 2 3 4.2 3 7c0 1.8.9 3.4 2.3 4.4L5 14h6l-.3-2.6C12.1 10.4 13 8.8 13 7c0-2.8-2.2-5-5-5z" stroke="currentColor" strokeWidth="1.3"/></svg>
              Criar conta grátis
            </a>
            <a href="https://wa.me/5534980799965?text=Quero%20saber%20mais%20sobre%20os%20planos%20do%20AttendeAI" className="btn btn-ghost">
              <svg viewBox="0 0 16 16" fill="none"><path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              Falar com especialista
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="footer-inner">
            <div className="logo" style={{fontSize:'16px'}}>
              <span className="logo-mark">a</span>
              attende<span style={{color:'var(--muted)',fontWeight:400}}>.ai</span>
            </div>
            <div className="footer-links">
              <a href="/">Barbearia</a>
              <a href="/clinicas">Clínicas</a>
              <a href="/sdr">SDR</a>
              <a href="/precos">Preços</a>
              <a href="#">Termos</a>
              <a href="#">Privacidade</a>
              <a href="https://wa.me/5534980799965">Suporte</a>
            </div>
          </div>
          <div className="wrap footer-copy">
            <span>© 2026 AttendeAI</span>
            <span>feito no brasil 🇧🇷</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default function PrecosPage() {
  return <Suspense><PrecosInner /></Suspense>
}
