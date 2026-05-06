'use client'
import { useEffect, useMemo, useState } from 'react'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&family=Instrument+Serif&display=swap');

/* ═══════════════════════════ TOKENS ═══════════════════════════ */
:root {
  /* DARK (default) */
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
  --accent-soft: rgba(0, 229, 160, 0.08);
  --accent-line: rgba(0, 229, 160, 0.22);
  --danger: #ff6079;
  --info: #5b9cff;

  /* Type */
  --font-sans: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', 'SF Mono', Menlo, monospace;
  --font-display: 'Geist', sans-serif;

  /* Metrics */
  --container: 1200px;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 18px;
  --r-xl: 24px;

  color-scheme: dark;
}

[data-theme="light"] {
  --bg: #fafaf9;
  --bg-elev: #ffffff;
  --surface: #ffffff;
  --surface-2: #f4f4f2;
  --border: #e8e8e5;
  --border-strong: #d4d4d0;
  --text: #0a0d10;
  --text-2: #3d4549;
  --muted: #737d84;
  --accent-soft: rgba(0, 180, 125, 0.08);
  --accent-line: rgba(0, 180, 125, 0.28);
  color-scheme: light;
}

* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-weight: 400;
  font-feature-settings: "ss01", "cv11";
  font-size: 15px;
  line-height: 1.5;
  letter-spacing: -0.005em;
  overflow-x: hidden;
}
a { color: inherit; text-decoration: none; }
button { font-family: inherit; }
::selection { background: var(--accent); color: var(--accent-ink); }

/* Subtle grain */
body::before {
  content:'';
  position:fixed; inset:0; z-index:9999;
  pointer-events:none;
  opacity: .35;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
[data-theme="light"] body::before { opacity: .6; filter: invert(1); }

/* ═══════════════════════════ LAYOUT ═══════════════════════════ */
.wrap { max-width: var(--container); margin: 0 auto; padding: 0 32px; }
@media (max-width: 700px) { .wrap { padding: 0 20px; } }

section { padding: 120px 0; position: relative; }
.section-head { max-width: 640px; margin-bottom: 72px; }
.section-head.center { margin-left:auto; margin-right:auto; text-align:center; }

/* ═══════════════════════════ TYPE ═══════════════════════════ */
h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 600; letter-spacing: -0.025em; line-height: 1.05; }

.eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.eyebrow::before {
  content: '';
  width: 14px; height: 1px;
  background: var(--accent);
}

.section-title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.02;
  margin-bottom: 20px;
}
.section-sub {
  color: var(--text-2);
  font-size: 17px;
  line-height: 1.55;
  font-weight: 400;
  max-width: 520px;
  letter-spacing: -0.01em;
}
.section-head.center .section-sub { margin: 0 auto; }
.section-head.center .eyebrow { justify-content: center; }

/* ═══════════════════════════ NAV ═══════════════════════════ */
nav {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: calc(100% - 32px);
  max-width: calc(var(--container) - 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 10px 20px;
  background: color-mix(in oklab, var(--bg-elev) 85%, transparent);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid var(--border);
  border-radius: 100px;
  transition: all .3s;
}

.logo {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.02em;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-mark {
  width: 20px; height: 20px;
  border-radius: 6px;
  background: var(--accent);
  display: grid; place-items: center;
  color: var(--accent-ink);
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0;
}

.nav-links {
  display: flex;
  gap: 6px;
  list-style: none;
}
.nav-links a {
  color: var(--text-2);
  font-size: 13.5px;
  font-weight: 400;
  padding: 8px 14px;
  border-radius: 100px;
  transition: all .2s;
}
.nav-links a:hover { color: var(--text); background: var(--surface-2); }

.nav-login-link {
  color: var(--text-2);
  font-size: 13.5px;
  padding: 8px 14px;
  border-radius: 100px;
  transition: all .2s;
}
.nav-login-link:hover { color: var(--text); background: var(--surface-2); }

.nav-cta {
  background: var(--accent);
  color: var(--accent-ink);
  padding: 9px 18px;
  border-radius: 100px;
  font-size: 13.5px;
  font-weight: 500;
  border: none;
  white-space: nowrap;
  cursor: pointer;
  transition: all .2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}
.nav-cta:hover { filter: brightness(1.08); transform: translateY(-1px); }

.nav-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 780px) {
  .nav-links { display: none; }
  nav { padding: 8px 8px 8px 16px; }
}

/* ═══════════════════════════ BUTTONS ═══════════════════════════ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 500;
  letter-spacing: -0.005em;
  cursor: pointer;
  border: none;
  transition: all .2s;
  font-family: inherit;
}
.btn-primary {
  background: var(--accent);
  color: var(--accent-ink);
  box-shadow: 0 0 0 1px color-mix(in oklab, var(--accent) 30%, transparent), 0 8px 24px -8px color-mix(in oklab, var(--accent) 40%, transparent);
}
.btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 0 0 1px color-mix(in oklab, var(--accent) 40%, transparent), 0 14px 32px -8px color-mix(in oklab, var(--accent) 55%, transparent); }
.btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border-strong);
}
.btn-ghost:hover { border-color: var(--text-2); background: var(--surface); }

.btn svg { width: 15px; height: 15px; }

/* ═══════════════════════════ HERO ═══════════════════════════ */
.hero {
  padding-top: 160px;
  padding-bottom: 120px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse 50% 60% at 70% 35%, var(--accent-soft) 0%, transparent 65%),
    radial-gradient(ellipse 60% 50% at 20% 90%, color-mix(in oklab, var(--info) 10%, transparent) 0%, transparent 60%);
  pointer-events: none;
}
.hero-grid {
  position: absolute; inset: 0; z-index: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse at 50% 30%, black 10%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 30%, black 10%, transparent 70%);
  opacity: .7;
}

