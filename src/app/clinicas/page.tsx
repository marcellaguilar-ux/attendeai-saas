'use client'
import { useEffect, useMemo, useState } from 'react'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&family=Instrument+Serif&display=swap');

/* TOKENS */
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
  --accent-soft: rgba(0, 229, 160, 0.08);
  --accent-line: rgba(0, 229, 160, 0.22);
  --danger: #ff6079;
  --info: #5b9cff;
  --font-sans: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', 'SF Mono', Menlo, monospace;
  --font-display: 'Geist', sans-serif;
  --container: 1200px;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 18px;
  --r-xl: 24px;
  color-scheme: dark;
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

body::before {
  content:'';
  position:fixed; inset:0; z-index:9999;
  pointer-events:none;
  opacity: .35;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* LAYOUT */
.wrap { max-width: var(--container); margin: 0 auto; padding: 0 32px; }
@media (max-width: 700px) { .wrap { padding: 0 20px; } }
section { padding: 120px 0; position: relative; }
.section-head { max-width: 640px; margin-bottom: 72px; }
.section-head.center { margin-left:auto; margin-right:auto; text-align:center; }

/* TYPE */
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

/* NAV */
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

/* BUTTONS */
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

/* HERO */
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

/* HERO VISUAL */
.hero-visual { position: relative; min-height: 520px; }

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

/* LOGOS */
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

/* HOW IT WORKS */
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

/* FEATURES */
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

/* USE CASES */
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

/* PAIN POINTS */
.pain-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 900px) { .pain-grid { grid-template-columns: 1fr; } }
.pain-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 28px;
  transition: all .25s;
}
.pain-card:hover { border-color: var(--border-strong); transform: translateY(-2px); }
.pain-ico {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: color-mix(in oklab, var(--danger) 12%, transparent);
  border: 1px solid color-mix(in oklab, var(--danger) 25%, transparent);
  display: grid; place-items: center;
  color: var(--danger);
  margin-bottom: 20px;
}
.pain-ico svg { width: 18px; height: 18px; }
.pain-card h3 {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.015em;
  margin-bottom: 8px;
}
.pain-card p {
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.55;
}

