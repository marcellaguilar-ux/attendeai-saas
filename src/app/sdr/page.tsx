'use client'
import { useEffect, useState } from 'react'

const CSS = `

/* ═══════════════════════════ TOKENS ═══════════════════════════ */
:root {
  --bg: #0a0d10;
  --bg-elev: #0f1316;
  --surface: #13181c;
  --surface-2: #181e23;
  --border: #1d2429;
  --border-strong: #2a343c;
  --text: #e9eef3;
  --text-2: #aab4bd;
  --muted: #6c7884;
  --accent: #00e5a0;
  --accent-ink: #000;
  --accent-soft: rgba(0,229,160,0.08);
  --accent-line: rgba(0,229,160,0.22);
  --danger: #ff6079;
  --warn: #f59e0b;
  --info: #5b9cff;
  --font-sans: 'Geist','Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  --font-mono: 'Geist Mono','SF Mono',Menlo,monospace;
  --font-display: 'Geist',sans-serif;
  --container: 1200px;
  --r-sm: 8px; --r-md: 12px; --r-lg: 18px; --r-xl: 24px;
  color-scheme: dark;
}

/* ═══════════════════════════ RESET ═══════════════════════════ */
* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
body {
  background:var(--bg); color:var(--text); font-family:var(--font-sans);
  font-weight:400; font-feature-settings:"ss01","cv11"; font-size:15px;
  line-height:1.5; letter-spacing:-0.005em; overflow-x:hidden;
}
a { color:inherit; text-decoration:none; }
button { font-family:inherit; }
::selection { background:var(--accent); color:var(--accent-ink); }

body::before {
  content:''; position:fixed; inset:0; z-index:9999; pointer-events:none; opacity:.35;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ═══════════════════════════ LAYOUT ═══════════════════════════ */
.wrap { max-width:var(--container); margin:0 auto; padding:0 32px; }
@media (max-width:700px) { .wrap { padding:0 20px; } }
section { padding:120px 0; position:relative; }
@media (max-width:700px) { section { padding:72px 0; } }
.section-head { max-width:640px; margin-bottom:72px; }
.section-head.center { margin-left:auto; margin-right:auto; text-align:center; }

/* ═══════════════════════════ TYPE ═══════════════════════════ */
h1,h2,h3,h4 { font-family:var(--font-display); font-weight:600; letter-spacing:-0.025em; line-height:1.05; }

.eyebrow {
  font-family:var(--font-mono); font-size:11px; font-weight:500; letter-spacing:0.08em;
  text-transform:uppercase; color:var(--muted); display:inline-flex; align-items:center; gap:8px; margin-bottom:20px;
}
.eyebrow::before { content:''; width:14px; height:1px; background:var(--accent); }
.section-head.center .eyebrow { justify-content:center; }

.section-title {
  font-size:clamp(2rem,4vw,3.2rem); font-weight:500; letter-spacing:-0.035em;
  line-height:1.02; margin-bottom:20px; text-wrap:balance;
}
.section-title em { font-family:'Instrument Serif',serif; font-style:italic; font-weight:400; color:var(--accent); letter-spacing:-0.02em; }
.section-sub { color:var(--text-2); font-size:17px; line-height:1.55; font-weight:400; letter-spacing:-0.01em; max-width:520px; }
.section-head.center .section-sub { margin:0 auto; }

/* ═══════════════════════════ NAV ═══════════════════════════ */
nav {
  position:fixed; top:16px; left:50%; transform:translateX(-50%); z-index:200;
  width:calc(100% - 32px); max-width:calc(var(--container) - 64px);
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 10px 10px 20px;
  background:color-mix(in oklab, var(--bg-elev) 80%, transparent);
  backdrop-filter:blur(20px) saturate(1.4); -webkit-backdrop-filter:blur(20px) saturate(1.4);
  border:1px solid var(--border); border-radius:100px; transition:background .3s, border-color .3s, box-shadow .3s;
}
nav.scrolled {
  background:color-mix(in oklab, var(--bg) 88%, transparent);
  border-color:var(--border-strong);
  box-shadow:0 4px 32px rgba(0,0,0,.4), 0 1px 0 var(--border-strong);
}
.logo { font-family:var(--font-display); font-weight:600; font-size:16px; letter-spacing:-0.02em; display:flex; align-items:center; gap:8px; }
.logo-mark { width:20px; height:20px; border-radius:6px; background:var(--accent); display:grid; place-items:center; color:var(--accent-ink); font-weight:800; font-size:12px; }
.logo-sdr { font-family:var(--font-mono); font-size:11px; font-weight:600; letter-spacing:0.06em; background:var(--accent-soft); border:1px solid var(--accent-line); color:var(--accent); padding:3px 8px; border-radius:6px; text-transform:uppercase; }
.nav-links { display:flex; gap:4px; list-style:none; }
.nav-links a { color:var(--text-2); font-size:13.5px; padding:8px 14px; border-radius:100px; transition:color .2s, background .2s; position:relative; overflow:hidden; }
.nav-links a:hover { color:var(--text); background:var(--surface-2); }
.nav-links a.nav-active { color:var(--accent); background:var(--accent-soft); }
.nav-links a::after { content:''; position:absolute; bottom:5px; left:14px; right:14px; height:1px; background:var(--accent); transform:scaleX(0); transform-origin:right; transition:transform .22s ease; }
.nav-links a:hover::after, .nav-links a.nav-active::after { transform:scaleX(1); transform-origin:left; }
.nav-right { display:flex; align-items:center; gap:6px; }
.nav-cta {
  background:var(--accent); color:var(--accent-ink); padding:9px 18px; border-radius:100px;
  font-size:13.5px; font-weight:500; transition:all .2s; display:inline-flex; align-items:center; gap:6px; white-space:nowrap;
}
.nav-cta:hover { filter:brightness(1.08); transform:translateY(-1px); }
.nav-login { color:var(--text-2); font-size:13.5px; padding:9px 14px; border-radius:100px; transition:all .2s; }
.nav-login:hover { color:var(--text); background:var(--surface-2); }
@media (max-width:860px) { .nav-links { display:none; } nav { padding:8px 8px 8px 16px; } }

/* ═══════════════════════════ SCROLL BAR ═══════════════════════════ */
.scroll-bar {
  position:fixed; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,var(--accent),color-mix(in oklab, var(--accent) 60%, #5b9cff));
  z-index:300; transform-origin:left; transform:scaleX(0); will-change:transform; pointer-events:none;
}

/* ═══════════════════════════ BUTTONS ═══════════════════════════ */
.btn { display:inline-flex; align-items:center; gap:8px; padding:12px 22px; border-radius:10px; font-size:14.5px; font-weight:500; cursor:pointer; border:none; transition:all .2s; font-family:inherit; text-decoration:none; }
.btn svg { width:16px; height:16px; flex-shrink:0; }
.btn-primary {
  background:var(--accent); color:var(--accent-ink);
  box-shadow:0 0 0 1px color-mix(in oklab, var(--accent) 30%, transparent), 0 8px 24px -8px color-mix(in oklab, var(--accent) 40%, transparent);
}
.btn-primary:hover { filter:brightness(1.08); transform:translateY(-1px); box-shadow:0 0 0 1px color-mix(in oklab, var(--accent) 40%, transparent), 0 14px 32px -8px color-mix(in oklab, var(--accent) 55%, transparent); }
.btn-ghost { background:transparent; color:var(--text); border:1px solid var(--border-strong); }
.btn-ghost:hover { border-color:var(--text-2); background:var(--surface); }
.btn-plan {
  display:flex; align-items:center; justify-content:center; gap:6px;
  width:100%; padding:12px 18px; border-radius:10px; font-size:14px; font-weight:500;
  cursor:pointer; font-family:inherit; text-decoration:none; transition:all .2s; border:1px solid var(--border-strong);
}
.btn-plan svg { width:14px; height:14px; }
.btn-plan.outline { background:transparent; color:var(--text); }
.btn-plan.outline:hover { border-color:var(--accent-line); color:var(--accent); background:var(--accent-soft); }
.btn-plan.filled { background:var(--accent); color:var(--accent-ink); border-color:var(--accent); box-shadow:0 4px 16px -4px color-mix(in oklab, var(--accent) 40%, transparent); }
.btn-plan.filled:hover { filter:brightness(1.08); transform:translateY(-1px); }

/* ═══════════════════════════ HERO ═══════════════════════════ */
.hero { padding-top:160px; padding-bottom:80px; position:relative; overflow:hidden; }
@media (max-width:700px) { .hero { padding-top:120px; padding-bottom:60px; } }
.hero-bg {
  position:absolute; inset:0; z-index:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 60% at 60% 30%, color-mix(in oklab, var(--accent) 7%, transparent) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 80%, color-mix(in oklab, var(--info) 8%, transparent) 0%, transparent 55%);
}
.hero-grid {
  position:absolute; inset:0; z-index:0; pointer-events:none;
  background-image:linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size:64px 64px;
  mask-image:radial-gradient(ellipse at 50% 20%, black 10%, transparent 65%);
  -webkit-mask-image:radial-gradient(ellipse at 50% 20%, black 10%, transparent 65%);
  opacity:.6;
}
.hero .wrap { position:relative; z-index:1; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
@media (max-width:960px) { .hero .wrap { grid-template-columns:1fr; } }
.hero-content { max-width:560px; }
@media (max-width:960px) { .hero-content { max-width:100%; } }

.hero-pill {
  display:inline-flex; align-items:center; gap:10px; padding:6px 14px 6px 6px;
  background:var(--surface); border:1px solid var(--border); border-radius:100px;
  font-size:12.5px; color:var(--text-2); margin-bottom:28px;
}
.hero-pill .tag { background:var(--accent-soft); color:var(--accent); border:1px solid var(--accent-line); padding:3px 10px; border-radius:100px; font-family:var(--font-mono); font-size:10.5px; font-weight:500; letter-spacing:0.02em; text-transform:uppercase; }
.hero-pill .dot { width:6px; height:6px; border-radius:50%; background:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); animation:dotPulse 2s infinite; }
@keyframes dotPulse { 0%,100% { box-shadow:0 0 0 3px var(--accent-soft); } 50% { box-shadow:0 0 0 6px transparent; } }

h1.hero-title { font-size:clamp(2.4rem,4.5vw,3.8rem); font-weight:500; letter-spacing:-0.04em; line-height:0.98; margin-bottom:24px; text-wrap:balance; }
h1.hero-title em { font-family:'Instrument Serif',serif; font-style:italic; font-weight:400; color:var(--accent); letter-spacing:-0.02em; }
.hero-sub { font-size:17px; color:var(--text-2); line-height:1.6; max-width:480px; letter-spacing:-0.008em; margin-bottom:36px; }
.hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:48px; }
.hero-trust { display:flex; gap:32px; flex-wrap:wrap; padding-top:36px; border-top:1px solid var(--border); }
.trust-item { }
.trust-item .k { font-family:var(--font-display); font-size:26px; font-weight:500; letter-spacing:-0.03em; line-height:1; }
.trust-item .k .accent { color:var(--accent); }
.trust-item .v { font-size:12px; color:var(--muted); margin-top:5px; font-family:var(--font-mono); letter-spacing:0.02em; }

/* HERO VISUAL — SDR DASHBOARD */
.hero-visual { position:relative; }
@media (max-width:960px) { .hero-visual { display:none; } }
.sdr-dash {
  background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl);
  overflow:hidden; box-shadow:0 32px 80px -20px rgba(0,0,0,.6), 0 0 0 1px var(--border);
  animation:heroFloat 7s ease-in-out infinite;
}
@keyframes heroFloat {
  0%,100% { transform:translateY(0) rotate(0deg); }
  40% { transform:translateY(-10px) rotate(0.3deg); }
  70% { transform:translateY(-5px) rotate(-0.2deg); }
}
.sdr-dash-head {
  padding:14px 20px; border-bottom:1px solid var(--border);
  display:flex; align-items:center; justify-content:space-between;
}
.sdr-dash-title { font-size:12px; font-weight:600; color:var(--text-2); font-family:var(--font-mono); letter-spacing:0.04em; text-transform:uppercase; }
.sdr-dash-badge { background:var(--accent-soft); border:1px solid var(--accent-line); color:var(--accent); font-size:10px; font-family:var(--font-mono); padding:3px 10px; border-radius:100px; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; display:flex; align-items:center; gap:6px; }
.sdr-dash-badge .dot { width:5px; height:5px; border-radius:50%; background:var(--accent); animation:dotPulse 2s infinite; }
.sdr-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:0; border-bottom:1px solid var(--border); }
.sdr-stat { padding:16px 20px; border-right:1px solid var(--border); }
.sdr-stat:last-child { border-right:none; }
.sdr-stat .s-n { font-size:22px; font-weight:600; letter-spacing:-0.03em; color:var(--text); }
.sdr-stat .s-n span { color:var(--accent); }
.sdr-stat .s-l { font-size:11px; color:var(--muted); font-family:var(--font-mono); letter-spacing:0.02em; margin-top:3px; }
.sdr-leads { padding:12px 0; }
.sdr-lead { display:flex; align-items:center; gap:12px; padding:10px 20px; transition:background .2s; }
.sdr-lead:hover { background:var(--surface-2); }
.sdr-lead-av { width:30px; height:30px; border-radius:50%; background:var(--surface-2); border:1px solid var(--border); display:grid; place-items:center; font-size:11px; font-weight:600; color:var(--text-2); flex-shrink:0; }
.sdr-lead-info { flex:1; min-width:0; }
.sdr-lead-name { font-size:13px; font-weight:500; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sdr-lead-co { font-size:11px; color:var(--muted); font-family:var(--font-mono); }
.sdr-chip { font-size:10px; font-weight:600; padding:3px 9px; border-radius:100px; font-family:var(--font-mono); letter-spacing:0.03em; flex-shrink:0; }
.sdr-chip.hot { background:color-mix(in oklab,var(--accent) 15%, transparent); border:1px solid var(--accent-line); color:var(--accent); }
.sdr-chip.warm { background:color-mix(in oklab,var(--warn) 12%, transparent); border:1px solid color-mix(in oklab,var(--warn) 30%, transparent); color:var(--warn); }
.sdr-chip.cold { background:var(--surface-2); border:1px solid var(--border); color:var(--muted); }
.sdr-chip.new { background:color-mix(in oklab,var(--info) 12%, transparent); border:1px solid color-mix(in oklab,var(--info) 30%, transparent); color:var(--info); }
.sdr-foot { padding:12px 20px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
.sdr-foot-text { font-size:11px; color:var(--muted); font-family:var(--font-mono); }
.sdr-foot-bar { flex:1; margin:0 16px; height:3px; background:var(--surface-2); border-radius:2px; overflow:hidden; }
.sdr-foot-bar-fill { height:100%; width:68%; background:var(--accent); border-radius:2px; }

/* ═══════════════════════════ LOGOS ═══════════════════════════ */
.logos-section { padding:32px 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
.logos-label { font-size:12px; color:var(--muted); font-family:var(--font-mono); letter-spacing:0.06em; text-transform:uppercase; margin-bottom:20px; text-align:center; }
.logos-row { display:flex; align-items:center; justify-content:center; gap:32px; flex-wrap:wrap; }
.logo-item { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text-2); font-weight:500; }
.logo-item svg { width:18px; height:18px; color:var(--muted); }

/* ═══════════════════════════ PAIN ═══════════════════════════ */
.pain-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
@media (max-width:900px) { .pain-grid { grid-template-columns:1fr; } }
.pain-card {
  background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg);
  padding:32px 28px; position:relative; overflow:hidden; transition:border-color .3s, transform .3s;
}
.pain-card:hover { border-color:var(--border-strong); transform:translateY(-3px); }
.pain-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, var(--danger), transparent); opacity:0; transition:opacity .3s; }
.pain-card:hover::before { opacity:1; }
.pain-ico { width:44px; height:44px; border-radius:10px; background:color-mix(in oklab, var(--danger) 10%, transparent); border:1px solid color-mix(in oklab, var(--danger) 25%, transparent); display:grid; place-items:center; color:var(--danger); margin-bottom:20px; transition:transform .3s cubic-bezier(.16,1,.3,1); }
.pain-card:hover .pain-ico { transform:scale(1.1) rotate(-6deg); }
.pain-ico svg { width:20px; height:20px; }
.pain-card h3 { font-size:17px; font-weight:500; letter-spacing:-0.02em; margin-bottom:10px; }
.pain-card p { font-size:14px; color:var(--text-2); line-height:1.55; }
.pain-stat { margin-top:16px; font-size:13px; font-family:var(--font-mono); color:var(--danger); background:color-mix(in oklab, var(--danger) 8%, transparent); border:1px solid color-mix(in oklab, var(--danger) 20%, transparent); padding:6px 12px; border-radius:8px; display:inline-block; letter-spacing:0.01em; }

/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */
.steps { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
@media (max-width:1000px) { .steps { grid-template-columns:1fr 1fr; } }
@media (max-width:560px) { .steps { grid-template-columns:1fr; } }
.step {
  background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg);
  padding:28px 24px; position:relative; transition:border-color .3s, transform .3s cubic-bezier(.16,1,.3,1);
}
.step:hover { border-color:var(--border-strong); }
.step-num { font-family:var(--font-mono); font-size:10px; color:var(--accent); background:var(--accent-soft); border:1px solid var(--accent-line); padding:4px 10px; border-radius:6px; display:inline-block; margin-bottom:20px; letter-spacing:0.04em; font-weight:600; }
.step-ico { width:40px; height:40px; border-radius:10px; background:var(--accent-soft); border:1px solid var(--accent-line); display:grid; place-items:center; color:var(--accent); margin-bottom:16px; transition:transform .35s cubic-bezier(.16,1,.3,1), background .3s, box-shadow .3s; }
.step-ico svg { width:18px; height:18px; }
.step:hover .step-ico { transform:scale(1.15) translateY(-3px); background:color-mix(in oklab,var(--accent) 24%, transparent); box-shadow:0 10px 24px color-mix(in oklab,var(--accent) 22%, transparent); }
.step h3 { font-size:15px; font-weight:500; letter-spacing:-0.02em; margin-bottom:8px; }
.step p { font-size:13.5px; color:var(--text-2); line-height:1.55; }

/* ═══════════════════════════ DEMO ═══════════════════════════ */
.demo-container { display:grid; grid-template-columns:340px 1fr; gap:40px; align-items:start; }
@media (max-width:860px) { .demo-container { grid-template-columns:1fr; } }
.demo-phone {
  background:#111b21; border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 24px 60px -15px rgba(0,0,0,.7); border:1px solid #2a3942;
  max-width:340px; margin:0 auto; width:100%;
}
.demo-chat-header { background:#202c33; padding:12px 16px; display:flex; align-items:center; gap:10px; }
.demo-avatar { width:38px; height:38px; border-radius:50%; background:var(--accent-soft); border:1px solid var(--accent-line); display:grid; place-items:center; font-size:14px; font-weight:700; color:var(--accent); flex-shrink:0; }
.demo-header-name { font-size:14px; font-weight:600; color:#e9edef; }
.demo-header-status { font-size:12px; color:#8696a0; }
.demo-header-status.online { color:var(--accent); }
.demo-chat-body {
  background:#0b141a; padding:16px 12px; min-height:380px; max-height:380px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;
  scrollbar-width:thin; scrollbar-color: #2a3942 transparent;
}
.demo-msg { max-width:75%; padding:8px 12px; border-radius:12px; font-size:13.5px; line-height:1.45; position:relative; word-break:break-word; }
.demo-msg.sent { background:#005c4b; color:#e9edef; border-radius:12px 12px 2px 12px; align-self:flex-end; }
.demo-msg.received { background:#202c33; color:#e9edef; border-radius:12px 12px 12px 2px; align-self:flex-start; }
.dm-time { display:block; font-size:10px; color:#8696a0; margin-top:3px; text-align:right; }
.dm-check { color:var(--accent); font-size:10px; }
.demo-typing { display:flex; align-items:center; gap:4px; padding:10px 14px; background:#202c33; border-radius:12px 12px 12px 2px; align-self:flex-start; width:60px; opacity:0; transition:opacity .3s; }
.demo-typing.visible { opacity:1; }
.demo-typing-dot { width:7px; height:7px; border-radius:50%; background:#8696a0; animation:typingBounce 1.4s ease-in-out infinite; }
.demo-typing-dot:nth-child(2) { animation-delay:.2s; }
.demo-typing-dot:nth-child(3) { animation-delay:.4s; }
@keyframes typingBounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-5px); } }
.demo-date { text-align:center; margin:4px 0; }
.demo-date span { background:#182229; color:#8696a0; font-size:11px; padding:3px 10px; border-radius:6px; }
.demo-input-bar { background:#202c33; padding:10px 12px; display:flex; align-items:center; gap:8px; }
.demo-input-bar input { flex:1; background:#2a3942; border:none; border-radius:20px; padding:8px 14px; color:#e9edef; font-size:13px; outline:none; }
.demo-input-bar input::placeholder { color:#8696a0; }
.demo-progress { position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--accent); transform-origin:left; transform:scaleX(0); transition:transform .4s ease; z-index:2; }
.demo-overlay {
  position:absolute; inset:0; background:rgba(0,0,0,.78); display:flex; flex-direction:column;
  align-items:center; justify-content:center; z-index:3; cursor:pointer; transition:opacity .4s;
}
.demo-overlay.hidden { opacity:0; pointer-events:none; }
.demo-overlay-title { font-size:16px; color:var(--text); font-weight:600; margin-bottom:6px; }
.demo-overlay-sub { font-size:12px; color:var(--muted); margin-bottom:20px; }
.demo-play-btn { width:56px; height:56px; border-radius:50%; background:var(--accent); border:none; color:var(--accent-ink); font-size:22px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(0,229,160,.3); transition:transform .2s; }
.demo-play-btn:hover { transform:scale(1.1); }
.demo-overlay-hint { font-size:11px; color:var(--muted); margin-top:14px; }

.demo-side { display:flex; flex-direction:column; gap:20px; padding-top:4px; }
.demo-step-card {
  background:var(--surface); border-radius:var(--r-md); padding:24px;
  border:1px solid var(--border); outline:1px solid color-mix(in oklab, var(--accent) 18%, transparent);
  min-height:100px; transition:opacity .3s;
}
.demo-step-card .ds-title { font-size:15px; font-weight:600; color:var(--accent); margin-bottom:8px; }
.demo-step-card .ds-desc { font-size:14px; color:var(--text-2); line-height:1.55; }
.demo-nav-hint { font-size:12px; color:var(--muted); }
.demo-nav-hint kbd { background:var(--surface-2); padding:2px 6px; border-radius:4px; font-size:11px; color:var(--text-2); font-family:var(--font-mono); }
.demo-restart-btn { background:transparent; border:1px solid var(--border-strong); color:var(--text-2); padding:6px 14px; border-radius:8px; font-size:12px; cursor:pointer; font-family:var(--font-mono); transition:all .2s; }
.demo-restart-btn:hover { border-color:var(--accent); color:var(--accent); }

/* ═══════════════════════════ FEATURES ═══════════════════════════ */
.features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
@media (max-width:900px) { .features-grid { grid-template-columns:1fr 1fr; } }
@media (max-width:560px) { .features-grid { grid-template-columns:1fr; } }
.feat-card {
  background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg);
  padding:28px 24px; transition:border-color .3s, transform .3s cubic-bezier(.16,1,.3,1);
}
.feat-card:hover { border-color:var(--accent-line); transform:translateY(-4px); }
.feat-ico { width:44px; height:44px; border-radius:10px; background:var(--accent-soft); border:1px solid var(--accent-line); display:grid; place-items:center; color:var(--accent); margin-bottom:20px; transition:transform .3s cubic-bezier(.16,1,.3,1), background .3s, box-shadow .3s; }
.feat-ico svg { width:20px; height:20px; }
.feat-card:hover .feat-ico { transform:translateY(-4px) scale(1.1); background:color-mix(in oklab,var(--accent) 18%, transparent); box-shadow:0 8px 24px color-mix(in oklab,var(--accent) 20%, transparent); }
.feat-card h3 { font-size:16px; font-weight:500; letter-spacing:-0.02em; margin-bottom:8px; }
.feat-card p { font-size:14px; color:var(--text-2); line-height:1.55; }

/* ═══════════════════════════ METRICS BAND ═══════════════════════════ */
.metrics-band { background:var(--surface); border-top:1px solid var(--border); border-bottom:1px solid var(--border); padding:48px 0; }
.metrics-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:0; }
@media (max-width:700px) { .metrics-grid { grid-template-columns:1fr 1fr; } }
.metric-item { padding:24px 32px; border-right:1px solid var(--border); }
.metric-item:last-child { border-right:none; }
@media (max-width:700px) { .metric-item:nth-child(2) { border-right:none; } .metric-item:nth-child(3) { border-top:1px solid var(--border); } }
.metric-n { font-size:clamp(2rem,3.5vw,2.8rem); font-weight:600; letter-spacing:-0.04em; line-height:1; color:var(--text); }
.metric-n span { color:var(--accent); }
.metric-l { font-size:13px; color:var(--text-2); margin-top:8px; line-height:1.4; }
.metric-d { font-size:11px; font-family:var(--font-mono); color:var(--accent); margin-top:4px; }

/* ═══════════════════════════ PRICING ═══════════════════════════ */
.plans { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
@media (max-width:900px) { .plans { grid-template-columns:1fr; max-width:480px; margin:0 auto; } }
.plan {
  background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl);
  padding:36px 28px; position:relative; display:flex; flex-direction:column;
  transition:transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, border-color .3s;
}
.plan:hover { transform:translateY(-5px); border-color:var(--border-strong); }
.plan.featured {
  border-color:var(--accent-line);
  box-shadow:0 0 0 1px var(--accent-line), 0 20px 60px -15px color-mix(in oklab, var(--accent) 25%, transparent);
  background:color-mix(in oklab, var(--surface) 95%, var(--accent));
}
.plan.featured:hover { transform:translateY(-7px); box-shadow:0 0 0 1px var(--accent-line), 0 32px 80px -15px color-mix(in oklab, var(--accent) 40%, transparent); }
.plan-badge { position:absolute; top:-11px; left:50%; transform:translateX(-50%); background:var(--accent); color:var(--accent-ink); font-size:10px; font-weight:700; padding:3px 14px; border-radius:100px; text-transform:uppercase; letter-spacing:0.05em; font-family:var(--font-mono); white-space:nowrap; }
.plan-name { font-size:18px; font-weight:600; letter-spacing:-0.02em; margin-bottom:4px; }
.plan-desc { font-size:13px; color:var(--muted); margin-bottom:24px; }
.plan-price { display:flex; align-items:baseline; gap:4px; margin-bottom:4px; }
.plan-currency { font-size:18px; font-weight:500; color:var(--text-2); }
.plan-amount { font-size:clamp(2.2rem,4vw,2.8rem); font-weight:600; letter-spacing:-0.04em; line-height:1; }
.plan-period { font-size:13px; color:var(--muted); margin-bottom:28px; }
.plan-feats { list-style:none; margin-bottom:32px; flex:1; display:flex; flex-direction:column; gap:8px; }
.plan-feats li { display:flex; align-items:center; gap:10px; font-size:13.5px; color:var(--text-2); }
.plan-feats .check { width:16px; height:16px; color:var(--accent); flex-shrink:0; }
.plan-feats .cross { width:16px; height:16px; color:var(--muted); flex-shrink:0; }
.plan-feats li.muted span { color:var(--muted); }
.pricing-foot { text-align:center; margin-top:32px; font-size:13px; color:var(--muted); display:flex; align-items:center; justify-content:center; gap:8px; }
.pricing-foot svg { width:14px; height:14px; }

/* ═══════════════════════════ FAQ ═══════════════════════════ */
.faq-wrap { max-width:720px; margin:0 auto; display:flex; flex-direction:column; gap:8px; }
.faq-item { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); overflow:hidden; transition:border-color .25s; }
.faq-item[data-open="true"] { border-color:var(--accent-line); }
.faq-q {
  width:100%; text-align:left; background:none; border:none; cursor:pointer; color:var(--text);
  font-size:15px; font-weight:500; padding:20px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px;
  transition:color .2s; font-family:inherit;
}
.faq-q:hover { color:var(--accent); }
.faq-item[data-open="true"] .faq-q { color:var(--accent); }
.faq-arrow { width:24px; height:24px; border-radius:6px; border:1px solid var(--border); display:grid; place-items:center; color:var(--muted); flex-shrink:0; transition:border-color .25s, color .25s, transform .35s cubic-bezier(.16,1,.3,1); }
.faq-arrow svg { width:12px; height:12px; }
.faq-item[data-open="true"] .faq-arrow { border-color:var(--accent-line); color:var(--accent); transform:rotate(45deg); }
.faq-a { display:grid; grid-template-rows:0fr; transition:grid-template-rows .38s cubic-bezier(.16,1,.3,1); }
.faq-item[data-open="true"] .faq-a { grid-template-rows:1fr; }
.faq-a-inner { min-height:0; overflow:hidden; padding-bottom:24px; padding-left:24px; padding-right:24px; font-size:14px; color:var(--text-2); line-height:1.65; }

/* ═══════════════════════════ CTA FINAL ═══════════════════════════ */
.cta-final {
  position:relative; overflow:hidden;
  background:linear-gradient(180deg, var(--bg) 0%, color-mix(in oklab, var(--bg) 96%, var(--accent)) 100%);
  border-top:1px solid var(--border);
}
.cta-final::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 80% 100% at 50% 100%, color-mix(in oklab, var(--accent) 8%, transparent) 0%, transparent 60%); pointer-events:none; }
.cta-final-inner { position:relative; z-index:1; padding:100px 32px; text-align:center; max-width:640px; margin:0 auto; }
.cta-final h2 { font-size:clamp(2rem,4vw,3rem); font-weight:500; letter-spacing:-0.035em; line-height:1.05; margin-bottom:18px; text-wrap:balance; }
.cta-final h2 em { font-family:'Instrument Serif',serif; font-style:italic; font-weight:400; color:var(--accent); }
.cta-final p { font-size:17px; color:var(--text-2); line-height:1.55; margin-bottom:36px; max-width:480px; margin-left:auto; margin-right:auto; }
.cta-final .actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.cta-cursor-glow { position:absolute; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 70%); pointer-events:none; transform:translate(-50%,-50%); opacity:0; transition:opacity .6s; }

/* ═══════════════════════════ FOOTER ═══════════════════════════ */
footer { padding:40px 0; border-top:1px solid var(--border); }
.footer-inner { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:24px; }
.footer-links { display:flex; gap:4px; flex-wrap:wrap; }
.footer-links a { font-size:13px; color:var(--muted); padding:6px 12px; border-radius:8px; transition:color .2s; }
.footer-links a:hover { color:var(--text-2); }
.footer-copy { display:flex; align-items:center; justify-content:space-between; padding-top:20px; border-top:1px solid var(--border); font-size:12px; color:var(--muted); font-family:var(--font-mono); flex-wrap:wrap; gap:8px; }

/* ═══════════════════════════ FADE UP ═══════════════════════════ */
.fade-up { opacity:0; transform:translateY(22px); transition:opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
.fade-up.visible { opacity:1; transform:translateY(0); }
.fade-up.delay-1 { transition-delay:.06s; }
.fade-up.delay-2 { transition-delay:.12s; }
.fade-up.delay-3 { transition-delay:.18s; }

/* ═══════════════════════════ STAGGER CARDS ═══════════════════════════ */
.stagger-child { opacity:0; transform:translateY(22px); transition:opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1); }
.stagger-child.in { opacity:1; transform:translateY(0); }

/* ═══════════════════════════ HERO ANIMATIONS ═══════════════════════════ */
@keyframes heroIn { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
.hero-pill    { animation:heroIn .6s cubic-bezier(.16,1,.3,1) .06s both; }
.hero-title   { animation:heroIn .7s cubic-bezier(.16,1,.3,1) .16s both; }
.hero-sub     { animation:heroIn .7s cubic-bezier(.16,1,.3,1) .26s both; }
.hero-actions { animation:heroIn .7s cubic-bezier(.16,1,.3,1) .36s both; }
.hero-trust   { animation:heroIn .6s cubic-bezier(.16,1,.3,1) .48s both; }
.hero-visual  { animation:heroIn .9s cubic-bezier(.16,1,.3,1) .2s both; }

/* ═══════════════════════════ SDR STEP HOVER ═══════════════════════════ */
.sdr-lead { transition:background .2s, transform .28s cubic-bezier(.16,1,.3,1); }
.sdr-lead:hover { transform:translateX(4px); }

/* ═══════════════════════════ PLAN CARD HOVER ═══════════════════════════ */
.plan { transition:transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, border-color .3s, background .3s; }

/* ═══════════════════════════ REDUCED MOTION ═══════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .fade-up, .stagger-child { transition:none; opacity:1; transform:none; }
  .hero-pill, .hero-title, .hero-sub, .hero-actions, .hero-trust, .hero-visual { animation:none; opacity:1; transform:none; }
  .sdr-dash { animation:none; }
  .demo-typing-dot { animation:none; }
  .hero-pill .dot { animation:none; }
}
`