.hero .wrap {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 64px;
  align-items: center;
}
@media (max-width: 1000px) {
  .hero .wrap { grid-template-columns: 1fr; gap: 64px; }
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 12.5px;
  color: var(--text-2);
  margin-bottom: 28px;
  font-weight: 400;
  letter-spacing: -0.005em;
}
.hero-pill .tag {
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid var(--accent-line);
  padding: 3px 10px;
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.hero-pill .dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 3px var(--accent-soft); }
  50% { box-shadow: 0 0 0 6px transparent; }
}

h1.hero-title {
  font-size: clamp(2.6rem, 5.2vw, 4.4rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 0.98;
  margin-bottom: 24px;
}
h1.hero-title em {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-weight: 400;
  color: var(--accent);
  letter-spacing: -0.02em;
}

.hero-sub {
  font-size: 18px;
  color: var(--text-2);
  line-height: 1.55;
  max-width: 520px;
  margin-bottom: 36px;
  letter-spacing: -0.008em;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.hero-trust {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 24px;
  flex-wrap: nowrap;
  align-items: flex-start;
}
.trust-item .k {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
}
.trust-item .k .accent { color: var(--accent); }
.trust-item .v {
  font-size: 12.5px;
  color: var(--muted);
  margin-top: 6px;
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

/* ── HERO VISUAL ── */
.hero-visual { position: relative; min-height: 520px; }
.hero-visual .variant { display: none; }
.hero-visual[data-variant="conversation"] .v-conversation,
.hero-visual[data-variant="dashboard"] .v-dashboard,
.hero-visual[data-variant="phone"] .v-phone { display: block; }

/* V1: Dual panel (conversation) */
.v-conversation {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  position: relative;
}
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: 0 24px 60px -30px rgba(0,0,0,.6), 0 1px 0 0 color-mix(in oklab, var(--text) 4%, transparent) inset;
}
.panel-head {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.panel-head-left { display: flex; align-items: center; gap: 10px; }
.panel-avatar {
  width: 30px; height: 30px;
  border-radius: 8px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
  display: grid; place-items: center;
  color: var(--accent);
}
.panel-avatar svg { width: 16px; height: 16px; }
.panel-title { font-size: 13.5px; font-weight: 500; letter-spacing: -0.01em; }
.panel-sub { font-size: 11.5px; color: var(--muted); font-family: var(--font-mono); }
.panel-status {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.panel-status .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); animation: pulse 2s infinite; }
.panel-body { padding: 18px; display: flex; flex-direction: column; gap: 10px; }

.bubble {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.45;
  max-width: 82%;
  letter-spacing: -0.005em;
}
.bubble.bot {
  background: var(--accent-soft);
  color: var(--text);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
  border: 1px solid var(--accent-line);
}
.bubble.user {
  background: var(--surface-2);
  color: var(--text);
  align-self: flex-end;
  border-bottom-right-radius: 4px;
  border: 1px solid var(--border);
}
.bubble.confirm {
  background: var(--accent-soft);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
  border: 1px solid var(--accent-line);
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.bubble.confirm svg { width: 16px; height: 16px; color: var(--accent); flex-shrink: 0; margin-top: 1px; }

.typing {
  display: inline-flex;
  gap: 4px;
  padding: 10px 14px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
  border-radius: 14px;
  border-bottom-left-radius: 4px;
  width: fit-content;
  align-self: flex-start;
}
.typing i { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: blink 1.2s infinite; font-style: normal; }
.typing i:nth-child(2){animation-delay:.2s}
.typing i:nth-child(3){animation-delay:.4s}
@keyframes blink { 0%,80%,100%{opacity:.25} 40%{opacity:1} }

/* Call panel */
.call-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 18px; display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center; }
.call-ico {
  width: 40px; height: 40px; border-radius: 10px;
  background: color-mix(in oklab, var(--info) 12%, transparent);
  border: 1px solid color-mix(in oklab, var(--info) 25%, transparent);
  display: grid; place-items: center;
  color: var(--info);
}
.call-ico svg { width: 18px; height: 18px; }
.call-meta .t { font-size: 13px; font-weight: 500; letter-spacing: -0.005em; }
.call-meta .s { font-size: 11px; font-family: var(--font-mono); color: var(--muted); margin-top: 2px; }
.waveform {
  display: flex; align-items: center; gap: 2px;
  height: 26px;
  grid-column: 1 / -1;
  padding-top: 4px;
  border-top: 1px solid var(--border);
  margin-top: 4px;
  padding: 10px 0 2px;
}
.waveform i {
  flex: 1;
  min-width: 2px;
  max-width: 4px;
  border-radius: 2px;
  background: var(--accent);
  opacity: .7;
  animation: wave 1.4s infinite ease-in-out;
  font-style: normal;
}
@keyframes wave { 0%,100%{transform:scaleY(.25)} 50%{transform:scaleY(1)} }
.call-time { font-family: var(--font-mono); font-size: 13px; color: var(--accent); font-weight: 500; }

/* V2: Dashboard */
.v-dashboard {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  overflow: hidden;
  box-shadow: 0 30px 80px -30px rgba(0,0,0,.6);
}
.dash-top {
  padding: 12px 18px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}
.dash-dots { display: flex; gap: 6px; }
.dash-dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--border-strong); font-style: normal; }
.dash-url {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  background: var(--surface-2);
  padding: 4px 10px;
  border-radius: 6px;
  flex: 1;
  text-align: center;
}
.dash-body { padding: 24px; }
.dash-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
.dash-stat {
  padding: 14px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
}
.dash-stat .l { font-size: 10.5px; color: var(--muted); font-family: var(--font-mono); letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 8px; }
.dash-stat .n { font-family: var(--font-display); font-size: 22px; font-weight: 500; letter-spacing: -0.02em; }
.dash-stat .d { font-size: 10.5px; font-family: var(--font-mono); color: var(--accent); margin-top: 4px; }
.dash-stat .d.down { color: var(--danger); }