/* DEMO */
.demo-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 48px;
  flex-wrap: wrap;
}
.demo-phone {
  width: 360px;
  height: 680px;
  background: #0b141a;
  border-radius: 36px;
  border: 2px solid var(--border-strong);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  position: relative;
  flex-shrink: 0;
}
.demo-chat-header {
  background: #1f2c34;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #2a3942;
  min-height: 58px;
}
.demo-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #008f6f);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 14px; flex-shrink: 0;
}
.demo-header-name { color: #e9edef; font-size: 15px; font-weight: 500; }
.demo-header-status { color: #8696a0; font-size: 11px; }
.demo-header-status.online { color: var(--accent); }
.demo-chat-body {
  flex: 1; overflow-y: auto; padding: 12px 16px;
  background: #0b141a; display: flex; flex-direction: column; gap: 4px;
  scroll-behavior: smooth;
}
.demo-msg {
  max-width: 82%; padding: 8px 12px; border-radius: 8px;
  font-size: 13.5px; line-height: 1.4; word-wrap: break-word;
  animation: demoFadeIn 0.3s ease;
}
@keyframes demoFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.demo-msg.received { background: #1f2c34; color: #e9edef; align-self: flex-start; border-top-left-radius: 0; }
.demo-msg.sent { background: #005c4b; color: #e9edef; align-self: flex-end; border-top-right-radius: 0; }
.demo-msg .dm-time { font-size: 10px; color: #8696a0; float: right; margin-left: 8px; margin-top: 4px; }
.demo-msg.sent .dm-time { color: #7fb8a8; }
.demo-msg .dm-check { color: #53bdeb; margin-left: 2px; }
.demo-typing {
  align-self: flex-start; background: #1f2c34; border-radius: 8px;
  border-top-left-radius: 0; padding: 12px 16px; display: none; gap: 4px; align-items: center;
}
.demo-typing.visible { display: flex; }
.demo-typing-dot {
  width: 6px; height: 6px; background: #8696a0; border-radius: 50%;
  animation: demoTyping 1.4s ease-in-out infinite;
}
.demo-typing-dot:nth-child(2) { animation-delay: .2s; }
.demo-typing-dot:nth-child(3) { animation-delay: .4s; }
@keyframes demoTyping {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-5px); }
}
.demo-input-bar {
  background: #1f2c34; padding: 8px 12px; display: flex; align-items: center; gap: 8px;
  border-top: 1px solid #2a3942;
}
.demo-input-bar input {
  flex: 1; background: #2a3942; border: none; border-radius: 20px;
  padding: 8px 14px; color: #e9edef; font-size: 13px; outline: none;
}
.demo-input-bar input::placeholder { color: #8696a0; }
.demo-progress {
  position: absolute; bottom: 0; left: 0; height: 3px; width: 100%;
  background: var(--accent); transition: transform 0.4s ease; z-index: 2;
  transform: scaleX(0); transform-origin: left;
}
.demo-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 3; cursor: pointer; transition: opacity 0.4s;
}
.demo-overlay.hidden { opacity: 0; pointer-events: none; }
.demo-overlay-title { font-size: 16px; color: var(--text); font-weight: 600; margin-bottom: 6px; }
.demo-overlay-sub { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
.demo-play-btn {
  width: 56px; height: 56px; border-radius: 50%; background: var(--accent);
  border: none; color: var(--accent-ink); font-size: 22px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(0,229,160,0.3); transition: transform .2s;
}
.demo-play-btn:hover { transform: scale(1.1); }
.demo-overlay-hint { font-size: 11px; color: var(--muted); margin-top: 14px; }
.demo-date { text-align: center; margin: 8px 0; }
.demo-date span { background: #182229; color: #8696a0; font-size: 11px; padding: 3px 10px; border-radius: 6px; }

.demo-side {
  max-width: 380px; flex: 1; min-width: 260px;
  display: flex; flex-direction: column; gap: 20px; padding-top: 20px;
}
.demo-step-card {
  background: var(--surface); border-radius: var(--r-md);
  padding: 24px; border: 1px solid var(--border-strong);
  min-height: 100px; transition: opacity 0.3s;
}
.demo-step-card .ds-title { font-size: 15px; font-weight: 600; color: var(--accent); margin-bottom: 6px; }
.demo-step-card .ds-desc { font-size: 14px; color: var(--text-2); line-height: 1.5; }
.demo-nav-hint { font-size: 12px; color: var(--muted); text-align: center; }
.demo-nav-hint kbd {
  background: var(--surface-2); padding: 2px 6px; border-radius: 4px;
  font-size: 11px; color: var(--text-2); font-family: var(--font-mono);
}
.demo-restart-btn {
  background: transparent; border: 1px solid var(--border-strong); color: var(--text-2);
  padding: 8px 16px; border-radius: 8px; font-size: 12px; cursor: pointer;
  font-family: var(--font-mono); transition: all .2s; align-self: center;
}
.demo-restart-btn:hover { border-color: var(--accent); color: var(--accent); }

@media (max-width: 800px) {
  .demo-container { flex-direction: column; align-items: center; }
  .demo-phone { width: 340px; height: 620px; }
  .demo-side { max-width: 360px; padding-top: 24px; }
}
@media (max-width: 400px) {
  .demo-phone { width: 300px; height: 560px; }
}

/* PRICING */
.pricing {
  padding-bottom: 140px;
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

/* SDR - PROSPECCAO */
.sdr-section {
  background: var(--bg-elev);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.sdr-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}
@media (max-width: 900px) { .sdr-grid { grid-template-columns: 1fr; gap: 32px; } }

.sdr-content h3 {
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.025em;
  margin-bottom: 14px;
  line-height: 1.1;
}
.sdr-content p {
  color: var(--text-2);
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 24px;
}
.sdr-list { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
.sdr-list li {
  font-size: 13.5px;
  color: var(--text);
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.sdr-list svg { width: 14px; height: 14px; color: var(--accent); margin-top: 4px; flex-shrink: 0; }

.sdr-steps-mini {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (max-width: 600px) { .sdr-steps-mini { grid-template-columns: 1fr; } }
.sdr-step-mini {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px;
  transition: background .25s;
}
.sdr-step-mini:hover { background: var(--surface-2); }
.sdr-step-mini .num {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.sdr-step-mini h4 {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin-bottom: 6px;
}
.sdr-step-mini p {
  font-size: 12.5px;
  color: var(--text-2);
  line-height: 1.5;
}

.sdr-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 5px;
  background: color-mix(in oklab, var(--info) 8%, transparent);
  border: 1px solid color-mix(in oklab, var(--info) 20%, transparent);
  border-radius: 100px;
  font-size: 11px;
  color: var(--info);
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-bottom: 20px;
}
.sdr-badge .ico {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: color-mix(in oklab, var(--info) 15%, transparent);
  display: grid; place-items: center;
}
.sdr-badge .ico svg { width: 12px; height: 12px; }

/* TESTIMONIALS */
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

/* FAQ */
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
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.38s cubic-bezier(0.16,1,0.3,1);
}
.faq-item[data-open="true"] .faq-a { grid-template-rows: 1fr; }
.faq-a-inner {
  min-height: 0;
  overflow: hidden;
  padding-bottom: 24px;
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.65;
  letter-spacing: -0.005em;
}

/* CTA FINAL */
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

/* FOOTER */
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

/* ANIMATIONS */
.fade-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .7s cubic-bezier(.2,.6,.2,1), transform .7s cubic-bezier(.2,.6,.2,1);
}
.fade-up.visible { opacity: 1; transform: translateY(0); }
.fade-up.delay-1 { transition-delay: .05s; }
.fade-up.delay-2 { transition-delay: .1s; }
.fade-up.delay-3 { transition-delay: .15s; }

/* ── SCROLL PROGRESS ─────────────────────────────────────── */
.scroll-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--accent) 60%, #5b9cff));
  z-index: 300;
  transform-origin: left;
  transform: scaleX(0);
  will-change: transform;
  pointer-events: none;
}

/* ── NAV SCROLL STATE ────────────────────────────────────── */
nav.scrolled {
  background: color-mix(in oklab, var(--bg) 88%, transparent);
  border-color: var(--border-strong);
  box-shadow: 0 4px 32px rgba(0,0,0,0.4), 0 1px 0 var(--border-strong);
}
.nav-links a.nav-active { color: var(--accent); background: var(--accent-soft); }

/* ── NAV LINK HOVER UNDERLINE ───────────────────────────── */
.nav-links a { position: relative; overflow: hidden; }
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 5px; left: 14px; right: 14px;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.22s ease;
}
.nav-links a:hover::after,
.nav-links a.nav-active::after { transform: scaleX(1); transform-origin: left; }

/* ── HERO CONTENT STAGGER ENTRANCE ──────────────────────── */
@keyframes heroIn {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-pill    { animation: heroIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.06s both; }
.hero-title   { animation: heroIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.16s both; }
.hero-sub     { animation: heroIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.26s both; }
.hero-actions { animation: heroIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
.hero-trust   { animation: heroIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.48s both; }
.hero-visual  { animation: heroIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both; }

/* ── HERO PANEL FLOAT ────────────────────────────────────── */
@keyframes heroFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  38%       { transform: translateY(-10px) rotate(0.4deg); }
  70%       { transform: translateY(-5px) rotate(-0.25deg); }
}
.hero-visual .panel { animation: heroFloat 6.5s ease-in-out infinite; }

/* ── STAGGER CARDS ENTRANCE ──────────────────────────────── */
.stagger-child {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1);
}
.stagger-child.in { opacity: 1; transform: translateY(0); }

/* ── FEAT ICON MICRO-ANIMATION ───────────────────────────── */
.feat-ico { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, box-shadow 0.3s ease; }
.feat-card:hover .feat-ico {
  transform: translateY(-4px) scale(1.1);
  background: color-mix(in oklab, var(--accent) 18%, transparent);
  box-shadow: 0 8px 24px color-mix(in oklab, var(--accent) 20%, transparent);
}

/* ── STEP ICON MICRO-ANIMATION ───────────────────────────── */
.step-ico { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, box-shadow 0.3s ease; }
.step:hover .step-ico {
  transform: scale(1.15) translateY(-3px);
  background: color-mix(in oklab, var(--accent) 24%, transparent);
  box-shadow: 0 10px 24px color-mix(in oklab, var(--accent) 22%, transparent);
}

/* ── PAIN ICON MICRO-ANIMATION ───────────────────────────── */
.pain-ico { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
.pain-card:hover .pain-ico { transform: scale(1.1) rotate(-6deg); }

/* ── PLAN CARD HOVER ─────────────────────────────────────── */
.plan { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease; }
.plan:hover { transform: translateY(-5px); border-color: var(--border-strong); }
.plan.featured:hover {
  transform: translateY(-7px);
  box-shadow: 0 32px 80px -20px color-mix(in oklab, var(--accent) 55%, transparent), inset 0 1px 0 0 var(--accent-line);
}

/* ── SDR MINI STEP HOVER ─────────────────────────────────── */
.sdr-step-mini { transition: background .25s, transform 0.28s cubic-bezier(0.16,1,0.3,1), border-color .25s; }
.sdr-step-mini:hover { background: var(--surface-2); transform: translateX(6px); border-color: var(--accent-line); }

/* ── TESTIMONIAL HOVER ───────────────────────────────────── */
.testi { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s; }
.testi:hover { transform: translateY(-6px); border-color: var(--border-strong); box-shadow: 0 20px 60px rgba(0,0,0,0.22); }

/* ── CTA CURSOR GLOW ─────────────────────────────────────── */
.cta-cursor-glow {
  position: absolute;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 65%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: left 0.5s ease, top 0.5s ease;
  z-index: 0;
}

/* ── REDUCED MOTION ──────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .hero-pill, .hero-title, .hero-sub, .hero-actions, .hero-trust, .hero-visual {
    animation: none !important; opacity: 1 !important; transform: none !important;
  }
  .hero-visual .panel { animation: none !important; }
  .stagger-child { opacity: 1 !important; transform: none !important; transition: none !important; }
  .scroll-bar { display: none; }
  .feat-ico, .step-ico, .pain-ico, .plan, .sdr-step-mini, .testi { transition: none !important; }
}
`

type UCKey = 'estetica' | 'dentista' | 'medico'

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
  estetica: {
    title: 'Clínica de estética',
    desc: 'Pacientes querendo agendar limpeza de pele, botox, preenchimento e outros procedimentos. A IA atende 24h, verifica disponibilidade e confirma o agendamento pelo WhatsApp.',
    points: [
      'Agendamento de procedimentos estéticos 24h',
      'Consulta de disponibilidade por profissional em tempo real',
      'Confirmação e lembrete automáticos pelo WhatsApp',
      'IA treinada com os procedimentos e protocolos da sua clínica'
    ],
    preview: [
      { who: 'bot', text: 'Olá! Bem-vinda à Clínica Derma Glow. Como posso ajudar?' },
      { who: 'user', text: 'Quero marcar uma limpeza de pele' },
      { who: 'bot', text: 'Ótimo! Temos horários na quarta 14h e sexta 10h. Qual prefere?' },
      { who: 'user', text: 'Sexta 10h' },
      { who: 'confirm', text: 'Confirmado — limpeza de pele, sexta 10h com Dra. Marina.' }
    ]
  },
  dentista: {
    title: 'Consultório odontológico',
    desc: 'Pacientes ligando e mandando mensagem para agendar consultas, limpezas e procedimentos. A IA responde na hora, consulta a agenda do dentista e confirma o horário.',
    points: [
      'Agendamento de consultas e procedimentos 24h',
      'Verificação de disponibilidade por dentista',
      'Lembrete automático 24h antes da consulta',
      'IA treinada com os serviços e especialidades do consultório'
    ],
    preview: [
      { who: 'bot', text: 'Olá! Odonto Sorriso. Como posso ajudar?' },
      { who: 'user', text: 'Preciso marcar uma limpeza' },
      { who: 'bot', text: 'Claro! Dr. Carlos tem horário terça 15h e quinta 09h. Qual prefere?' },
      { who: 'user', text: 'Terça 15h' },
      { who: 'confirm', text: 'Agendado — limpeza dental, terça 15h com Dr. Carlos.' }
    ]
  },
  medico: {
    title: 'Consultório médico',
    desc: 'Pacientes buscando agendar consultas, retornos e exames. A IA atende pelo WhatsApp, verifica horários disponíveis e confirma o agendamento automaticamente.',
    points: [
      'Agendamento de consultas e retornos 24h',
      'Consulta de disponibilidade em tempo real no Google Calendar',
      'Confirmação e lembrete pelo WhatsApp',
      'IA treinada com as especialidades e informações do consultório'
    ],
    preview: [
      { who: 'bot', text: 'Olá! Consultório Dra. Fernanda. Como posso ajudar?' },
      { who: 'user', text: 'Quero marcar uma consulta de retorno' },
      { who: 'bot', text: 'Claro! Temos segunda 10h e quarta 16h. Qual prefere?' },
      { who: 'user', text: 'Segunda 10h' },
      { who: 'confirm', text: 'Confirmado — retorno, segunda 10h com Dra. Fernanda.' }
    ]
  }
}

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

export default function ClinicasLandingPage() {
  const [activeUC, setActiveUC] = useState<UCKey>('estetica')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Scroll progress bar + nav scroll state
  useEffect(() => {
    const bar = document.createElement('div')
    bar.className = 'scroll-bar'
    document.body.appendChild(bar)
    const nav = document.querySelector('nav')

    const onScroll = () => {
      const scrolled = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.transform = `scaleX(${max > 0 ? scrolled / max : 0})`
      nav?.classList.toggle('scrolled', scrolled > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); bar.remove() }
  }, [])

  // Staggered card entrance per group
  useEffect(() => {
    const groups: Array<{ container: string; selector: string; delay: number }> = [
      { container: '.pain-grid', selector: '.pain-card', delay: 90 },
      { container: '.steps', selector: '.step', delay: 110 },
      { container: '.features-grid', selector: '.feat-card', delay: 70 },
      { container: '.plans', selector: '.plan', delay: 110 },
      { container: '.testimonials-grid', selector: '.testi', delay: 130 },
      { container: '.sdr-steps-mini', selector: '.sdr-step-mini', delay: 100 },
    ]
    const observers: IntersectionObserver[] = []
    groups.forEach(({ container, selector, delay }) => {
      const el = document.querySelector(container)
      if (!el) return
      const children = Array.from(el.querySelectorAll(selector)) as HTMLElement[]
      children.forEach(child => child.classList.add('stagger-child'))
      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        children.forEach((child, i) => setTimeout(() => child.classList.add('in'), i * delay))
        obs.unobserve(el)
      }, { threshold: 0.08 })
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Hero stat counter animation
  useEffect(() => {
    const trustSection = document.querySelector('.hero-trust')
    if (!trustSection) return
    const items = trustSection.querySelectorAll('.k')

    const countUp = (el: Element, target: number, prefix: string, suffix: string) => {
      const dur = 1400
      let start: number | null = null
      const step = (ts: number) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        el.innerHTML = `${prefix}<span class="accent">${Math.round(eased * target)}</span>${suffix}`
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const [i0, i1, i2] = Array.from(items)
      if (i0) countUp(i0, 24, '', '/7')
      if (i1) countUp(i1, 70, '', '%')
      if (i2) countUp(i2, 5, '&lt;', 's')
      obs.disconnect()
    }, { threshold: 0.7 })
    obs.observe(trustSection)
    return () => obs.disconnect()
  }, [])

  // Magnetic hover on primary CTAs
  useEffect(() => {
    const btns = Array.from(document.querySelectorAll('.btn-primary, .btn-plan.filled')) as HTMLElement[]
    const cleanup: Array<() => void> = []
    btns.forEach(el => {
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const dx = (e.clientX - r.left - r.width / 2) / r.width
        const dy = (e.clientY - r.top - r.height / 2) / r.height
        el.style.transform = `translate(${dx * 9}px, ${dy * 9}px)`
      }
      const onEnter = () => { el.style.transition = 'transform 0.12s ease, filter 0.2s, box-shadow 0.2s' }
      const onLeave = () => {
        el.style.transform = ''
        el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), filter 0.2s, box-shadow 0.2s'
      }
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
      cleanup.push(() => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    })
    return () => cleanup.forEach(fn => fn())
  }, [])

  // Nav section awareness — highlight active link
  useEffect(() => {
    const sectionIds = ['dores', 'como-funciona', 'demo', 'casos', 'recursos', 'prospeccao', 'precos']
    const navLinks = document.querySelectorAll('.nav-links a')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          navLinks.forEach(link => link.classList.toggle('nav-active', link.getAttribute('href') === `#${id}`))
        }
      })
    }, { threshold: 0.35 })
    sectionIds.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  // CTA section cursor glow
  useEffect(() => {
    const cta = document.querySelector('.cta-final') as HTMLElement | null
    if (!cta) return
    const glow = document.createElement('div')
    glow.className = 'cta-cursor-glow'
    cta.appendChild(glow)
    const onMove = (e: MouseEvent) => {
      const rect = cta.getBoundingClientRect()
      glow.style.left = `${e.clientX - rect.left}px`
      glow.style.top = `${e.clientY - rect.top}px`
    }
    cta.addEventListener('mousemove', onMove)
    return () => { cta.removeEventListener('mousemove', onMove); glow.remove() }
  }, [])

  // Demo WhatsApp interativa
  useEffect(() => {
    const demoConv = [
      { type: 'sent', text: 'Oi, boa tarde! Gostaria de agendar um procedimento', step: { title: '1. Paciente inicia contato', desc: 'O paciente envia uma mensagem pelo WhatsApp. A IA responde instantaneamente, 24h por dia, 7 dias por semana.' } },
      { type: 'received', text: 'Olá! Boa tarde! Bem-vinda à Clínica Derma Glow! Eu sou a Clara, assistente virtual. Vou te ajudar a agendar seu horário. Qual procedimento você gostaria?\n\nLimpeza de pele\nBotox\nPreenchimento labial\nPeeling químico\nMicroagulhamento', delay: 1800, step: { title: '2. Saudação + Menu de serviços', desc: 'A IA cumprimenta o paciente com o nome da clínica e apresenta os procedimentos disponíveis automaticamente.' } },
      { type: 'sent', text: 'Botox', step: { title: '3. Paciente escolhe o procedimento', desc: 'Interação natural por texto, sem menus complicados. O paciente digita normalmente.' } },
      { type: 'received', text: 'Ótima escolha! O procedimento de Botox leva em média 30 minutos. Para quando você gostaria de agendar?\n\nHorários disponíveis com Dra. Marina:\n\nTerça (12/08): 10:00, 14:00\nQuarta (13/08): 09:00, 15:00\nSexta (15/08): 11:00, 16:00', delay: 2000, step: { title: '4. Consulta de agenda em tempo real', desc: 'A IA consulta o Google Calendar da profissional e mostra apenas horários realmente livres. Sem conflitos de agenda!' } },
      { type: 'sent', text: 'Quarta às 15h', step: { title: '5. Paciente escolhe horário', desc: 'Processo simples e rápido. O paciente não precisa ligar nem esperar resposta da secretária.' } },
      { type: 'received', text: 'Perfeito! Vou reservar quarta 13/08 às 15h para Botox com Dra. Marina. Qual o seu nome completo?', delay: 1500, step: { title: '6. Coleta de dados', desc: 'A IA coleta as informações necessárias de forma conversacional e amigável.' } },
      { type: 'sent', text: 'Ana Paula Oliveira', step: { title: '7. Identificação do paciente', desc: 'Os dados ficam registrados para histórico e gestão da clínica.' } },
      { type: 'received', text: 'Obrigada, Ana Paula! Para enviar a confirmação, qual seu email?', delay: 1200, step: { title: '8. Email para confirmação', desc: 'O paciente recebe confirmação por email automaticamente.' } },
      { type: 'sent', text: 'ana.oliveira@gmail.com', step: null },
      { type: 'received', text: 'Pronto, Ana Paula! Seu agendamento está confirmado:\n\nBotox com Dra. Marina\nQuarta, 13/08 às 15:00\nClínica Derma Glow\n\nVocê vai receber um email de confirmação e um lembrete por WhatsApp 24h antes. Até lá!', delay: 2200, step: { title: '9. Confirmação automática', desc: 'Agendamento criado no Google Calendar, email enviado, lembrete WhatsApp programado. Tudo automático, sem intervenção da secretária!' } },
      { type: 'received', text: 'Oi Ana Paula! Lembrete: seu horário na Clínica Derma Glow é AMANHÃ às 15:00 (Botox com Dra. Marina). Te esperamos! Se precisar reagendar, é só me chamar.', delay: 1500, step: { title: '10. Lembrete automático', desc: 'O paciente recebe lembrete 24h antes. Isso reduz faltas em até 70% e a clínica não precisa ligar para confirmar.' } },
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

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

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

    const hideTyping = () => {
      document.getElementById('demoTyping')?.remove()
      status.textContent = 'online'
    }

    const addMsg = (type: string, text: string) => {
      const msg = document.createElement('div')
      msg.className = 'demo-msg ' + type
      const time = getTime()
      const check = type === 'sent' ? ' <span class="dm-check">\u2713\u2713</span>' : ''
      msg.innerHTML = text.replace(/\n/g, '<br>') + '<span class="dm-time">' + time + check + '</span>'
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
        stepDesc.textContent = 'Todo esse fluxo acontece sem intervenção humana. A clínica só precisa atender o paciente na hora marcada.'
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

      if (item.step === null && demoStep < demoConv.length - 1) {
        await sleep(600)
        nextStep()
      }
    }

    const startDemo = () => {
      overlay.classList.add('hidden')
      demoStarted = true
      setTimeout(() => nextStep(), 500)
    }

    const resetDemo = () => {
      demoStep = -1
      demoAnimating = false
      demoStarted = false
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqItems = [
    {
      q: 'Funciona para qualquer tipo de clínica?',
      a: 'Sim. A AttendeAI funciona para clínicas de estética, consultórios odontológicos, consultórios médicos de diversas especialidades, clínicas de fisioterapia, psicologia e muito mais. Configuramos a IA com os procedimentos e protocolos específicos do seu negócio.'
    },
    {
      q: 'A IA substitui minha secretária?',
      a: 'A IA complementa sua equipe. Ela cuida do agendamento 24h, responde perguntas frequentes e envia lembretes — liberando sua secretária para tarefas que exigem atenção humana, como recepção presencial e suporte ao paciente.'
    },
    {
      q: 'Os dados dos pacientes ficam seguros?',
      a: 'Sim. Todos os dados são tratados com criptografia e armazenados de forma segura. A IA não coleta informações médicas sensíveis — apenas dados de agendamento como nome, contato e procedimento desejado.'
    },
    {
      q: 'Como funciona a integração com o WhatsApp?',
      a: 'Conectamos ao seu número de WhatsApp via conexão direta. Seu número não muda, os pacientes continuam falando normalmente — mas agora quem responde é a IA, 24h por dia.'
    },
    {
      q: 'Quanto tempo leva para começar?',
      a: 'No plano Business, a ativação acontece em até 24h. Nos outros planos, o processo leva de 2 a 3 dias úteis. Nossa equipe configura tudo para você — procedimentos, horários, tom de voz e personalizações.'
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
            <li><a href="#dores">Por que automatizar</a></li>
            <li><a href="#demo">Demonstração</a></li>
            <li><a href="#casos">Segmentos</a></li>
            <li><a href="#recursos">Recursos</a></li>
            <li><a href="#prospeccao">Prospecção</a></li>
            <li><a href="#precos">Preços</a></li>
          </ul>
          <div className="nav-right">
            <a href="https://wa.me/5534980799965?text=Oi%2C%20tenho%20uma%20cl%C3%ADnica%20e%20quero%20saber%20mais%20sobre%20a%20AttendeAI" className="nav-cta">
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
                <span className="tag"><span className="dot" style={{ display: 'inline-block', marginRight: '4px' }}></span>saúde</span>
                IA especializada para clínicas e consultórios
              </div>

              <h1 className="hero-title">
                Sua clínica<br />
                nunca <em>para de</em><br />
                atender pacientes.
              </h1>

              <p className="hero-sub">
                Um agente de IA que atende pacientes pelo WhatsApp, agenda consultas no Google Calendar, responde dúvidas e envia lembretes — enquanto você cuida dos seus pacientes.
              </p>

              <div className="hero-actions">
                <a href="https://wa.me/5534980799965?text=Oi%2C%20tenho%20uma%20cl%C3%ADnica%20e%20quero%20saber%20mais%20sobre%20a%20AttendeAI" className="btn btn-primary">
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
                  <div className="k"><span className="accent">24</span>/7</div>
                  <div className="v">atendimento</div>
                </div>
                <div className="trust-item">
                  <div className="k"><span className="accent">70</span>%</div>
                  <div className="v">menos faltas</div>
                </div>
                <div className="trust-item">
                  <div className="k">&lt;<span className="accent">5</span>s</div>
                  <div className="v">tempo de resposta</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-head-left">
                    <div className="panel-avatar">
                      <svg viewBox="0 0 24 24" fill="none"><path d="M12 2a5 5 0 015 5v3H7V7a5 5 0 015-5zM4 12h16v7a3 3 0 01-3 3H7a3 3 0 01-3-3v-7z" stroke="currentColor" strokeWidth="1.5"/><path d="M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    <div>
                      <div className="panel-title">Clínica Derma Glow</div>
                      <div className="panel-sub">whatsapp &middot; attendeai</div>
                    </div>
                  </div>
                  <div className="panel-status"><span className="dot"></span>online</div>
                </div>
                <div className="panel-body">
                  <div className="bubble bot">Olá! Bem-vinda à Clínica Derma Glow. Como posso ajudar?</div>
                  <div className="bubble user">Quero agendar uma sessão de botox</div>
                  <div className="bubble bot">Ótimo! Dra. Marina tem horário na quarta 15h e sexta 10h. Qual prefere?</div>
                  <div className="bubble user">Quarta 15h</div>
                  <div className="bubble confirm">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div>Agendado — Botox com Dra. Marina, quarta 15h. Envio lembrete 24h antes.</div>
                  </div>
                  <div className="typing"><i></i><i></i><i></i></div>
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

        {/* PAIN POINTS */}
        <section id="dores">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">O problema</div>
              <h2 className="section-title">Sua clínica está perdendo pacientes agora.</h2>
              <p className="section-sub">Enquanto você atende, opera ou está fora do consultório, pacientes tentam contato e desistem.</p>
            </div>

            <div className="pain-grid fade-up">
              <div className="pain-card">
                <div className="pain-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/><path d="M15 3l6 6M21 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                <h3>Ligações perdidas</h3>
                <p>Pacientes ligam durante atendimentos e ninguém atende. Cada ligação perdida é uma consulta que vai para o concorrente.</p>
              </div>
              <div className="pain-card">
                <div className="pain-ico"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Mensagens fora de horário</h3>
                <p>62% das mensagens de agendamento chegam depois das 18h. Se você não responde, o paciente não espera até o dia seguinte.</p>
              </div>
              <div className="pain-card">
                <div className="pain-ico"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Faltas e no-shows</h3>
                <p>Até 30% dos pacientes faltam por esquecimento. Sem lembrete automático, você perde tempo e faturamento com horários vazios.</p>
              </div>
            </div>
          </div>
        </section>

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
                <h3>Paciente entra em contato</h3>
                <p>Pelo WhatsApp, o agente atende imediatamente, a qualquer hora do dia ou da noite.</p>
              </div>
              <div className="step">
                <div className="step-num">02 / compreensão</div>
                <div className="step-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3a6 6 0 016 6c0 2-1 3-2 4v3a2 2 0 01-2 2h-4a2 2 0 01-2-2v-3c-1-1-2-2-2-4a6 6 0 016-6zM10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                <h3>IA entende e responde</h3>
                <p>O agente entende o que o paciente precisa, responde dúvidas sobre procedimentos e coleta as informações necessárias.</p>
              </div>
              <div className="step">
                <div className="step-num">03 / agendamento</div>
                <div className="step-ico"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Agenda automaticamente</h3>
                <p>Consulta o Google Calendar do profissional em tempo real e confirma o horário diretamente com o paciente.</p>
              </div>
              <div className="step">
                <div className="step-num">04 / lembrete</div>
                <div className="step-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Lembrete automático</h3>
                <p>O paciente recebe lembrete 24h antes pelo WhatsApp. Redução de até 70% nas faltas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DEMO */}
        <section className="how" id="demo">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">Demonstração</div>
              <h2 className="section-title">Veja a IA agendando ao vivo.</h2>
              <p className="section-sub">Uma conversa real entre um paciente e o agente AttendeAI em uma clínica de estética. Clique para avançar.</p>
            </div>

            <div className="demo-container fade-up">
              <div className="demo-phone" id="demoPhone">
                <div className="demo-overlay" id="demoOverlay">
                  <div className="demo-overlay-title">AttendeAI</div>
                  <div className="demo-overlay-sub">Agente para Clínicas e Consultórios</div>
                  <button className="demo-play-btn" aria-label="Iniciar demo">&#9654;</button>
                  <div className="demo-overlay-hint">Clique para iniciar</div>
                </div>

                <div className="demo-chat-header">
                  <div className="demo-avatar">C</div>
                  <div>
                    <div className="demo-header-name">Clara - Derma Glow</div>
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
                <div className="demo-nav-hint">
                  <kbd>Espaço</kbd> ou <kbd>&rarr;</kbd> para avançar &bull; <button className="demo-restart-btn" id="demoRestartBtn">Reiniciar</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="usecases" id="casos">
          <div className="wrap">
            <div className="section-head fade-up">
              <div className="eyebrow">Segmentos</div>
              <h2 className="section-title">Feito para o ritmo da área da saúde.</h2>
              <p className="section-sub">Veja como a AttendeAI se adapta a diferentes tipos de clínicas e consultórios.</p>
            </div>

            <div className="uc-tabs fade-up" id="ucTabs">
              {(['estetica', 'dentista', 'medico'] as UCKey[]).map((key) => (
                <button
                  key={key}
                  className={`uc-tab${activeUC === key ? ' active' : ''}`}
                  onClick={() => setActiveUC(key)}
                >
                  {key === 'estetica' && <svg viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>}
                  {key === 'dentista' && <svg viewBox="0 0 24 24" fill="none"><path d="M12 2a5 5 0 015 5v2a5 5 0 01-2 4l1 7a2 2 0 01-2 2h-2a2 2 0 01-2-2l-1-3-1 3a2 2 0 01-2 2H4a2 2 0 01-2-2l1-7a5 5 0 01-2-4V7a5 5 0 015-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                  {key === 'medico' && <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                  {key === 'estetica' ? 'Clínica de estética' : key === 'dentista' ? 'Dentista' : 'Consultório médico'}
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
              <h2 className="section-title">Tudo que uma secretária faz — e mais.</h2>
              <p className="section-sub">Sem faltas, sem horário limitado, sem férias. Sua melhor recepcionista custa menos que um café por dia.</p>
            </div>

            <div className="features-grid fade-up">
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg></div>
                <h3>WhatsApp inteligente</h3>
                <p>Responde mensagens com entendimento contextual, tira dúvidas sobre procedimentos e conduz o paciente até o agendamento de forma natural.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                <h3>Agendamento em tempo real</h3>
                <p>Consulta disponibilidade por profissional, cria eventos no Google Calendar e envia confirmação automática ao paciente.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Lembretes automáticos</h3>
                <p>Envia lembrete pelo WhatsApp 24h antes da consulta. Reduz faltas em até 70% sem ninguém precisar ligar.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg></div>
                <h3>Personalização total</h3>
                <p>Configure procedimentos, profissionais, horários e tom de voz da clínica. A IA atende com a identidade do seu negócio.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18M7 16l4-4 4 4 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Painel de gestão</h3>
                <p>Agendamentos organizados num painel limpo. Visualize consultas do dia, histórico de pacientes e métricas de atendimento.</p>
              </div>
              <div className="feat-card">
                <div className="feat-ico"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Disponível 24/7</h3>
                <p>O agente nunca para. Atende pacientes de madrugada, fins de semana e feriados — sem custo adicional e sem você precisar fazer nada.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SDR - PROSPECCAO */}
        <section className="sdr-section" id="prospeccao">
          <div className="wrap">
            <div className="section-head fade-up">
              <div className="eyebrow">Prospecção ativa</div>
              <h2 className="section-title">Não espere o paciente vir até você.</h2>
              <p className="section-sub">Além de atender quem chega, a AttendeAI vai atrás de novos pacientes para lotar sua agenda.</p>
            </div>

            <div className="sdr-grid fade-up">
              <div className="sdr-content">
                <div className="sdr-badge">
                  <span className="ico"><svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  SDR com IA
                </div>
                <h3>Um agente comercial que prospecta via WhatsApp enquanto você atende.</h3>
                <p>Importe sua lista de contatos — pacientes antigos que não voltaram, leads do Instagram, indicações — e a IA entra em contato automaticamente pelo WhatsApp, com mensagens humanizadas e personalizadas.</p>
                <ul className="sdr-list">
                  <li>
                    <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Disparo inteligente via WhatsApp (sem parecer spam)
                  </li>
                  <li>
                    <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    IA conversa com o lead e qualifica o interesse
                  </li>
                  <li>
                    <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Agenda consulta automaticamente para leads quentes
                  </li>
                  <li>
                    <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Reativação de pacientes que sumiram da agenda
                  </li>
                  <li>
                    <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Dashboard com métricas de conversão e campanhas
                  </li>
                </ul>
                <a href="https://wa.me/5534980799965?text=Quero%20saber%20sobre%20o%20SDR%20para%20minha%20cl%C3%ADnica" className="btn btn-primary">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  Quero prospectar pacientes
                </a>
              </div>

              <div className="sdr-steps-mini">
                <div className="sdr-step-mini">
                  <div className="num">01 &middot; importe</div>
                  <h4>Envie sua lista de contatos</h4>
                  <p>Pacientes antigos, leads do Instagram, indicações. Upload via CSV ou cole direto no painel.</p>
                </div>
                <div className="sdr-step-mini">
                  <div className="num">02 &middot; dispare</div>
                  <h4>IA entra em contato</h4>
                  <p>Mensagens personalizadas pelo WhatsApp, com tom humanizado e intervalos naturais entre envios.</p>
                </div>
                <div className="sdr-step-mini">
                  <div className="num">03 &middot; qualifique</div>
                  <h4>Qualificação automática</h4>
                  <p>A IA conversa, identifica interesse e classifica cada lead como quente, morno ou frio.</p>
                </div>
                <div className="sdr-step-mini">
                  <div className="num">04 &middot; agende</div>
                  <h4>Consulta agendada</h4>
                  <p>Leads qualificados são agendados direto no Google Calendar. Você só atende.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="how">
          <div className="wrap">
            <div className="section-head center fade-up">
              <div className="eyebrow">Resultados</div>
              <h2 className="section-title">O que muda na sua clínica.</h2>
            </div>

            <div className="testimonials-grid fade-up">
              <div className="testi">
                <div className="testi-quote"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/></svg></div>
                <div className="testi-text">"Antes eu perdia em média 8 pacientes por semana só por não conseguir responder a tempo. Agora a IA responde em segundos, 24h. Minha agenda lotou."</div>
                <div className="testi-author">
                  <div className="testi-avatar">RM</div>
                  <div>
                    <div className="testi-name">Dra. Renata Moraes</div>
                    <div className="testi-role">Dermatologista &middot; SP</div>
                  </div>
                </div>
              </div>
              <div className="testi">
                <div className="testi-quote"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/></svg></div>
                <div className="testi-text">"As faltas caíram 65% depois que os lembretes automáticos começaram. Só isso já pagou o investimento no primeiro mês."</div>
                <div className="testi-author">
                  <div className="testi-avatar">CF</div>
                  <div>
                    <div className="testi-name">Dr. Carlos Ferreira</div>
                    <div className="testi-role">Dentista &middot; MG</div>
                  </div>
                </div>
              </div>
              <div className="testi">
                <div className="testi-quote"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/></svg></div>
                <div className="testi-text">"Minha secretária agora foca no presencial. A IA cuida de tudo pelo WhatsApp — agendamento, confirmação, lembrete. Minha clínica parece ter o dobro da equipe."</div>
                <div className="testi-author">
                  <div className="testi-avatar">LP</div>
                  <div>
                    <div className="testi-name">Dra. Luciana Pinto</div>
                    <div className="testi-role">Clínica de Estética &middot; RJ</div>
                  </div>
                </div>
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
              <p className="section-sub">Sem taxa de adesão, sem fidelidade. Menos que o custo de uma falta por mês.</p>
            </div>

            <div className="plans fade-up">
              {/* STARTER */}
              <div className="plan">
                <div className="plan-name">Starter</div>
                <div className="plan-price">
                  <span className="plan-currency">R$</span>
                  <span className="plan-amount">197</span>
                </div>
                <div className="plan-period">por mês &middot; faturado mensalmente</div>
                <p className="plan-desc">Ideal para consultórios que querem automatizar o agendamento pelo WhatsApp.</p>
                <ul className="plan-feats">
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Agente IA no WhatsApp</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Agendamento no Google Calendar</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Verificação de disponibilidade em tempo real</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Confirmação automática pelo WhatsApp</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>1 número de WhatsApp</span></li>
                  <li className="muted"><svg className="cross" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span>Painel de gestão</span></li>
                  <li className="muted"><svg className="cross" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span>Lembretes automáticos</span></li>
                </ul>
                <a href="https://wa.me/5534980799965?text=Quero%20o%20plano%20Starter%20para%20minha%20cl%C3%ADnica" className="btn-plan outline">Começar agora <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              </div>

              {/* PRO */}
              <div className="plan featured">
                <div className="plan-badge">Mais popular</div>
                <div className="plan-name">Pro</div>
                <div className="plan-price">
                  <span className="plan-currency">R$</span>
                  <span className="plan-amount">397</span>
                </div>
                <div className="plan-period">por mês &middot; faturado mensalmente</div>
                <p className="plan-desc">Para clínicas que querem automação completa com visibilidade total da agenda.</p>
                <ul className="plan-feats">
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Tudo do Starter</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Painel de gestão completo</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Histórico de agendamentos</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Lembretes automáticos (24h antes)</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Múltiplos profissionais na agenda</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Suporte por e-mail</span></li>
                  <li className="muted"><svg className="cross" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span>Onboarding dedicado</span></li>
                </ul>
                <a href="https://wa.me/5534980799965?text=Quero%20o%20plano%20Pro%20para%20minha%20cl%C3%ADnica" className="btn-plan filled">Começar agora <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              </div>

              {/* BUSINESS */}
              <div className="plan">
                <div className="plan-name">Business</div>
                <div className="plan-price">
                  <span className="plan-currency">R$</span>
                  <span className="plan-amount">697</span>
                </div>
                <div className="plan-period">por mês &middot; faturado mensalmente</div>
                <p className="plan-desc">Para clínicas que querem começar sem complicação — a gente configura tudo para você.</p>
                <ul className="plan-feats">
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Tudo do Pro</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Onboarding dedicado</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Configuração completa do agente</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Suporte prioritário via WhatsApp</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Ativação em até 24h</span></li>
                  <li><svg className="check" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Treinamento personalizado com seus procedimentos</span></li>
                </ul>
                <a href="https://wa.me/5534980799965?text=Quero%20o%20plano%20Business%20para%20minha%20cl%C3%ADnica" className="btn-plan outline">Começar agora <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
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
                  <div className="faq-a"><div className="faq-a-inner">{item.a}</div></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <div className="cta-final">
          <div className="wrap cta-final-inner fade-up">
            <div className="eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>Comece agora</div>
            <h2>Seu próximo paciente está <em>tentando</em> agendar agora.</h2>
            <p>Enquanto você atende, opera ou descansa, a AttendeAI garante que nenhum paciente fique sem resposta.</p>
            <div className="actions">
              <a href="https://wa.me/5534980799965?text=Oi%2C%20tenho%20uma%20cl%C3%ADnica%20e%20quero%20saber%20mais%20sobre%20a%20AttendeAI" className="btn btn-primary">
                <svg viewBox="0 0 16 16" fill="none"><path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                Falar com especialista
              </a>
              <a href="https://wa.me/5534980799965" className="btn btn-ghost"><svg viewBox="0 0 16 16" fill="none"><path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> Falar com um humano</a>
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
                <a href="https://attendeai.ia.br">Página principal</a>
                <a href="#">Termos</a>
                <a href="#">Privacidade</a>
                <a href="#">Suporte</a>
                <a href="https://wa.me/5534980799965">Fale conosco</a>
              </div>
            </div>
            <div className="wrap footer-copy">
              <span>&copy; 2026 AttendeAI</span>
              <span>feito no brasil</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