export default function SdrLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqItems = [
    {
      q: 'Preciso de um chip de WhatsApp separado?',
      a: 'Sim. A AttendeAI SDR usa um número de WhatsApp dedicado para prospecção, separado do número de atendimento. Isso protege sua reputação principal e mantém os fluxos organizados. Nós ajudamos na configuração completa.'
    },
    {
      q: 'Como funciona a qualificação automática?',
      a: 'Você define as perguntas de qualificação e os critérios (perfil de empresa, tamanho, urgência, orçamento). A IA conduz a conversa, coleta as respostas e classifica cada lead como quente, morno ou frio — automaticamente.'
    },
    {
      q: 'O agente integra com meu CRM?',
      a: 'Sim. Temos integração nativa com HubSpot, Pipedrive, RD Station e Kommo. Leads qualificados são sincronizados automaticamente com o estágio correto do seu funil. Integrações adicionais sob consulta.'
    },
    {
      q: 'Quantos leads posso contatar por mês?',
      a: 'Depende do plano: Starter permite até 500 leads/mês, Pro até 3.000 e Enterprise é ilimitado. Os custos de API do WhatsApp e IA (Claude) são por conta do cliente, cobrados diretamente pelos provedores.'
    },
    {
      q: 'Os leads recebem mensagens genéricas?',
      a: 'Não. Cada mensagem é gerada pela IA com personalização por nome, empresa e contexto da campanha. O agente adapta o tom e as perguntas conforme as respostas recebidas — sem scripts fixos.'
    },
    {
      q: 'Posso cancelar quando quiser?',
      a: 'Sim, sem multas ou fidelidade mínima. Cancele a qualquer momento entrando em contato com nossa equipe. Seus dados e histórico de campanhas podem ser exportados antes do cancelamento.'
    }
  ]

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i)

  // Scroll animations
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Scroll progress + nav scrolled state
  useEffect(() => {
    const bar = document.createElement('div')
    bar.className = 'scroll-bar'
    document.body.appendChild(bar)
    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      bar.style.transform = `scaleX(${total > 0 ? scrolled / total : 0})`
      const nav = document.querySelector('nav')
      if (nav) nav.classList.toggle('scrolled', scrolled > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); bar.remove() }
  }, [])

  // Stagger card entrance
  useEffect(() => {
    const groups: [string, string][] = [
      ['.pain-grid', '.pain-card'],
      ['.steps', '.step'],
      ['.features-grid', '.feat-card'],
      ['.plans', '.plan'],
      ['.metrics-grid', '.metric-item'],
    ]
    const observers: IntersectionObserver[] = []
    groups.forEach(([container, child]) => {
      const parent = document.querySelector(container)
      if (!parent) return
      const children = Array.from(parent.querySelectorAll(child))
      children.forEach((el) => el.classList.add('stagger-child'))
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            children.forEach((el, i) => {
              setTimeout(() => el.classList.add('in'), i * 80)
            })
            io.disconnect()
          })
        },
        { threshold: 0.1 }
      )
      io.observe(parent)
      observers.push(io)
    })
    return () => observers.forEach((io) => io.disconnect())
  }, [])

  // Hero stats counter
  useEffect(() => {
    const trust = document.querySelector('.hero-trust')
    if (!trust) return
    const counters = [
      { el: document.getElementById('statLeads'), from: 0, to: 10, suffix: 'x', duration: 1400 },
      { el: document.getElementById('statResp'), from: 0, to: 43, suffix: '%', duration: 1600 },
      { el: document.getElementById('statResp5'), from: 10, to: 5, suffix: 'min', duration: 1200 },
    ]
    let started = false
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return
      started = true
      counters.forEach(({ el, from, to, suffix, duration }) => {
        if (!el) return
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const value = Math.round(from + (to - from) * easeOut(progress))
          el.textContent = (suffix === 'min' ? '<' : '') + value + (suffix !== 'min' ? suffix : '')
          if (progress < 1) requestAnimationFrame(tick)
          else el.textContent = (suffix === 'min' ? '<' : '') + to + (suffix !== 'min' ? suffix : '')
        }
        requestAnimationFrame(tick)
      })
      io.disconnect()
    }, { threshold: 0.5 })
    io.observe(trust)
    return () => io.disconnect()
  }, [])

  // Magnetic CTAs
  useEffect(() => {
    const btns = Array.from(document.querySelectorAll('.btn-primary, .btn-plan.filled')) as HTMLElement[]
    const handlers: Array<[HTMLElement, () => void, () => void]> = []
    btns.forEach((btn) => {
      const onEnter = () => { btn.style.transition = 'transform .12s ease, filter .2s, box-shadow .2s' }
      const onLeave = () => {
        btn.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1), filter .2s, box-shadow .2s'
        btn.style.transform = ''
      }
      const onMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect()
        const dx = (e.clientX - r.left - r.width / 2) / r.width
        const dy = (e.clientY - r.top - r.height / 2) / r.height
        btn.style.transform = `translate(${dx * 9}px, ${dy * 9}px)`
      }
      btn.addEventListener('mouseenter', onEnter)
      btn.addEventListener('mouseleave', onLeave)
      btn.addEventListener('mousemove', onMove as EventListener)
      handlers.push([btn, onEnter, onLeave])
    })
    return () => {
      handlers.forEach(([btn, onEnter, onLeave]) => {
        btn.removeEventListener('mouseenter', onEnter)
        btn.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  // Nav section awareness
  useEffect(() => {
    const sectionIds = ['dores', 'como-funciona', 'demo', 'recursos', 'precos']
    const links = Array.from(document.querySelectorAll('.nav-links a')) as HTMLAnchorElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          links.forEach((a) => {
            a.classList.toggle('nav-active', a.getAttribute('href') === `#${entry.target.id}`)
          })
        })
      },
      { threshold: 0.4 }
    )
    sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  // CTA cursor glow
  useEffect(() => {
    const cta = document.querySelector('.cta-final') as HTMLElement | null
    if (!cta) return
    const glow = document.createElement('div')
    glow.className = 'cta-cursor-glow'
    cta.appendChild(glow)
    const onEnter = () => { glow.style.opacity = '1' }
    const onLeave = () => { glow.style.opacity = '0' }
    const onMove = (e: MouseEvent) => {
      const rect = cta.getBoundingClientRect()
      glow.style.left = `${e.clientX - rect.left}px`
      glow.style.top = `${e.clientY - rect.top}px`
    }
    cta.addEventListener('mouseenter', onEnter)
    cta.addEventListener('mouseleave', onLeave)
    cta.addEventListener('mousemove', onMove)
    return () => {
      cta.removeEventListener('mouseenter', onEnter)
      cta.removeEventListener('mouseleave', onLeave)
      cta.removeEventListener('mousemove', onMove)
      glow.remove()
    }
  }, [])

  // Demo interativo
  useEffect(() => {
    const demoConv = [
      { type: 'sent', text: 'Olá Felipe! Tudo bem? Sou a Bia, da Performance 360. A gente conecta empresas de médio porte com soluções de gestão. Posso te falar rapidinho?', step: { title: '1. SDR inicia o contato', desc: 'A IA dispara a primeira mensagem de forma humanizada, personalizada com o nome do lead e contexto da campanha.' } },
      { type: 'received', text: 'Oi! Pode falar sim.', delay: 2000, step: { title: '2. Lead responde', desc: 'Mensagem recebida em segundos. A IA mantém o contexto e responde de forma natural, sem scripts engessados.' } },
      { type: 'sent', text: 'Ótimo! Você está buscando otimizar algum processo comercial ou de gestão de clientes na sua empresa?', step: { title: '3. Qualificação começa', desc: 'A IA faz perguntas estratégicas para identificar necessidade, urgência e fit com o produto.' } },
      { type: 'received', text: 'Estamos com dificuldade para acompanhar nossos leads. Muita coisa manual.', delay: 2200, step: { title: '4. Dor identificada', desc: 'A IA detecta a dor do lead e adapta o roteiro automaticamente para aprofundar a qualificação.' } },
      { type: 'sent', text: 'Entendo! Isso é muito comum. Posso te fazer 2 perguntas rápidas para entender melhor?\n\nQual o tamanho da sua equipe comercial e em qual segmento vocês atuam?', step: { title: '5. Coleta de dados', desc: 'Dados do lead registrados automaticamente no painel e no CRM conectado.' } },
      { type: 'received', text: 'Somos 12 pessoas na área comercial. Setor financeiro, B2B.', delay: 2400, step: { title: '6. Lead qualificado como quente', desc: 'A IA classifica o lead com base nos critérios definidos. Felipe é quente: equipe comercial, setor B2B, dor clara.' } },
      { type: 'sent', text: 'Perfeito! Temos uma solução ideal para esse perfil. Nosso consultor especializado em B2B financeiro pode mostrar como funciona em 30 minutos.\n\nQual seu melhor horário essa semana?', step: { title: '7. Proposta de reunião', desc: 'A IA identifica o interesse e propõe agendamento com o consultor certo, direto no Google Calendar.' } },
      { type: 'received', text: 'Sexta às 14h está bom.', delay: 1800, step: { title: '8. Horário confirmado', desc: 'Lead aceita. A IA reserva o horário no Google Calendar e prepara a confirmação.' } },
      { type: 'sent', text: 'Ótimo, Felipe! Reunião agendada:\n\nSexta, 24/01 às 14h\nCom Dr. Carlos Menezes\nPerformance 360\n\nVocê receberá um convite no email. Até sexta!', delay: 1600, step: { title: '9. Reunião agendada', desc: 'Evento criado no Google Calendar, convite enviado por email, consultor notificado. Tudo automático — zero intervenção humana.' } },
    ]

    let demoStep = -1
    let demoAnimating = false
    let demoStarted = false

    const body = document.getElementById('demoChatBody')
    const overlay = document.getElementById('demoOverlay')
    const status = document.getElementById('demoStatus')
    const progress = document.getElementById('demoProgress') as HTMLElement | null
    const stepTitle = document.getElementById('demoStepTitle')
    const stepDesc = document.getElementById('demoStepDesc')
    const phone = document.getElementById('demoPhone')
    const restartBtn = document.getElementById('demoRestartBtn')

    if (!body || !overlay || !status || !progress || !stepTitle || !stepDesc || !phone) return

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const getTime = () => {
      const n = new Date()
      return n.getHours().toString().padStart(2, '0') + ':' + n.getMinutes().toString().padStart(2, '0')
    }
    const scrollBody = () => { body.scrollTop = body.scrollHeight }
    const showTyping = () => {
      const ind = document.createElement('div')
      ind.className = 'demo-typing visible'
      ind.id = 'demoTyping'
      ind.innerHTML = '<div class="demo-typing-dot"></div><div class="demo-typing-dot"></div><div class="demo-typing-dot"></div>'
      body.appendChild(ind)
      scrollBody()
      status.textContent = 'digitando...'
    }
    const hideTyping = () => { document.getElementById('demoTyping')?.remove(); status.textContent = 'online' }
    const addMsg = (type: string, text: string) => {
      const msg = document.createElement('div')
      msg.className = 'demo-msg ' + type
      const check = type === 'sent' ? ' <span class="dm-check">✓✓</span>' : ''
      msg.innerHTML = text.replace(/\n/g, '<br>') + '<span class="dm-time">' + getTime() + check + '</span>'
      body.appendChild(msg)
      scrollBody()
    }
    const updateStep = (step: { title: string; desc: string } | null) => {
      if (!step) return
      stepTitle.textContent = step.title
      stepDesc.textContent = step.desc
    }
    const nextStep = async () => {
      if (demoAnimating) return
      demoStep++
      if (demoStep >= demoConv.length) {
        stepTitle.textContent = 'Demo completa!'
        stepDesc.textContent = 'Todo esse fluxo acontece sem intervenção humana. O consultor só recebe leads quentes prontos para fechar.'
        return
      }
      demoAnimating = true
      const item = demoConv[demoStep]
      if (item.step) updateStep(item.step)
      if (item.type === 'received') {
        showTyping()
        await sleep(item.delay || 1500)
        hideTyping()
      } else {
        await sleep(300)
      }
      addMsg(item.type, item.text)
      progress.style.transform = `scaleX(${(demoStep + 1) / demoConv.length})`
      demoAnimating = false
    }
    const startDemo = () => { overlay.classList.add('hidden'); demoStarted = true; setTimeout(() => nextStep(), 500) }
    const resetDemo = () => {
      demoStep = -1; demoAnimating = false; demoStarted = false
      body.innerHTML = '<div class="demo-date"><span>Hoje</span></div>'
      progress.style.transform = 'scaleX(0)'
      overlay.classList.remove('hidden')
      status.textContent = 'online'
      stepTitle.textContent = 'Aguardando...'
      stepDesc.textContent = 'Clique no celular ou pressione Espaço para avançar.'
    }
    const onOverlayClick = () => startDemo()
    overlay.addEventListener('click', onOverlayClick)
    const onPhoneClick = (e: Event) => {
      if (!demoStarted || (e.target as HTMLElement).closest('.demo-overlay')) return
      nextStep()
    }
    phone.addEventListener('click', onPhoneClick)
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'r' || e.key === 'R') {
        const rect = phone.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) { resetDemo(); return }
      }
      if (!demoStarted) {
        if (e.key === ' ' || e.key === 'ArrowRight') {
          const rect = phone.getBoundingClientRect()
          if (rect.top < window.innerHeight && rect.bottom > 0) { e.preventDefault(); startDemo() }
        }
        return
      }
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const rect = phone.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) { e.preventDefault(); nextStep() }
      }
    }
    document.addEventListener('keydown', onKey)
    restartBtn?.addEventListener('click', resetDemo)
    return () => {
      overlay.removeEventListener('click', onOverlayClick)
      phone.removeEventListener('click', onPhoneClick)
      document.removeEventListener('keydown', onKey)
      restartBtn?.removeEventListener('click', resetDemo)
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div data-theme="dark">

        {/* NAV */}
        <nav>
          <a href="/" className="logo">
            <span className="logo-mark">a</span>
            attende<span style={{ color: 'var(--muted)', fontWeight: 400 }}>.ai</span>
            <span className="logo-sdr">SDR</span>
          </a>
          <ul className="nav-links">
            <li><a href="#dores">O problema</a></li>
            <li><a href="#demo">Demonstração</a></li>
            <li><a href="#recursos">Recursos</a></li>
            <li><a href="#precos">Preços</a></li>
          </ul>
          <div className="nav-right">
            <a href="https://attendeai.ia.br/sdr/login" className="nav-login">Entrar</a>
            <a href="https://wa.me/5534980799965?text=Quero%20saber%20sobre%20o%20SDR%20da%20AttendeAI" className="nav-cta">
              Falar com especialista
              <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="hero-grid"></div>
          <div className="wrap">
            <div className="hero-content">
              <div className="hero-pill">
                <span className="tag"><span className="dot" style={{ display: 'inline-block', marginRight: '4px' }}></span>prospecção</span>
                IA que prospecta enquanto você fecha negócios
              </div>

              <h1 className="hero-title">
                Seu SDR nunca<br />
                <em>para de prospectar.</em>
              </h1>

              <p className="hero-sub">
                Um agente de IA que dispara campanhas via WhatsApp, qualifica leads automaticamente e agenda reuniões com seus consultores — 24 horas por dia, sem custo de CLT.
              </p>

              <div className="hero-actions">
                <a href="https://wa.me/5534980799965?text=Quero%20saber%20sobre%20o%20SDR%20da%20AttendeAI" className="btn btn-primary">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  Falar com especialista
                </a>
                <a href="#demo" className="btn btn-ghost">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M5 3v10l8-5-8-5z" fill="currentColor"/></svg>
                  Ver demonstração
                </a>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <div className="k">24<span className="accent">/7</span></div>
                  <div className="v">prospectando</div>
                </div>
                <div className="trust-item">
                  <div className="k"><span className="accent" id="statLeads">10</span>x</div>
                  <div className="v">mais leads contatados</div>
                </div>
                <div className="trust-item">
                  <div className="k"><span className="accent" id="statResp">43</span>%</div>
                  <div className="v">taxa de resposta</div>
                </div>
                <div className="trust-item">
                  <div className="k">&lt;<span className="accent" id="statResp5">5</span>min</div>
                  <div className="v">tempo de resposta</div>
                </div>
              </div>
            </div>

            {/* SDR DASHBOARD PREVIEW */}
            <div className="hero-visual">
              <div className="sdr-dash">
                <div className="sdr-dash-head">
                  <div className="sdr-dash-title">Campanha — Q4 2026</div>
                  <div className="sdr-dash-badge"><span className="dot"></span>IA ativa</div>
                </div>
                <div className="sdr-stats">
                  <div className="sdr-stat">
                    <div className="s-n">1<span>27</span></div>
                    <div className="s-l">leads contatados</div>
                  </div>
                  <div className="sdr-stat">
                    <div className="s-n"><span>43</span>%</div>
                    <div className="s-l">responderam</div>
                  </div>
                  <div className="sdr-stat">
                    <div className="s-n"><span>12</span></div>
                    <div className="s-l">reuniões agendadas</div>
                  </div>
                </div>
                <div className="sdr-leads">
                  <div className="sdr-lead">
                    <div className="sdr-lead-av">FA</div>
                    <div className="sdr-lead-info">
                      <div className="sdr-lead-name">Felipe Alves</div>
                      <div className="sdr-lead-co">Nexus Financeira · Gerente</div>
                    </div>
                    <span className="sdr-chip hot">quente</span>
                  </div>
                  <div className="sdr-lead">
                    <div className="sdr-lead-av">CM</div>
                    <div className="sdr-lead-info">
                      <div className="sdr-lead-name">Carla Moreira</div>
                      <div className="sdr-lead-co">Grupo Brasília · Diretora</div>
                    </div>
                    <span className="sdr-chip warm">morno</span>
                  </div>
                  <div className="sdr-lead">
                    <div className="sdr-lead-av">RP</div>
                    <div className="sdr-lead-info">
                      <div className="sdr-lead-name">Rafael Pires</div>
                      <div className="sdr-lead-co">TechCorp · CEO</div>
                    </div>
                    <span className="sdr-chip new">novo</span>
                  </div>
                  <div className="sdr-lead">
                    <div className="sdr-lead-av">JO</div>
                    <div className="sdr-lead-info">
                      <div className="sdr-lead-name">Juliana Oliveira</div>
                      <div className="sdr-lead-co">Alpha RH · Sócia</div>
                    </div>
                    <span className="sdr-chip hot">quente</span>
                  </div>
                </div>
                <div className="sdr-foot">
                  <div className="sdr-foot-text">68% concluído</div>
                  <div className="sdr-foot-bar"><div className="sdr-foot-bar-fill"></div></div>
                  <div className="sdr-foot-text">87 restantes</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGOS */}
        <div className="logos-section">
          <div className="wrap">
            <div className="logos-label">Integrado com as ferramentas que você já usa</div>
            <div className="logos-row">
              <div className="logo-item"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> Google Calendar</div>
              <div className="logo-item"><svg viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 11-3.5-7.1L21 3v6h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> WhatsApp Business</div>
              <div className="logo-item"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> HubSpot / Pipedrive</div>
              <div className="logo-item"><svg viewBox="0 0 24 24" fill="none"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM2 9l10 6 10-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> RD Station</div>
            </div>
          </div>
        </div>

        {/* PAIN POINTS */}
        <section id="dores">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">O problema</div>
              <h2 className="section-title">SDRs humanos têm limite. <em>Sua meta não.</em></h2>
              <p className="section-sub">Prospecção manual consome tempo, custa caro e não escala. Enquanto isso, leads esfriando na planilha.</p>
            </div>
            <div className="pain-grid fade-up">
              <div className="pain-card">
                <div className="pain-ico">
                  <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 3l4 4M22 3l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <h3>SDR caro e com horário</h3>
                <p>Um SDR júnior custa R$3.500+ por mês e trabalha 8h por dia. Fora do horário comercial, nenhum lead é contatado — e a concorrência não dorme.</p>
                <div className="pain-stat">R$3.500+/mês · só 8h/dia</div>
              </div>
              <div className="pain-card">
                <div className="pain-ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <h3>Follow-ups esquecidos</h3>
                <p>70% dos leads precisam de mais de 3 contatos para responder. Na prática, o SDR para no segundo — e os melhores leads somem da sua lista.</p>
                <div className="pain-stat">70% dos leads ignorados</div>
              </div>
              <div className="pain-card">
                <div className="pain-ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18M7 16l4-4 4 4 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 6l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Leads desqualificados para o consultor</h3>
                <p>Consultores desperdiçam horas em reuniões com leads frios. Sem qualificação automática, o funil fica entupido de oportunidades ruins.</p>
                <div className="pain-stat">60% das reuniões sem conversão</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how" id="como-funciona" style={{ background: 'var(--bg-elev)' }}>
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">Como funciona</div>
              <h2 className="section-title">Do disparo ao agendamento em minutos.</h2>
              <p className="section-sub">Seu agente de IA conduz toda a jornada de prospecção de forma autônoma — sem depender de nenhuma ação sua.</p>
            </div>
            <div className="steps fade-up">
              <div className="step">
                <div className="step-num">01 · importe</div>
                <div className="step-ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Importe sua lista de leads</h3>
                <p>Upload via CSV ou cole direto no painel. Configure o perfil de cliente ideal e o prompt da campanha em minutos.</p>
              </div>
              <div className="step">
                <div className="step-num">02 · dispare</div>
                <div className="step-ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>IA dispara e conversa</h3>
                <p>O agente envia mensagens humanizadas pelo WhatsApp e mantém conversas naturais com cada lead, 24h por dia.</p>
              </div>
              <div className="step">
                <div className="step-num">03 · qualifique</div>
                <div className="step-ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Qualificação automática</h3>
                <p>Perguntas parametrizáveis e classificação inteligente. Cada lead recebe um status: quente, morno ou frio.</p>
              </div>
              <div className="step">
                <div className="step-num">04 · agende</div>
                <div className="step-ico">
                  <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Reunião agendada</h3>
                <p>Leads quentes recebem proposta de horário. A IA agenda direto no Google Calendar e notifica o consultor responsável.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DEMO */}
        <section id="demo">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">Demonstração</div>
              <h2 className="section-title">Veja o agente prospectando ao vivo.</h2>
              <p className="section-sub">Uma conversa real do SDR AttendeAI abordando um lead e agendando uma reunião. Clique para avançar.</p>
            </div>
            <div className="demo-container fade-up">
              <div className="demo-phone" id="demoPhone">
                <div className="demo-overlay" id="demoOverlay">
                  <div className="demo-overlay-title">AttendeAI SDR</div>
                  <div className="demo-overlay-sub">Agente de prospecção via WhatsApp</div>
                  <button className="demo-play-btn" aria-label="Iniciar demo">&#9654;</button>
                  <div className="demo-overlay-hint">Clique para iniciar</div>
                </div>
                <div className="demo-chat-header">
                  <div className="demo-avatar">B</div>
                  <div>
                    <div className="demo-header-name">Bia - Performance 360</div>
                    <div className="demo-header-status online" id="demoStatus">online</div>
                  </div>
                </div>
                <div className="demo-chat-body" id="demoChatBody">
                  <div className="demo-date"><span>Hoje</span></div>
                </div>
                <div className="demo-input-bar">
                  <input placeholder="Mensagem" readOnly />
                </div>
                <div className="demo-progress" id="demoProgress"></div>
              </div>

              <div className="demo-side">
                <div className="demo-step-card" id="demoStepCard">
                  <div className="ds-title" id="demoStepTitle">Aguardando...</div>
                  <div className="ds-desc" id="demoStepDesc">Clique no celular ou pressione Espaço para avançar.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="demo-nav-hint">
                    <kbd>Espaço</kbd> ou <kbd>&rarr;</kbd> para avançar
                  </span>
                  <span style={{ color: 'var(--border-strong)' }}>·</span>
                  <button className="demo-restart-btn" id="demoRestartBtn">Reiniciar</button>
                </div>

                {/* Lead card */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '20px', marginTop: '4px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Lead classificado</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>FA</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>Felipe Alves</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Nexus Financeira · Gerente</div>
                    </div>
                    <span className="sdr-chip hot" style={{ marginLeft: 'auto' }}>quente</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-2)', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>setor</span> B2B Financeiro</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-2)', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>equipe</span> 12 comerciais</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-2)', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>reunião</span> Sexta 24/01 · 14h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="recursos" style={{ background: 'var(--bg-elev)' }}>
          <div className="wrap">
            <div className="section-head fade-up">
              <div className="eyebrow">Recursos</div>
              <h2 className="section-title">Tudo que um SDR faz — sem horário, sem CLT.</h2>
              <p className="section-sub">Automatize a prospecção e deixe sua equipe focada no que importa: fechar negócios.</p>
            </div>
            <div className="features-grid fade-up">
              <div className="feat-card">
                <div className="feat-ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Prospecção ativa via WhatsApp</h3>
                <p>Disparo de campanhas com controle de volume, personalização por segmento e follow-ups automáticos em intervalos naturais.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                </div>
                <h3>Conversas humanizadas com IA</h3>
                <p>Diálogo contextual que interpreta respostas, adapta perguntas e mantém o tom certo durante toda a jornada de qualificação.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Qualificação inteligente</h3>
                <p>Defina suas perguntas e critérios de classificação. O agente qualifica cada lead automaticamente como quente, morno ou frio.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico">
                  <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Agendamento automático</h3>
                <p>Integração com Google Calendar. O agente consulta disponibilidade, agenda reuniões em tempo real e notifica o consultor responsável.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18M7 16l4-4 4 4 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Dashboard de métricas</h3>
                <p>Acompanhe leads abordados, taxa de resposta, classificação, agendamentos e conversão por campanha — em tempo real.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Integração com CRM</h3>
                <p>Conecte com HubSpot, Pipedrive, RD Station ou Kommo. Leads qualificados sincronizados automaticamente no estágio correto do funil.</p>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS BAND */}
        <div className="metrics-band">
          <div className="wrap">
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-n"><span>10</span>x</div>
                <div className="metric-l">mais leads contatados por dia vs. SDR humano</div>
                <div className="metric-d">↗ escala ilimitada</div>
              </div>
              <div className="metric-item">
                <div className="metric-n"><span>43</span>%</div>
                <div className="metric-l">taxa de resposta média nas campanhas</div>
                <div className="metric-d">↗ vs. 18% cold email</div>
              </div>
              <div className="metric-item">
                <div className="metric-n"><span>3</span>x</div>
                <div className="metric-l">mais reuniões agendadas por semana</div>
                <div className="metric-d">↗ sem aumentar equipe</div>
              </div>
              <div className="metric-item">
                <div className="metric-n">&lt;<span>5</span>min</div>
                <div className="metric-l">tempo para o lead receber a primeira resposta</div>
                <div className="metric-d">↗ 24h por dia</div>
              </div>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <section className="how" id="precos">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">Planos e preços</div>
              <h2 className="section-title">Comece hoje. Escale quando quiser.</h2>
              <p className="section-sub">Sem taxa de adesão, sem fidelidade. Custos de API (WhatsApp e IA) por conta do cliente, cobrados diretamente pelos provedores.</p>
            </div>
            <div className="plans fade-up">
              {/* STARTER */}
              <div className="plan">
                <div className="plan-name">Starter</div>
                <div className="plan-desc">Para equipes pequenas começando a prospectar com IA</div>
                <div className="plan-price">
                  <span className="plan-currency">R$</span>
                  <span className="plan-amount">697</span>
                </div>
                <div className="plan-period">por mês · faturado mensalmente</div>
                <ul className="plan-feats">
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>1 campanha ativa</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Até 500 leads/mês</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Qualificação automática com IA</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Agendamento no Google Calendar</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>1 consultor incluído</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Painel administrativo</span></li>
                  <li className="muted"><svg className="cross" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span>Dashboard avançado</span></li>
                  <li className="muted"><svg className="cross" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span>Integração com CRM</span></li>
                </ul>
                <a href="https://attendeai.ia.br/sdr/registro" className="btn-plan outline">Criar conta <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              </div>

              {/* PRO */}
              <div className="plan featured">
                <div className="plan-badge">Mais popular</div>
                <div className="plan-name">Pro</div>
                <div className="plan-desc">Para equipes de vendas que precisam escalar a prospecção</div>
                <div className="plan-price">
                  <span className="plan-currency">R$</span>
                  <span className="plan-amount">1.497</span>
                </div>
                <div className="plan-period">por mês · faturado mensalmente</div>
                <ul className="plan-feats">
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Campanhas ilimitadas</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Até 3.000 leads/mês</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Qualificação automática com IA</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Agendamento no Google Calendar</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Até 5 consultores</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Dashboard completo de métricas</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Integração com 1 CRM</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Distribuição de leads entre consultores</span></li>
                </ul>
                <a href="https://attendeai.ia.br/sdr/registro" className="btn-plan filled">Criar conta <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              </div>

              {/* ENTERPRISE */}
              <div className="plan">
                <div className="plan-name">Enterprise</div>
                <div className="plan-desc">Para operações robustas com múltiplas equipes</div>
                <div className="plan-price">
                  <span className="plan-currency">R$</span>
                  <span className="plan-amount">2.497</span>
                </div>
                <div className="plan-period">por mês · faturado mensalmente</div>
                <ul className="plan-feats">
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Campanhas ilimitadas</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Leads ilimitados</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Consultores ilimitados</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Dashboard completo de métricas</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Múltiplos CRMs conectados</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Suporte prioritário via WhatsApp</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Onboarding dedicado + treinamento</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>SLA e contrato personalizado</span></li>
                </ul>
                <a href="https://wa.me/5534980799965?text=Quero%20o%20plano%20Enterprise%20do%20SDR%20AttendeAI" className="btn-plan outline">Falar com vendas <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              </div>
            </div>
            <div className="pricing-foot">
              <svg viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2"/></svg>
              <span>Pagamento 100% seguro · Cancele quando quiser</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="how" style={{ background: 'var(--bg-elev)' }} id="faq">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">Perguntas frequentes</div>
              <h2 className="section-title">Ainda tem dúvidas?</h2>
            </div>
            <div className="faq-wrap">
              {faqItems.map((item, index) => (
                <div key={index} className="faq-item fade-up" data-open={openFaq === index ? 'true' : undefined}>
                  <button type="button" className="faq-q" onClick={(e) => { e.preventDefault(); toggleFaq(index) }}>
                    {item.q}
                    <span className="faq-arrow">
                      <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </span>
                  </button>
                  <div className="faq-a"><div className="faq-a-inner">{item.a}</div></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <div className="cta-final">
          <div className="cta-final-inner fade-up">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Comece agora</div>
            <h2>Seu próximo cliente está <em>esperando</em> ser abordado.</h2>
            <p>Enquanto seu time dorme, a AttendeAI SDR prospecta, qualifica e agenda reuniões — sem parar.</p>
            <div className="actions">
              <a href="https://wa.me/5534980799965?text=Quero%20saber%20sobre%20o%20SDR%20da%20AttendeAI" className="btn btn-primary">
                <svg viewBox="0 0 16 16" fill="none"><path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                Falar com especialista
              </a>
              <a href="https://attendeai.ia.br/sdr/registro" className="btn btn-ghost">
                Criar conta grátis
                <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer>
          <div className="wrap">
            <div className="footer-inner">
              <a href="/" className="logo" style={{ fontSize: '16px' }}>
                <span className="logo-mark">a</span>
                attende<span style={{ color: 'var(--muted)', fontWeight: 400 }}>.ai</span>
                <span className="logo-sdr">SDR</span>
              </a>
              <div className="footer-links">
                <a href="https://attendeai.ia.br">Página principal</a>
                <a href="https://clinicas.attendeai.ia.br">Clínicas</a>
                <a href="#">Termos</a>
                <a href="#">Privacidade</a>
                <a href="https://wa.me/5534980799965">Fale conosco</a>
              </div>
            </div>
            <div className="footer-copy">
              <span>&copy; 2026 AttendeAI</span>
              <span>feito no brasil</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