.dash-chart {
  height: 100px;
  position: relative;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 14px;
  margin-bottom: 16px;
}
.dash-chart-hd { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.dash-chart-hd .l { font-size: 11px; color: var(--text-2); font-weight: 500; }
.dash-chart-hd .v { font-size: 11px; color: var(--accent); font-family: var(--font-mono); }
.dash-chart svg { width: 100%; height: 60px; }

.dash-list { display: flex; flex-direction: column; gap: 6px; }
.dash-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
}
.dash-row .ch {
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
  display: grid; place-items: center;
  color: var(--accent);
}
.dash-row .ch svg { width: 14px; height: 14px; }
.dash-row .m { font-size: 12.5px; }
.dash-row .m .t { font-weight: 500; letter-spacing: -0.005em; }
.dash-row .m .s { font-size: 11px; color: var(--muted); font-family: var(--font-mono); margin-top: 2px; }
.dash-row .tm { font-size: 10.5px; color: var(--muted); font-family: var(--font-mono); }

/* V3: Phone */
.v-phone {
  display: flex;
  justify-content: center;
}
.phone {
  width: 300px;
  height: 600px;
  background: #0a0d10;
  border: 1.5px solid var(--border-strong);
  border-radius: 44px;
  padding: 10px;
  box-shadow: 0 40px 80px -30px rgba(0,0,0,.8), inset 0 0 0 1px rgba(255,255,255,.03);
  position: relative;
}
.phone::before {
  content: '';
  position: absolute;
  top: 18px; left: 50%;
  transform: translateX(-50%);
  width: 90px; height: 26px;
  background: #000;
  border-radius: 100px;
  z-index: 2;
}
.phone-screen {
  width: 100%; height: 100%;
  background: var(--bg-elev);
  border-radius: 34px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.phone-status {
  padding: 44px 20px 8px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-2);
}
.phone-head {
  padding: 8px 16px 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}
.phone-head .av {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--accent);
  color: var(--accent-ink);
  display: grid; place-items: center;
  font-weight: 700;
  font-size: 13px;
}
.phone-head .ti .n { font-size: 13px; font-weight: 600; }
.phone-head .ti .s { font-size: 10px; color: var(--accent); font-family: var(--font-mono); display: flex; align-items: center; gap: 4px; }
.phone-head .ti .s i { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); font-style: normal; }
.phone-body { flex: 1; padding: 14px; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
.phone-body .bubble { font-size: 12px; padding: 8px 12px; border-radius: 12px; }

/* ═══════════════════════════ LOGOS ═══════════════════════════ */
.logos-section {
  padding: 56px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.logos-label {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 32px;
}
.logos-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 56px;
  flex-wrap: wrap;
}
.logo-item {
  display: flex; align-items: center; gap: 8px;
  color: var(--text-2);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: .2s;
}
.logo-item:hover { color: var(--text); }
.logo-item svg { width: 18px; height: 18px; }

/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */
.how {
  background: var(--bg-elev);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--surface);
}
@media (max-width: 900px) {
  .steps { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .steps { grid-template-columns: 1fr; }
}
.step {
  padding: 36px 28px;
  border-right: 1px solid var(--border);
  position: relative;
  transition: background .25s;
}
.step:last-child { border-right: none; }
@media (max-width: 900px) {
  .step:nth-child(2) { border-right: none; }
  .step:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
}
.step:hover { background: var(--surface-2); }

.step-num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}
.step-ico {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
  display: grid; place-items: center;
  color: var(--accent);
  margin-bottom: 20px;
}
.step-ico svg { width: 18px; height: 18px; }

.step h3 {
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.015em;
  margin-bottom: 8px;
}
.step p {
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.55;
  letter-spacing: -0.005em;
}

/* ═══════════════════════════ FEATURES ═══════════════════════════ */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
}
@media (max-width: 900px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .features-grid { grid-template-columns: 1fr; } }

.feat-card {
  background: var(--bg);
  padding: 32px 28px;
  position: relative;
  transition: background .25s;
}
.feat-card:hover { background: var(--surface); }

.feat-ico {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
  display: grid; place-items: center;
  color: var(--accent);
  margin-bottom: 24px;
}
.feat-ico svg { width: 16px; height: 16px; }

.feat-card h3 {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.015em;
  margin-bottom: 8px;
}
.feat-card p {
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.55;
  letter-spacing: -0.005em;
}

/* ═══════════════════════════ USE CASES ═══════════════════════════ */
.usecases {
  background: var(--bg-elev);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.uc-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  padding: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: fit-content;
}
.uc-tab {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13.5px;
  color: var(--text-2);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all .2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.005em;
}
.uc-tab svg { width: 14px; height: 14px; }
.uc-tab:hover { color: var(--text); }
.uc-tab.active {
  background: var(--bg);
  color: var(--text);
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
}

.uc-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  padding: 40px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  min-height: 380px;
}
@media (max-width: 900px) { .uc-panel { grid-template-columns: 1fr; padding: 28px; } }

.uc-content h3 {
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.025em;
  margin-bottom: 14px;
  line-height: 1.1;
}
.uc-content p {
  color: var(--text-2);
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 20px;
}
.uc-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.uc-list li {
  font-size: 13.5px;
  color: var(--text);
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.uc-list svg { width: 14px; height: 14px; color: var(--accent); margin-top: 4px; flex-shrink: 0; }

.uc-preview {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 300px;
}

/* ═══════════════════════════ PRICING ═══════════════════════════ */
.pricing {
  padding-bottom: 140px;
}

.billing-toggle {
  display: inline-flex;
  padding: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 100px;
  margin-bottom: 56px;
  gap: 2px;
}
.billing-toggle button {
  padding: 8px 20px;
  border-radius: 100px;
  border: none;
  background: transparent;
  color: var(--text-2);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.005em;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all .2s;
}
.billing-toggle button.active {
  background: var(--bg);
  color: var(--text);
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
}
.billing-toggle .save-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  background: var(--accent-soft);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 100px;
  letter-spacing: 0.03em;
}

.plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 900px) { .plans { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; } }

.plan {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all .3s;
}

.plan.featured {
  border-color: var(--border-strong);
  background: linear-gradient(180deg, color-mix(in oklab, var(--accent) 5%, var(--surface)) 0%, var(--surface) 50%);
  box-shadow: 0 20px 60px -30px color-mix(in oklab, var(--accent) 40%, transparent), inset 0 1px 0 0 var(--accent-line);
}

.plan-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--accent);
  color: var(--accent-ink);
  padding: 3px 10px;
  border-radius: 100px;
  font-weight: 500;
}

.plan-name {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 16px;
}
.plan-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 6px;
}
.plan-currency {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-2);
}
.plan-amount {
  font-family: var(--font-display);
  font-size: 52px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
}
.plan-period {
  font-size: 12.5px;
  color: var(--muted);
  font-family: var(--font-mono);
  letter-spacing: -0.005em;
}
.plan-desc {
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.55;
  margin: 20px 0;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.plan-feats {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  margin-bottom: 24px;
}
.plan-feats li {
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.5;
  letter-spacing: -0.005em;
}
.plan-feats svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 3px; }
.plan-feats .check { color: var(--accent); }
.plan-feats .cross { color: var(--muted); opacity: .5; }
.plan-feats li.muted { color: var(--muted); }

.btn-plan {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all .2s;
  letter-spacing: -0.005em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
}
.btn-plan.outline { background: transparent; color: var(--text); border: 1px solid var(--border-strong); }
.btn-plan.outline:hover { border-color: var(--text-2); background: var(--surface-2); }
.btn-plan.filled { background: var(--accent); color: var(--accent-ink); border: 1px solid var(--accent); }
.btn-plan.filled:hover { filter: brightness(1.08); }
.btn-plan svg { width: 14px; height: 14px; transition: transform .2s; }
.btn-plan:hover svg { transform: translateX(3px); }

.pricing-foot {
  text-align: center;
  margin-top: 32px;
  font-size: 12.5px;
  color: var(--muted);
  font-family: var(--font-mono);
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}
.pricing-foot span { display: inline-flex; align-items: center; gap: 6px; }
.pricing-foot svg { width: 12px; height: 12px; }

/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 900px) { .testimonials-grid { grid-template-columns: 1fr; } }

.testi {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all .25s;
}
.testi:hover { border-color: var(--border-strong); transform: translateY(-2px); }

.testi-quote svg {
  width: 24px; height: 24px;
  color: var(--accent);
  opacity: .6;
}
.testi-text {
  font-size: 14.5px;
  color: var(--text);
  line-height: 1.6;
  flex: 1;
  letter-spacing: -0.005em;
}
.testi-author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.testi-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 1px solid var(--border);
  display: grid; place-items: center;
  color: var(--text-2);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
}
.testi-name { font-size: 13.5px; font-weight: 500; letter-spacing: -0.005em; }
.testi-role { font-size: 11.5px; color: var(--muted); font-family: var(--font-mono); margin-top: 2px; }

/* ═══════════════════════════ FAQ ═══════════════════════════ */
.faq-wrap { max-width: 720px; margin: 0 auto; }
.faq-item {
  border-bottom: 1px solid var(--border);
}
.faq-q {
  width: 100%;
  background: none;
  border: none;
  color: var(--text);
  font-size: 15.5px;
  font-weight: 500;
  text-align: left;
  padding: 24px 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  letter-spacing: -0.01em;
  font-family: inherit;
  transition: color .2s;
}
.faq-q:hover { color: var(--accent); }
.faq-arrow {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid var(--border);
  display: grid; place-items: center;
  flex-shrink: 0;
  transition: all .3s;
  color: var(--text-2);
}
.faq-arrow svg { width: 12px; height: 12px; transition: transform .3s; }
.faq-item[data-open="true"] .faq-arrow { border-color: var(--accent); color: var(--accent); }
.faq-item[data-open="true"] .faq-arrow svg { transform: rotate(45deg); }
.faq-a {
  max-height: 0;
  overflow: hidden;
  transition: max-height .4s ease, padding .3s ease;
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.65;
  letter-spacing: -0.005em;
}
.faq-item[data-open="true"] .faq-a { max-height: 240px; padding: 0 0 24px; }

/* ═══════════════════════════ CTA FINAL ═══════════════════════════ */
.cta-final {
  text-align: center;
  padding: 140px 0;
  position: relative;
  overflow: hidden;
}
.cta-final::before {
  content:'';
  position:absolute; inset:0;
  background:
    radial-gradient(ellipse 60% 60% at 50% 100%, var(--accent-soft) 0%, transparent 70%);
  pointer-events:none;
}
.cta-final-inner { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }
.cta-final h2 {
  font-size: clamp(2.2rem, 4.5vw, 3.4rem);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.02;
  margin-bottom: 20px;
}
.cta-final h2 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--accent); }
.cta-final p {
  color: var(--text-2);
  font-size: 17px;
  margin-bottom: 36px;
  line-height: 1.55;
  letter-spacing: -0.008em;
}
.cta-final .actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }

/* ═══════════════════════════ FOOTER ═══════════════════════════ */
footer {
  border-top: 1px solid var(--border);
  padding: 48px 0 32px;
}
.footer-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: center;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}
@media (max-width: 700px) {
  .footer-inner { grid-template-columns: 1fr; text-align: center; justify-items: center; }
}
.footer-links { display: flex; gap: 28px; flex-wrap: wrap; }
.footer-links a {
  color: var(--text-2);
  font-size: 13px;
  transition: color .2s;
  letter-spacing: -0.005em;
}
.footer-links a:hover { color: var(--text); }
.footer-copy {
  padding-top: 24px;
  font-size: 12px;
  color: var(--muted);
  font-family: var(--font-mono);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

/* ═══════════════════════════ ANIMATIONS ═══════════════════════════ */
.fade-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .7s cubic-bezier(.2,.6,.2,1), transform .7s cubic-bezier(.2,.6,.2,1);
}
.fade-up.visible { opacity: 1; transform: translateY(0); }
.fade-up.delay-1 { transition-delay: .05s; }
.fade-up.delay-2 { transition-delay: .1s; }
.fade-up.delay-3 { transition-delay: .15s; }
`

type UCKey = 'salao' | 'clinica' | 'oficina' | 'estudio' | 'restaurante'

interface UCMessage {
  who: string
  text: string
}

interface UCData {
  title: string
  desc: string
  points: string[]
  preview: UCMessage[]
}

const UC_DATA: Record<UCKey, UCData> = {
  salao: {
    title: 'Salão de beleza',
    desc: 'Clientes agendando corte, coloração e outros serviços — muitas vezes à noite, quando você já fechou. A IA atende, consulta sua agenda no Google Calendar, sugere horários e confirma o agendamento.',
    points: [
      'Agendamento 24h sem perder um cliente',
      'Consulta disponibilidade no Google Calendar em tempo real',
      'Confirmação do horário diretamente pelo WhatsApp',
      'IA treinada com os serviços e horários do seu salão'
    ],
    preview: [
      { who: 'bot', text: 'Olá! Bem-vinda ao Salão Luxe ✨' },
      { who: 'user', text: 'Posso marcar uma mechas sábado?' },
      { who: 'bot', text: 'Temos 10h e 15h disponíveis. Qual prefere?' },
      { who: 'user', text: '15h' },
      { who: 'confirm', text: 'Confirmado — mechas, sábado 15h.' }
    ]
  },
  clinica: {
    title: 'Clínica médica',
    desc: 'Pacientes com dúvidas sobre disponibilidade e horários. A IA responde 24/7, agenda consultas no Google Calendar e confirma o atendimento pelo WhatsApp.',
    points: [
      'Agendamento de consultas 24h pelo WhatsApp',
      'Consulta de disponibilidade em tempo real',
      'Confirmação do agendamento no Google Calendar',
      'IA treinada com as informações do seu consultório'
    ],
    preview: [
      { who: 'bot', text: 'Olá! Clínica SorrisoBem. Como posso ajudar?' },
      { who: 'user', text: 'Quero marcar uma consulta' },
      { who: 'bot', text: 'Temos terça às 09:30 e quinta às 14h. Qual prefere?' },
      { who: 'user', text: 'Terça' },
      { who: 'confirm', text: 'Agendado — terça 09:30. Até lá!' }
    ]
  },
  oficina: {
    title: 'Oficina mecânica',
    desc: 'Clientes que querem agendar inspeção ou revisão pelo WhatsApp. A IA coleta informações básicas, verifica disponibilidade no calendário e confirma o horário.',
    points: [
      'Agendamento de inspeções e revisões 24h',
      'Coleta informações básicas do veículo e serviço',
      'Consulta disponibilidade no Google Calendar',
      'Confirmação automática pelo WhatsApp'
    ],
    preview: [
      { who: 'user', text: 'Meu carro tá fazendo um barulho estranho' },
      { who: 'bot', text: 'Entendi. Qual o modelo e ano?' },
      { who: 'user', text: 'Civic 2018' },
      { who: 'bot', text: 'Temos horário amanhã 14h para inspeção. Confirmo?' },
      { who: 'confirm', text: 'Inspeção Civic 2018 · amanhã 14h.' }
    ]
  },
  estudio: {
    title: 'Estúdio & academia',
    desc: 'Alunos consultando horários e querendo agendar aulas experimentais. A IA responde na hora, verifica disponibilidade e confirma o agendamento pelo WhatsApp.',
    points: [
      'Agendamento de aulas e experimentais 24h',
      'Consulta de horários disponíveis por modalidade',
      'Confirmação direta no Google Calendar',
      'IA treinada com a grade e serviços da sua academia'
    ],
    preview: [
      { who: 'user', text: 'Tem yoga à noite?' },
      { who: 'bot', text: 'Sim! Segunda, quarta e sexta às 19h.' },
      { who: 'user', text: 'Posso fazer uma aula experimental?' },
      { who: 'bot', text: 'Claro, posso marcar pra segunda 19h?' },
      { who: 'confirm', text: 'Aula experimental agendada. Até segunda!' }
    ]
  },
  restaurante: {
    title: 'Restaurante',
    desc: 'Clientes querendo fazer reservas pelo WhatsApp, a qualquer hora. A IA atende, verifica disponibilidade e confirma a reserva no Google Calendar.',
    points: [
      'Reservas 24h sem depender de ligação',
      'Verificação de disponibilidade em tempo real',
      'Confirmação automática pelo WhatsApp',
      'IA treinada com horários e informações do restaurante'
    ],
    preview: [
      { who: 'user', text: 'Mesa pra 4 sábado 20h?' },
      { who: 'bot', text: 'Temos disponibilidade. Confirmo a reserva?' },
      { who: 'user', text: 'Sim!' },
      { who: 'bot', text: 'Perfeito. Alguma restrição alimentar?' },
      { who: 'confirm', text: 'Reserva 4 pessoas · sábado 20h.' }
    ]
  }
}

const WAVE_HEIGHTS = [35, 68, 42, 75, 55, 80, 38, 65, 48, 72, 40, 85, 52, 70, 45, 60, 77, 35, 90, 43, 65, 50, 78, 38, 62, 85, 44, 70, 55, 80, 37, 67, 48, 75, 42, 88, 52, 64, 38, 73]

function UCPanel({ activeKey }: { activeKey: UCKey }) {
  const d = UC_DATA[activeKey]
  return (
    <>
      <div className="uc-content">
        <h3>{d.title}</h3>
        <p>{d.desc}</p>
        <ul className="uc-list">
          {d.points.map((p, i) => (
            <li key={i}>
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="uc-preview">
        {d.preview.map((m, i) => {
          if (m.who === 'confirm') {
            return (
              <div key={i} className="bubble confirm">
                <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>{m.text}</div>
              </div>
            )
          }
          return <div key={i} className={`bubble ${m.who}`}>{m.text}</div>
        })}
        <div className="typing"><i></i><i></i><i></i></div>
      </div>
    </>
  )
}

export default function LandingPage() {
  const [activeUC, setActiveUC] = useState<UCKey>('salao')
  const [billingMode, setBillingMode] = useState<'m' | 'a'>('m')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const prices: Record<string, { m: string; a: string }> = {
    starter: { m: '197', a: '158' },
    pro: { m: '397', a: '318' },
    business: { m: '697', a: '558' },
  }

  const periodText = billingMode === 'a' ? 'por mês · faturado anualmente' : 'por mês · faturado mensalmente'

  const waveformBars = useMemo(() => {
    return WAVE_HEIGHTS.map((h, i) => (
      <i key={i} style={{ animationDelay: `${i * 0.05}s`, height: `${h}%` }} />
    ))
  }, [])

  useEffect(() => {
    // Scroll animations
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up').forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqItems = [
    {
      q: 'Preciso saber programar para configurar?',
      a: 'Não. Você nos conta sobre seu negócio — serviços, horários, preços — e nossa equipe configura o agente para você. No plano Business, a ativação acontece em até 24h.'
    },
    {
      q: 'Como funciona a integração com o WhatsApp?',
      a: 'Conectamos ao seu número de WhatsApp via conexão direta. Seu número não muda, os clientes continuam falando normalmente — mas agora quem responde é a IA.'
    },
    {
      q: 'A IA responde em português do Brasil com qualidade?',
      a: 'Sim. Usamos modelos avançados de linguagem em pt-BR, com respostas naturais e contextuais. O agente é treinado com as informações do seu negócio para atender com o seu tom.'
    },
    {
      q: 'Posso cancelar quando quiser?',
      a: 'Sim, sem multas ou fidelidade mínima. Cancele a qualquer momento entrando em contato com nossa equipe.'
    }
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div data-theme="dark">

        {/* NAV */}
        <nav>
          <a href="/" className="logo">
            <span className="logo-mark">a</span>
            attende<span style={{ color: 'var(--muted)', fontWeight: 400 }}>.ai</span>
          </a>
          <ul className="nav-links">
            <li><a href="#como-funciona">Como funciona</a></li>
            <li><a href="#casos">Casos de uso</a></li>
            <li><a href="#recursos">Recursos</a></li>
            <li><a href="#precos">Preços</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
          <div className="nav-right">
            <a href="/login" className="nav-login-link">Entrar</a>
            <a href="/cadastro" className="nav-cta">
              Criar conta
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
                <span className="tag"><span className="dot" style={{ display: 'inline-block', marginRight: '4px' }}></span>live</span>
                IA em produção 24/7 no WhatsApp
              </div>

              <h1 className="hero-title">
                Seu negócio<br />
                nunca <em>para de</em><br />
                atender clientes.
              </h1>

              <p className="hero-sub">
                Um agente de IA que atende clientes pelo WhatsApp, agenda no Google Calendar, responde dúvidas e cuida dos clientes — enquanto você cuida do que importa.
              </p>

              <div className="hero-actions">
                <a href="#como-funciona" className="btn btn-ghost">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M5 3v10l8-5-8-5z" fill="currentColor"/></svg>
                  Ver demonstração
                </a>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <div className="k"><span className="accent">24</span>/7</div>
                  <div className="v">disponibilidade</div>
                </div>
                <div className="trust-item">
                  <div className="k"><span className="accent">98</span>%</div>
                  <div className="v">taxa de resposta</div>
                </div>
                <div className="trust-item">
                  <div className="k">R$<span className="accent">0</span></div>
                  <div className="v">custo por mensagem perdida</div>
                </div>
              </div>
            </div>

            <div className="hero-visual" data-variant="conversation" id="heroVisual">
              {/* V1: Conversation */}
              <div className="variant v-conversation">
                <div className="panel">
                  <div className="panel-head">
                    <div className="panel-head-left">
                      <div className="panel-avatar">
                        <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><path d="M12 2v4M8 18v3M16 18v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                      <div>
                        <div className="panel-title">Salão da Ana</div>
                        <div className="panel-sub">whatsapp · attendeai</div>
                      </div>
                    </div>
                    <div className="panel-status"><span className="dot"></span>online</div>
                  </div>
                  <div className="panel-body">
                    <div className="bubble bot">Olá! Bem-vinda ao Salão da Ana. Como posso ajudar hoje?</div>
                    <div className="bubble user">Quero agendar um corte pra sexta</div>
                    <div className="bubble bot">Perfeito! Temos horários às 10h, 14h e 16h na sexta. Qual prefere?</div>
                    <div className="bubble user">14h tá ótimo!</div>
                    <div className="bubble confirm">
                      <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <div>Agendado — sexta, 14h. Te envio um lembrete na véspera.</div>
                    </div>
                    <div className="typing"><i></i><i></i><i></i></div>
                  </div>
                </div>

              </div>

              {/* V2: Dashboard */}
              <div className="variant v-dashboard">
                <div className="dash-top">
                  <div className="dash-dots"><i></i><i></i><i></i></div>
                  <div className="dash-url">app.attende.ai / inbox</div>
                </div>
                <div className="dash-body">
                  <div className="dash-stats">
                    <div className="dash-stat">
                      <div className="l">Atendimentos</div>
                      <div className="n">247</div>
                      <div className="d">↗ 32% esta semana</div>
                    </div>
                    <div className="dash-stat">
                      <div className="l">Agendados</div>
                      <div className="n">89</div>
                      <div className="d">↗ 18%</div>
                    </div>
                    <div className="dash-stat">
                      <div className="l">Tempo médio</div>
                      <div className="n">1.4m</div>
                      <div className="d down">↘ 45%</div>
                    </div>
                  </div>
                  <div className="dash-chart">
                    <div className="dash-chart-hd">
                      <span className="l">Conversas por dia</span>
                      <span className="v">últimos 7 dias</span>
                    </div>
                    <svg viewBox="0 0 300 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3}/>
                          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <path d="M0,50 L40,38 L80,42 L120,25 L160,30 L200,15 L240,20 L300,8 L300,60 L0,60 Z" fill="url(#chartGrad)"/>
                      <path d="M0,50 L40,38 L80,42 L120,25 L160,30 L200,15 L240,20 L300,8" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </div>
                  <div className="dash-list">
                    <div className="dash-row">
                      <div className="ch"><svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.5"/></svg></div>
                      <div className="m"><div className="t">Maria Silva confirmou agendamento</div><div className="s">corte · sexta 14:00</div></div>
                      <div className="tm">2min</div>
                    </div>
                    <div className="dash-row">
                      <div className="ch"><svg viewBox="0 0 24 24" fill="none"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/></svg></div>
                      <div className="m"><div className="t">Chamada atendida · 2m 18s</div><div className="s">+55 11 9···· · belo horizonte</div></div>
                      <div className="tm">5min</div>
                    </div>
                    <div className="dash-row">
                      <div className="ch"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                      <div className="m"><div className="t">3 agendamentos criados</div><div className="s">google calendar · sincronizado</div></div>
                      <div className="tm">12min</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* V3: Phone */}
              <div className="variant v-phone">
                <div className="phone">
                  <div className="phone-screen">
                    <div className="phone-status">
                      <span>9:41</span>
                      <span>··· ▲</span>
                    </div>
                    <div className="phone-head">
                      <div className="av">A</div>
                      <div className="ti">
                        <div className="n">Salão da Ana</div>
                        <div className="s"><i></i> IA ativa · respondendo</div>
                      </div>
                    </div>
                    <div className="phone-body">
                      <div className="bubble bot">Olá! Como posso ajudar?</div>
                      <div className="bubble user">Agendar corte sexta</div>
                      <div className="bubble bot">10h, 14h ou 16h?</div>
                      <div className="bubble user">14h</div>
                      <div className="bubble confirm">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <div>Agendado!</div>
                      </div>
                      <div className="typing"><i></i><i></i><i></i></div>
                    </div>
                  </div>
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
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="how" id="como-funciona">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">Como funciona</div>
              <h2 className="section-title">Do contato ao agendamento em segundos.</h2>
              <p className="section-sub">Seu agente responde, entende e agenda — sem precisar de nenhuma ação sua.</p>
            </div>

            <div className="steps fade-up">
              <div className="step">
                <div className="step-num">01 / contato</div>
                <div className="step-ico"><svg viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg></div>
                <h3>Cliente entra em contato</h3>
                <p>Pelo WhatsApp, o agente atende imediatamente, a qualquer hora do dia ou da noite.</p>
              </div>
              <div className="step">
                <div className="step-num">02 / compreensão</div>
                <div className="step-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3a6 6 0 016 6c0 2-1 3-2 4v3a2 2 0 01-2 2h-4a2 2 0 01-2-2v-3c-1-1-2-2-2-4a6 6 0 016-6zM10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                <h3>IA entende e responde</h3>
                <p>O agente entende a intenção com linguagem natural, responde dúvidas e coleta as informações necessárias.</p>
              </div>
              <div className="step">
                <div className="step-num">03 / agendamento</div>
                <div className="step-ico"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Agenda automaticamente</h3>
                <p>Consulta o Google Calendar em tempo real e confirma o horário diretamente com o cliente.</p>
              </div>
              <div className="step">
                <div className="step-num">04 / confirmado</div>
                <div className="step-ico"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Agendamento salvo</h3>
                <p>O agendamento é registrado no Google Calendar e no painel. Você acompanha tudo em um só lugar, sem precisar fazer nada.</p>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="usecases" id="casos">
          <div className="wrap">
            <div className="section-head fade-up">
              <div className="eyebrow">Casos de uso</div>
              <h2 className="section-title">Feito para o ritmo do seu negócio.</h2>
              <p className="section-sub">Veja como a AttendeAI se adapta à rotina de diferentes segmentos — do salão de beleza à clínica médica.</p>
            </div>

            <div className="uc-tabs fade-up" id="ucTabs">
              {(['salao', 'clinica', 'oficina', 'estudio', 'restaurante'] as UCKey[]).map((key) => (
                <button
                  key={key}
                  className={`uc-tab${activeUC === key ? ' active' : ''}`}
                  onClick={() => setActiveUC(key)}
                >
                  {key === 'salao' && <svg viewBox="0 0 24 24" fill="none"><path d="M8 4l-2 8m12-8l2 8M6 12a6 6 0 0012 0M12 12v8M9 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {key === 'clinica' && <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                  {key === 'oficina' && <svg viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a4 4 0 00-5 5L3 18l3 3 6.7-6.7a4 4 0 005-5l-2.3 2.3-2.4-.7-.7-2.4 2.4-2.3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>}
                  {key === 'estudio' && <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>}
                  {key === 'restaurante' && <svg viewBox="0 0 24 24" fill="none"><path d="M5 3v18M5 3h3a4 4 0 010 8H5M19 3v18M19 3v6a3 3 0 003 3v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {key === 'salao' ? 'Salão de beleza' : key === 'clinica' ? 'Clínica médica' : key === 'oficina' ? 'Oficina' : key === 'estudio' ? 'Estúdio / Academia' : 'Restaurante'}
                </button>
              ))}
            </div>

            <div className="uc-panel fade-up" id="ucPanel">
              <UCPanel activeKey={activeUC} />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="recursos">
          <div className="wrap">
            <div className="section-head fade-up">
              <div className="eyebrow">Recursos</div>
              <h2 className="section-title">Tudo que um atendente profissional faz — e mais.</h2>
              <p className="section-sub">Sem folgas, sem hora extra, sem atestado. O melhor atendente do seu negócio custa menos que um almoço por dia.</p>
            </div>

            <div className="features-grid fade-up">
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg></div>
                <h3>WhatsApp inteligente</h3>
                <p>Responde mensagens com entendimento contextual, envia confirmações e conduz a conversa até o agendamento — de forma natural e automática.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                <h3>Agendamento em tempo real</h3>
                <p>Consulta disponibilidade, cria eventos, envia convites e dispara lembretes — tudo integrado direto ao seu Google Calendar.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg></div>
                <h3>Personalização total</h3>
                <p>Configure serviços, preços e horários de atendimento de forma simples. O agente aprende sobre seu negócio e atende com o tom certo.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18M7 16l4-4 4 4 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Painel de gestão</h3>
                <p>Agendamentos organizados num painel limpo. Visualize próximas visitas, histórico e status da conexão WhatsApp em um só lugar.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4M8 14h4M8 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                <h3>Histórico de agendamentos</h3>
                <p>Todos os agendamentos registrados e acessíveis no painel. Veja data, serviço e cliente — sem depender de cadernos ou planilhas.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Disponível 24/7</h3>
                <p>O agente nunca para. Atende clientes de madrugada, fins de semana e feriados sem custo adicional — e sem você precisar fazer nada.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="pricing how" id="precos">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">Planos e preços</div>
              <h2 className="section-title">Comece hoje. Cancele quando quiser.</h2>
              <p className="section-sub">Sem taxa de adesão, sem fidelidade. Só resultados.</p>
            </div>


            <div className="plans fade-up">
              {/* STARTER */}
              <div className="plan">
                <div className="plan-name">Starter</div>
                <div className="plan-price">
                  <span className="plan-currency">R$</span>
                  <span className="plan-amount">197</span>
                </div>
                <div className="plan-period">por mês · faturado mensalmente</div>
                <p className="plan-desc">Ideal para barbearias que querem automatizar o agendamento pelo WhatsApp.</p>
                <ul className="plan-feats">
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Agente IA no WhatsApp</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Agendamento no Google Calendar</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Verificação de disponibilidade em tempo real</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Confirmação automática pelo WhatsApp</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>1 número de WhatsApp</span></li>
                  <li className="muted"><svg className="cross" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span>Painel de gestão</span></li>
                  <li className="muted"><svg className="cross" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span>Onboarding dedicado</span></li>
                </ul>
                <a href="/cadastro?plano=starter" className="btn-plan outline">Começar agora <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              </div>

              {/* PRO */}
              <div className="plan featured">
                <div className="plan-badge">Mais popular</div>
                <div className="plan-name">Pro</div>
                <div className="plan-price">
                  <span className="plan-currency">R$</span>
                  <span className="plan-amount">397</span>
                </div>
                <div className="plan-period">por mês · faturado mensalmente</div>
                <p className="plan-desc">Para barbearias que querem automação completa com visibilidade total do negócio.</p>
                <ul className="plan-feats">
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Tudo do Starter</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Painel de gestão completo</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Histórico de agendamentos</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Status da conexão WhatsApp</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Configurações da barbearia</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Suporte por e-mail</span></li>
                  <li className="muted"><svg className="cross" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span>Onboarding dedicado</span></li>
                </ul>
                <a href="/cadastro?plano=pro" className="btn-plan filled">Começar agora <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              </div>

              {/* BUSINESS */}
              <div className="plan">
                <div className="plan-name">Business</div>
                <div className="plan-price">
                  <span className="plan-currency">R$</span>
                  <span className="plan-amount">697</span>
                </div>
                <div className="plan-period">por mês · faturado mensalmente</div>
                <p className="plan-desc">Para quem quer começar sem complicação — a gente configura tudo para você.</p>
                <ul className="plan-feats">
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Tudo do Pro</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Onboarding dedicado</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Configuração completa do agente</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Suporte prioritário via WhatsApp</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Ativação em até 24h</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Treinamento do agente personalizado</span></li>
                </ul>
                <a href="/cadastro?plano=business" className="btn-plan outline">Começar agora <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              </div>
            </div>

            <div className="pricing-foot">
              <span><svg viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2"/></svg> Pagamento 100% seguro</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="how" id="faq">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">Perguntas frequentes</div>
              <h2 className="section-title">Ainda tem dúvidas?</h2>
            </div>

            <div className="faq-wrap">
              {faqItems.map((item, index) => (
                <div key={index} className="faq-item fade-up" data-open={openFaq === index ? "true" : undefined}>
                  <button type="button" className="faq-q" onClick={(e) => { e.preventDefault(); toggleFaq(index) }}>
                    {item.q}
                    <span className="faq-arrow">
                      <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </span>
                  </button>
                  <div className="faq-a">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <div className="cta-final">
          <div className="wrap cta-final-inner fade-up">
            <div className="eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>Comece agora</div>
            <h2>Seu próximo cliente está <em>tentando</em> te contatar agora.</h2>
            <p>Enquanto você dorme, descansa ou está ocupado, a AttendeAI garante que nenhum cliente fique sem resposta.</p>
            <div className="actions">
              <a href="https://wa.me/5534999819748" className="btn btn-ghost"><svg viewBox="0 0 16 16" fill="none"><path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> Falar com um humano</a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer>
          <div className="wrap">
            <div className="footer-inner">
              <div className="logo" style={{ fontSize: '16px' }}>
                <span className="logo-mark">a</span>
                attende<span style={{ color: 'var(--muted)', fontWeight: 400 }}>.ai</span>
              </div>
              <div className="footer-links">
                <a href="#">Termos</a>
                <a href="#">Privacidade</a>
                <a href="#">Suporte</a>
                <a href="#">Blog</a>
                <a href="#">Fale conosco</a>
              </div>
            </div>
            <div className="wrap footer-copy">
              <span>© 2026 AttendeAI</span>
              <span>feito no brasil 🇧🇷</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
