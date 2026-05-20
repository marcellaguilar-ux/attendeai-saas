'use client'
import { useEffect, useMemo, useState } from 'react'
import { t, type Locale } from '@/lib/i18n'

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
  /* ── Base palette ── */
  --bg: #ffffff;
  --bg-elev: #fafafa;
  --surface: #ffffff;
  --surface-2: #f5f5f3;
  --border: #e6e6e2;
  --border-strong: #d0d0ca;
  /* ── Text hierarchy — key to good light mode ── */
  --text: #111318;
  --text-2: #3c4249;
  --muted: #6b7580;
  /* ── Accent tuned for light: slightly deeper for WCAG AA ── */
  --accent: #00b67a;
  --accent-ink: #fff;
  --accent-soft: rgba(0, 182, 122, 0.08);
  --accent-line: rgba(0, 182, 122, 0.25);
  --danger: #e5484d;
  --info: #3b82f6;
  color-scheme: light;
  /* ── Override inherited body values ── */
  background: #ffffff;
  color: #111318;
}

/* ═══════════════ LIGHT MODE OVERRIDES ═══════════════ */

/* ── Remove grain — it muddies light backgrounds ── */
[data-theme="light"] body::before { display: none; }

/* ── Hero ── */
[data-theme="light"] .hero-bg {
  background:
    radial-gradient(ellipse 55% 55% at 65% 30%, rgba(0,182,122,.05) 0%, transparent 70%),
    radial-gradient(ellipse 50% 50% at 25% 85%, rgba(59,130,246,.03) 0%, transparent 65%) !important;
}
[data-theme="light"] .hero-grid {
  opacity: .12;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
}
[data-theme="light"] h1.hero-title { color: #111318; }
[data-theme="light"] h1.hero-title em { color: #00a06c; }
[data-theme="light"] .hero-sub { color: #3c4249; }
[data-theme="light"] .hero-pill { background: #f5f5f3; border-color: #e6e6e2; color: #3c4249; }
[data-theme="light"] .hero-pill .tag { background: rgba(0,182,122,.08); color: #00865c; border-color: rgba(0,182,122,.2); }
[data-theme="light"] .hero-pill .dot { background: #00b67a; box-shadow: 0 0 0 3px rgba(0,182,122,.15); }
[data-theme="light"] .trust-item .k { color: #111318; }
[data-theme="light"] .trust-item .v { color: #6b7580; }

/* ── Nav: frosted glass ── */
[data-theme="light"] nav {
  background: rgba(255,255,255,.82);
  border-color: rgba(0,0,0,.06);
  box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.04);
}
[data-theme="light"] .nav-links a { color: #3c4249; }
[data-theme="light"] .nav-links a:hover { color: #111318; background: #f5f5f3; }
[data-theme="light"] .nav-login-link { color: #3c4249; }
[data-theme="light"] .nav-login-link:hover { color: #111318; }
[data-theme="light"] .nav-cta { background: #00b67a; color: #fff; }
[data-theme="light"] .logo { color: #111318; }

/* ── Panels (hero conversation) ── */
[data-theme="light"] .panel {
  background: #ffffff;
  border-color: #e6e6e2;
  box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 8px 32px -8px rgba(0,0,0,.08);
}
[data-theme="light"] .panel-head { border-bottom-color: #eeeeea; }
[data-theme="light"] .panel-title { color: #111318; }
[data-theme="light"] .panel-sub { color: #6b7580; }
[data-theme="light"] .panel-status { color: #00865c; }
[data-theme="light"] .panel-status .dot { background: #00b67a; box-shadow: 0 0 0 3px rgba(0,182,122,.15); }
[data-theme="light"] .panel-avatar { background: rgba(0,182,122,.08); border-color: rgba(0,182,122,.2); color: #00865c; }

/* ── Bubbles ── */
[data-theme="light"] .bubble.bot {
  background: #f0faf5;
  border-color: #d0eddf;
  color: #111318;
}
[data-theme="light"] .bubble.user {
  background: #f5f5f3;
  border-color: #e6e6e2;
  color: #111318;
}
[data-theme="light"] .bubble.confirm {
  background: #e8f8f0;
  border-color: #c0e8d4;
  color: #111318;
}
[data-theme="light"] .bubble.confirm div { color: #111318; }
[data-theme="light"] .bubble.confirm svg { color: #00865c; }

/* ── Typing dots ── */
[data-theme="light"] .typing {
  background: #f0faf5;
  border-color: #d0eddf;
}
[data-theme="light"] .typing i { background: #00b67a; }

/* ── Dashboard visual ── */
[data-theme="light"] .v-dashboard {
  border-color: #e6e6e2;
  box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 16px 48px -16px rgba(0,0,0,.08);
}
[data-theme="light"] .dash-top { border-bottom-color: #eeeeea; }
[data-theme="light"] .dash-dots i { background: #d0d0ca; }
[data-theme="light"] .dash-url { background: #f5f5f3; color: #6b7580; }
[data-theme="light"] .dash-stat { background: #fafafa; border-color: #e6e6e2; }
[data-theme="light"] .dash-stat .n { color: #111318; }
[data-theme="light"] .dash-chart { background: #fafafa; border-color: #e6e6e2; }
[data-theme="light"] .dash-row { background: #fafafa; border-color: #e6e6e2; }

/* ── Phone ── */
[data-theme="light"] .phone {
  background: #e8e8e4;
  border-color: #d0d0ca;
  box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 24px 56px -16px rgba(0,0,0,.1);
}
[data-theme="light"] .phone::before { background: #c0c0ba; }
[data-theme="light"] .phone-screen { background: #ffffff; }
[data-theme="light"] .phone-head { border-bottom-color: #eeeeea; }
[data-theme="light"] .phone-head .av { background: #00b67a; color: #fff; }
[data-theme="light"] .phone-head .ti .n { color: #111318; }
[data-theme="light"] .phone-head .ti .s { color: #00865c; }
[data-theme="light"] .phone-body .bubble { font-size: 12px; }

/* ── Call panel ── */
[data-theme="light"] .call-panel { background: #fff; border-color: #e6e6e2; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
[data-theme="light"] .call-ico { background: rgba(59,130,246,.06); border-color: rgba(59,130,246,.15); color: #3b82f6; }

/* ── Logos section ── */
[data-theme="light"] .logos-section { border-color: #eeeeea; }
[data-theme="light"] .logo-item { color: #6b7580; }
[data-theme="light"] .logo-item:hover { color: #111318; }

/* ── How it works (steps) ── */
[data-theme="light"] .how { background: #fafafa; border-color: #eeeeea; }
[data-theme="light"] .steps { background: #fff; border-color: #e6e6e2; }
[data-theme="light"] .step { border-right-color: #eeeeea; }
[data-theme="light"] .step:hover { background: #fafafa; }

/* ── Feature cards ── */
[data-theme="light"] .features-grid { background: #e6e6e2; border-color: #e6e6e2; }
[data-theme="light"] .feat-card { background: #ffffff; }
[data-theme="light"] .feat-card:hover { background: #fafafa; }

/* ── Use cases ── */
[data-theme="light"] .usecases { background: #fafafa; border-color: #eeeeea; }
[data-theme="light"] .uc-tabs { background: #fff; border-color: #e6e6e2; }
[data-theme="light"] .uc-tab { color: #6b7580; }
[data-theme="light"] .uc-tab:hover { color: #111318; }
[data-theme="light"] .uc-tab.active { background: #f5f5f3; color: #111318; box-shadow: 0 1px 2px rgba(0,0,0,.06); }
[data-theme="light"] .uc-panel { background: #fff; border-color: #e6e6e2; }
[data-theme="light"] .uc-preview { background: #fafafa; border-color: #e6e6e2; }

/* ── Pricing ── */
[data-theme="light"] .billing-toggle { background: #f5f5f3; border-color: #e6e6e2; }
[data-theme="light"] .billing-toggle button { color: #6b7580; }
[data-theme="light"] .billing-toggle button.active { background: #fff; color: #111318; box-shadow: 0 1px 2px rgba(0,0,0,.06); }
[data-theme="light"] .plan { background: #fff; border-color: #e6e6e2; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
[data-theme="light"] .plan:hover { box-shadow: 0 4px 16px rgba(0,0,0,.06); }
[data-theme="light"] .plan.featured {
  background: linear-gradient(180deg, rgba(0,182,122,.03) 0%, #fff 40%);
  border-color: rgba(0,182,122,.35);
  box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 12px 40px -12px rgba(0,182,122,.1);
}
[data-theme="light"] .plan-amount { color: #111318; }
[data-theme="light"] .btn-plan.outline { border-color: #d0d0ca; color: #111318; }
[data-theme="light"] .btn-plan.outline:hover { background: #f5f5f3; border-color: #6b7580; }
[data-theme="light"] .btn-plan.filled { background: #00b67a; color: #fff; border-color: #00b67a; }

/* ── Testimonials ── */
[data-theme="light"] .testi { background: #fff; border-color: #e6e6e2; box-shadow: 0 1px 2px rgba(0,0,0,.03); }
[data-theme="light"] .testi:hover { box-shadow: 0 4px 16px rgba(0,0,0,.06); border-color: #d0d0ca; }
[data-theme="light"] .testi-text { color: #3c4249; }
[data-theme="light"] .testi-author { border-top-color: #eeeeea; }

/* ── FAQ ── */
[data-theme="light"] .faq-item { border-bottom-color: #eeeeea; }
[data-theme="light"] .faq-q { color: #111318; }
[data-theme="light"] .faq-q:hover { color: #00865c; }
[data-theme="light"] .faq-arrow { border-color: #e6e6e2; color: #6b7580; }
[data-theme="light"] .faq-a { color: #3c4249; }

/* ── CTA buttons ── */
[data-theme="light"] .btn-primary {
  background: #00b67a; color: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 4px 12px -4px rgba(0,182,122,.25);
}
[data-theme="light"] .btn-ghost {
  background: #fff;
  border-color: #d0d0ca;
  color: #111318;
}
[data-theme="light"] .btn-ghost:hover { background: #f5f5f3; border-color: #6b7580; }

/* ── CTA final section ── */
[data-theme="light"] .cta-final::before {
  background: radial-gradient(ellipse 60% 60% at 50% 100%, rgba(0,182,122,.04) 0%, transparent 70%);
}

/* ── Footer / section titles ── */
[data-theme="light"] .section-title { color: #111318; }
[data-theme="light"] .section-sub { color: #3c4249; }
[data-theme="light"] .eyebrow { color: #6b7580; }

/* ── Selection ── */
[data-theme="light"] ::selection { background: #00b67a; color: #fff; }

/* ── Waveform ── */
[data-theme="light"] .waveform i { background: #00b67a; opacity: .5; }

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
/* light grain handled above */

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

/* Theme toggle */
.theme-toggle {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-2);
  display: grid; place-items: center;
  cursor: pointer;
  transition: all .2s;
  flex-shrink: 0;
}
.theme-toggle:hover { border-color: var(--border-strong); color: var(--text); background: var(--surface-2); }
.theme-toggle svg { width: 15px; height: 15px; }

/* Language selector */
.lang-selector {
  display: flex;
  gap: 1px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 2px;
}
.lang-btn {
  padding: 5px 10px;
  border-radius: 100px;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: all .2s;
}
.lang-btn:hover { color: var(--text); }
.lang-btn.active { background: var(--bg); color: var(--text); box-shadow: 0 1px 2px rgba(0,0,0,.15); }
[data-theme="light"] .lang-btn.active { background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.06); }

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

const WAVE_HEIGHTS = [35, 68, 42, 75, 55, 80, 38, 65, 48, 72, 40, 85, 52, 70, 45, 60, 77, 35, 90, 43, 65, 50, 78, 38, 62, 85, 44, 70, 55, 80, 37, 67, 48, 75, 42, 88, 52, 64, 38, 73]

const FEAT_ICONS = [
  <svg key={0} viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  <svg key={1} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  <svg key={2} viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  <svg key={3} viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18M7 16l4-4 4 4 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key={4} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4M8 14h4M8 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  <svg key={5} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
]

const STEP_ICONS = [
  <svg key={0} viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>,
  <svg key={1} viewBox="0 0 24 24" fill="none"><path d="M12 3a6 6 0 016 6c0 2-1 3-2 4v3a2 2 0 01-2 2h-4a2 2 0 01-2-2v-3c-1-1-2-2-2-4a6 6 0 016-6zM10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  <svg key={2} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key={3} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
]

const UC_TAB_ICONS = [
  <svg key={0} viewBox="0 0 24 24" fill="none"><path d="M8 4l-2 8m12-8l2 8M6 12a6 6 0 0012 0M12 12v8M9 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key={1} viewBox="0 0 24 24" fill="none"><path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  <svg key={2} viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a4 4 0 00-5 5L3 18l3 3 6.7-6.7a4 4 0 005-5l-2.3 2.3-2.4-.7-.7-2.4 2.4-2.3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  <svg key={3} viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>,
  <svg key={4} viewBox="0 0 24 24" fill="none"><path d="M5 3v18M5 3h3a4 4 0 010 8H5M19 3v18M19 3v6a3 3 0 003 3v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
]

function UCPanel({ activeKey, i }: { activeKey: UCKey; i: ReturnType<typeof t> }) {
  const d = i.useCases[activeKey]
  return (
    <>
      <div className="uc-content">
        <h3>{d.title}</h3>
        <p>{d.desc}</p>
        <ul className="uc-list">
          {d.points.map((p, idx) => (
            <li key={idx}>
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="uc-preview">
        {d.preview.map((m, idx) => {
          if (m.who === 'confirm') {
            return (
              <div key={idx} className="bubble confirm">
                <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>{m.text}</div>
              </div>
            )
          }
          return <div key={idx} className={`bubble ${m.who}`}>{m.text}</div>
        })}
        <div className="typing"><i></i><i></i><i></i></div>
      </div>
    </>
  )
}

export default function LandingPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [locale, setLocale] = useState<Locale>('pt')
  const [activeUC, setActiveUC] = useState<UCKey>('salao')
  const [billingMode, setBillingMode] = useState<'m' | 'a'>('m')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved) setLocale(saved)
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
  }

  function changeLocale(l: Locale) {
    setLocale(l)
    localStorage.setItem('locale', l)
  }

  const i = t(locale)

  const periodText = billingMode === 'a' ? i.pricing.periodAnnual : i.pricing.periodMonthly

  const waveformBars = useMemo(() => {
    return WAVE_HEIGHTS.map((h, idx) => (
      <i key={idx} style={{ animationDelay: `${idx * 0.05}s`, height: `${h}%` }} />
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

  const UC_KEYS: UCKey[] = ['salao', 'clinica', 'oficina', 'estudio', 'restaurante']

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div data-theme={theme}>

        {/* NAV */}
        <nav>
          <a href="/" className="logo">
            <span className="logo-mark">a</span>
            attende<span style={{ color: 'var(--muted)', fontWeight: 400 }}>.ai</span>
          </a>
          <ul className="nav-links">
            <li><a href="#como-funciona">{i.nav.howItWorks}</a></li>
            <li><a href="#casos">{i.nav.useCases}</a></li>
            <li><a href="#recursos">{i.nav.features}</a></li>
            <li><a href="#precos">{i.nav.pricing}</a></li>
            <li><a href="#faq">{i.nav.faq}</a></li>
          </ul>
          <div className="nav-right">
            <div className="lang-selector">
              {(['pt','en','es'] as Locale[]).map(l => (
                <button key={l} className={`lang-btn${locale === l ? ' active' : ''}`} onClick={() => changeLocale(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Alternar tema">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <a href="/login" className="nav-login-link">{i.nav.login}</a>
            <a href="/cadastro" className="nav-cta">
              {i.nav.signup}
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
                {i.hero.pill}
              </div>

              <h1 className="hero-title">
                {i.hero.title1}<br />
                {i.hero.title2} <em>{i.hero.titleEm}</em><br />
                {i.hero.title3}
              </h1>

              <p className="hero-sub">
                {i.hero.sub}
              </p>

              <div className="hero-actions">
                <a href="#como-funciona" className="btn btn-ghost">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M5 3v10l8-5-8-5z" fill="currentColor"/></svg>
                  {i.hero.cta}
                </a>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <div className="k"><span className="accent">24</span>/7</div>
                  <div className="v">{i.hero.trustAvailability}</div>
                </div>
                <div className="trust-item">
                  <div className="k"><span className="accent">98</span>%</div>
                  <div className="v">{i.hero.trustResponseRate}</div>
                </div>
                <div className="trust-item">
                  <div className="k">R$<span className="accent">0</span></div>
                  <div className="v">{i.hero.trustCostPerMissed}</div>
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
                        <div className="panel-title">{i.heroConversation.brandName}</div>
                        <div className="panel-sub">{i.heroConversation.subtitle}</div>
                      </div>
                    </div>
                    <div className="panel-status"><span className="dot"></span>{i.heroConversation.online}</div>
                  </div>
                  <div className="panel-body">
                    <div className="bubble bot">{i.heroConversation.bot1}</div>
                    <div className="bubble user">{i.heroConversation.user1}</div>
                    <div className="bubble bot">{i.heroConversation.bot2}</div>
                    <div className="bubble user">{i.heroConversation.user2}</div>
                    <div className="bubble confirm">
                      <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <div>{i.heroConversation.confirm}</div>
                    </div>
                    <div className="typing"><i></i><i></i><i></i></div>
                  </div>
                </div>

              </div>

              {/* V2: Dashboard */}
              <div className="variant v-dashboard">
                <div className="dash-top">
                  <div className="dash-dots"><i></i><i></i><i></i></div>
                  <div className="dash-url">{i.heroDashboard.inboxUrl}</div>
                </div>
                <div className="dash-body">
                  <div className="dash-stats">
                    <div className="dash-stat">
                      <div className="l">{i.heroDashboard.attendances}</div>
                      <div className="n">247</div>
                      <div className="d">{i.heroDashboard.attendancesChange}</div>
                    </div>
                    <div className="dash-stat">
                      <div className="l">{i.heroDashboard.scheduled}</div>
                      <div className="n">89</div>
                      <div className="d">{i.heroDashboard.scheduledChange}</div>
                    </div>
                    <div className="dash-stat">
                      <div className="l">{i.heroDashboard.avgTime}</div>
                      <div className="n">1.4m</div>
                      <div className="d down">{i.heroDashboard.avgTimeChange}</div>
                    </div>
                  </div>
                  <div className="dash-chart">
                    <div className="dash-chart-hd">
                      <span className="l">{i.heroDashboard.chartTitle}</span>
                      <span className="v">{i.heroDashboard.chartSub}</span>
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
                      <div className="m"><div className="t">{i.heroDashboard.event1Title}</div><div className="s">{i.heroDashboard.event1Sub}</div></div>
                      <div className="tm">2min</div>
                    </div>
                    <div className="dash-row">
                      <div className="ch"><svg viewBox="0 0 24 24" fill="none"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/></svg></div>
                      <div className="m"><div className="t">{i.heroDashboard.event2Title}</div><div className="s">{i.heroDashboard.event2Sub}</div></div>
                      <div className="tm">5min</div>
                    </div>
                    <div className="dash-row">
                      <div className="ch"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                      <div className="m"><div className="t">{i.heroDashboard.event3Title}</div><div className="s">{i.heroDashboard.event3Sub}</div></div>
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
                        <div className="n">{i.heroPhone.brandName}</div>
                        <div className="s"><i></i> {i.heroPhone.status}</div>
                      </div>
                    </div>
                    <div className="phone-body">
                      <div className="bubble bot">{i.heroPhone.bot1}</div>
                      <div className="bubble user">{i.heroPhone.user1}</div>
                      <div className="bubble bot">{i.heroPhone.bot2}</div>
                      <div className="bubble user">{i.heroPhone.user2}</div>
                      <div className="bubble confirm">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <div>{i.heroPhone.confirm}</div>
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
            <div className="logos-label">{i.logos.heading}</div>
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
              <div className="eyebrow">{i.howItWorks.eyebrow}</div>
              <h2 className="section-title">{i.howItWorks.title}</h2>
              <p className="section-sub">{i.howItWorks.sub}</p>
            </div>

            <div className="steps fade-up">
              {i.howItWorks.steps.map((step, idx) => (
                <div className="step" key={idx}>
                  <div className="step-num">{step.num} / {step.label}</div>
                  <div className="step-ico">{STEP_ICONS[idx]}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="usecases" id="casos">
          <div className="wrap">
            <div className="section-head fade-up">
              <div className="eyebrow">{i.useCases.eyebrow}</div>
              <h2 className="section-title">{i.useCases.title}</h2>
              <p className="section-sub">{i.useCases.sub}</p>
            </div>

            <div className="uc-tabs fade-up" id="ucTabs">
              {UC_KEYS.map((key, index) => (
                <button
                  key={key}
                  className={`uc-tab${activeUC === key ? ' active' : ''}`}
                  onClick={() => setActiveUC(key)}
                >
                  {UC_TAB_ICONS[index]}
                  {i.useCases.tabs[index]}
                </button>
              ))}
            </div>

            <div className="uc-panel fade-up" id="ucPanel">
              <UCPanel activeKey={activeUC} i={i} />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="recursos">
          <div className="wrap">
            <div className="section-head fade-up">
              <div className="eyebrow">{i.features.eyebrow}</div>
              <h2 className="section-title">{i.features.title}</h2>
              <p className="section-sub">{i.features.sub}</p>
            </div>

            <div className="features-grid fade-up">
              {i.features.cards.map((card, idx) => (
                <div className="feat-card" key={idx}>
                  <div className="feat-ico">{FEAT_ICONS[idx]}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="pricing how" id="precos">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">{i.pricing.eyebrow}</div>
              <h2 className="section-title">{i.pricing.title}</h2>
              <p className="section-sub">{i.pricing.sub}</p>
            </div>


            <div className="plans fade-up">
              {i.pricing.plans.map((plan, idx) => (
                <div className={`plan${plan.popular ? ' featured' : ''}`} key={idx}>
                  {plan.popular && <div className="plan-badge">{i.pricing.badge}</div>}
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-price">
                    <span className="plan-amount">{billingMode === 'a' ? plan.priceAnnual : plan.price}</span>
                  </div>
                  <div className="plan-period">{periodText}</div>
                  <p className="plan-desc">{plan.desc}</p>
                  <ul className="plan-feats">
                    {plan.features.map((feat, fi) => (
                      <li key={fi}>
                        <svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={`/cadastro?plano=${['starter','pro','business'][idx]}`} className={`btn-plan ${plan.popular ? 'filled' : 'outline'}`}>
                    {plan.cta} <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                </div>
              ))}
            </div>

            <div className="pricing-foot">
              <span><svg viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2"/></svg> {i.pricing.footer}</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="how" id="faq">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">{i.faq.eyebrow}</div>
              <h2 className="section-title">{i.faq.title}</h2>
            </div>

            <div className="faq-wrap">
              {i.faq.items.map((item, index) => (
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
            <div className="eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>{i.ctaFinal.eyebrow}</div>
            <h2>{i.ctaFinal.titleStart} <em>{i.ctaFinal.titleEm}</em> {i.ctaFinal.titleEnd}</h2>
            <p>{i.ctaFinal.sub}</p>
            <div className="actions">
              <a href="https://wa.me/5534999819748" className="btn btn-ghost"><svg viewBox="0 0 16 16" fill="none"><path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> {i.ctaFinal.cta}</a>
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
                <a href="#">{i.footer.terms}</a>
                <a href="#">{i.footer.privacy}</a>
                <a href="#">{i.footer.support}</a>
                <a href="#">{i.footer.blog}</a>
                <a href="#">{i.footer.contact}</a>
                <a href="https://www.instagram.com/attendeai.ia" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              </div>
            </div>
            <div className="wrap footer-copy">
              <span>{i.footer.copyright}</span>
              <span>{i.footer.madeIn}</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
