'use client'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, X, Send, Coffee, Truck, Check } from 'lucide-react'

type Category = { id: string; name: string; channel: string; sort_order: number }
type PriceVariant = { label: string; price: number }
type Product = {
  id: string; category_id: string; name: string; description?: string
  price: number; price_variants?: PriceVariant[] | null; image_url?: string
  channel: string; available: boolean
}
type Shop = { id: string; nome: string; slug: string; telefone?: string; endereco?: string; logo_url?: string; cover_url?: string }

type CartItem = {
  product_id: string; product_name: string; variant_label?: string
  unit_price: number; quantity: number; notes?: string
}

const BRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function heroUrl(url: string): string {
  try {
    const u = new URL(url)
    u.searchParams.set('w', '800')
    u.searchParams.set('h', '500')
    u.searchParams.set('fit', 'crop')
    return u.toString()
  } catch { return url }
}

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  .c-wrap {
    --bg: #ffffff;
    --bg-surface: #f5f5f5;
    --bg-elevated: #fafafa;
    --bg-hover: #f0f0f0;
    --border: #e8e8e8;
    --border-strong: #d4d4d4;
    --border-hover: #bbb;
    --text-primary: #1a1a1a;
    --text-secondary: #6b6b6b;
    --text-muted: #737373;
    --text-placeholder: #9a9a9a;
    --text-variant: #444;
    --accent: #00a86b;
    --accent-dim: rgba(0,194,124,0.12);
    --accent-subtle: rgba(0,194,124,0.04);
    --accent-hover: rgba(0,194,124,0.08);
    --accent-active: rgba(0,194,124,0.10);
    --accent-press: rgba(0,194,124,0.18);
    --placeholder-bg: #f0ebe4;
    --placeholder-icon: #c8bfb3;

    width: 100%; max-width: 480px; margin: 0 auto; min-height: 100dvh;
    display: flex; flex-direction: column;
    overflow-x: clip;
    font-family: var(--font-geist-sans, system-ui, -apple-system, sans-serif);
    -webkit-font-smoothing: antialiased;
    background: var(--bg);
  }

  /* ── Shop Hero ── */
  .c-hero-cover {
    width: 100%; aspect-ratio: 2/1; object-fit: cover; display: block;
    background: var(--bg-surface);
  }
  .c-hero-cover-placeholder {
    width: 100%; aspect-ratio: 2/1;
    background: var(--placeholder-bg);
    display: flex; align-items: center; justify-content: center;
    color: var(--placeholder-icon);
  }
  .c-hero-info {
    position: relative; padding: 0 20px 4px;
    margin-top: -32px;
  }
  .c-hero-avatar {
    width: 64px; height: 64px; border-radius: 16px;
    border: 3px solid var(--bg);
    background: var(--bg); object-fit: cover;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .c-hero-avatar img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .c-hero-avatar-fallback {
    width: 100%; height: 100%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 24px; font-weight: 800;
    letter-spacing: -0.03em;
  }
  .c-shop-name {
    color: var(--text-primary); font-size: 18px; font-weight: 700;
    letter-spacing: -0.02em; line-height: 1.25;
    margin-top: 12px;
    word-wrap: break-word; overflow-wrap: break-word;
  }
  .c-shop-address {
    color: var(--text-secondary); font-size: 13px; margin-top: 4px;
    line-height: 1.4;
  }
  .c-mesa {
    color: var(--accent); font-size: 13px; font-weight: 600; margin-top: 4px;
    font-variant-numeric: tabular-nums;
  }

  /* ── Sticky nav (tabs + pills) ── */
  .c-header {
    position: sticky; top: 0; z-index: 20;
    background: var(--bg); padding: 0 20px;
    width: 100%;
  }

  /* ── Channel tabs ── */
  .c-tabs { display: flex; gap: 8px; padding: 12px 0; }
  .c-tab {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
    min-height: 44px; border-radius: 10px;
    border: 1.5px solid var(--border); background: transparent;
    color: var(--text-secondary); font-size: 14px; font-weight: 500;
    cursor: pointer; transition: background-color .2s ease-out, color .2s ease-out, border-color .2s ease-out;
    font-family: inherit; -webkit-tap-highlight-color: transparent;
  }
  .c-tab:active { transform: scale(0.97); }
  .c-tab[data-active="true"] {
    background: var(--accent); color: #fff;
    border-color: var(--accent); font-weight: 600;
  }

  /* ── Category pills ── */
  .c-cats-wrap {
    position: relative; overflow: hidden;
    -webkit-mask-image: linear-gradient(to right, black calc(100% - 32px), transparent);
    mask-image: linear-gradient(to right, black calc(100% - 32px), transparent);
  }
  .c-cats {
    display: flex; gap: 8px; overflow-x: auto;
    padding: 10px 0; scrollbar-width: none;
  }
  .c-cats::-webkit-scrollbar { display: none; }
  .c-pill {
    white-space: nowrap; min-height: 44px;
    padding: 0 18px; border-radius: 22px;
    display: flex; align-items: center;
    border: 1.5px solid var(--border); background: transparent;
    color: var(--text-muted); font-size: 14px; font-weight: 500;
    cursor: pointer; transition: background-color .2s ease-out, color .2s ease-out, border-color .2s ease-out;
    font-family: inherit; -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .c-pill:active { transform: scale(0.96); }
  .c-pill[data-active="true"] {
    background: var(--accent); color: #fff;
    border-color: var(--accent); font-weight: 600;
  }

  /* ── Product list ── */
  .c-list {
    flex: 1; padding: 0 0 120px;
    display: flex; flex-direction: column;
  }
  .c-cat-title {
    color: var(--text-primary); font-size: 16px; font-weight: 700;
    letter-spacing: -0.015em;
    padding: 20px 20px 10px;
  }
  .c-cat-title:first-child { padding-top: 10px; }
  .c-list section { scroll-margin-top: 160px; }

  /* ── Product card (iFood style) ── */
  .c-card {
    display: flex; gap: 14px; padding: 16px 20px;
    background: transparent; cursor: pointer;
    transition: background-color .12s ease-out;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    border: none; text-align: left; width: 100%;
    font-family: inherit; font-size: inherit; color: inherit;
  }
  .c-card + .c-card { border-top: 1px solid var(--bg-surface); }
  .c-card:active { background: var(--bg-hover); }
  .c-card-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .c-card-name {
    color: var(--text-primary); font-size: 15px; font-weight: 600;
    letter-spacing: -0.01em; line-height: 1.3;
  }
  .c-card-desc {
    color: var(--text-secondary); font-size: 13px; margin-top: 4px;
    line-height: 1.45; display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .c-card-price {
    color: var(--accent); font-size: 15px; font-weight: 700;
    margin-top: auto; padding-top: 8px;
    font-variant-numeric: tabular-nums;
  }
  .c-card-from {
    color: var(--text-muted); font-size: 12px; font-weight: 500;
    margin-top: auto; padding-top: 8px;
  }
  .c-card-from-price {
    color: var(--accent); font-weight: 700; font-size: 15px;
    font-variant-numeric: tabular-nums;
  }

  /* ── Product image (card) ── */
  .c-card-img {
    width: 110px; height: 110px; border-radius: 12px;
    object-fit: cover; flex-shrink: 0; background: var(--border);
  }
  .c-card-no-img {
    width: 110px; height: 110px; border-radius: 12px;
    background: var(--placeholder-bg); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    color: var(--placeholder-icon);
  }

  /* ── Product Detail Sheet ── */
  .c-detail {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 480px; max-height: 92dvh;
    background: var(--bg); border-top-left-radius: 20px; border-top-right-radius: 20px;
    z-index: 50; display: flex; flex-direction: column; overflow: hidden;
    animation: c-slide-up .25s ease-out;
  }
  .c-detail-scroll {
    flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
  }
  .c-detail-hero {
    position: relative; width: 100%; aspect-ratio: 16/10;
    background: var(--bg-surface);
  }
  .c-detail-hero img {
    width: 100%; height: 100%; object-fit: cover;
    border-top-left-radius: 20px; border-top-right-radius: 20px;
  }
  .c-detail-hero-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: var(--placeholder-bg);
    color: var(--placeholder-icon);
    border-top-left-radius: 20px; border-top-right-radius: 20px;
  }
  .c-detail-close {
    position: absolute; top: 10px; right: 10px;
    width: 44px; height: 44px; border-radius: 22px;
    background: rgba(0,0,0,.55); border: none;
    color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    z-index: 2;
  }
  .c-detail-close:active { background: rgba(0,0,0,.7); }

  .c-detail-body { padding: 20px 20px 24px; }
  .c-detail-name {
    color: var(--text-primary); font-size: 22px; font-weight: 700;
    letter-spacing: -0.025em; line-height: 1.2;
  }
  .c-detail-desc {
    color: var(--text-secondary); font-size: 14px; line-height: 1.55;
    margin-top: 10px;
  }
  .c-detail-price-row {
    margin-top: 16px;
    display: flex; align-items: baseline; gap: 8px;
  }
  .c-detail-price {
    color: var(--text-primary); font-size: 20px; font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  /* ── Detail Variants ── */
  .c-detail-variants {
    margin-top: 20px; padding-top: 20px;
    background: var(--bg-surface); border-radius: 12px;
    padding: 16px; margin-left: -4px; margin-right: -4px;
  }
  .c-detail-variants-title {
    color: var(--text-primary); font-size: 15px; font-weight: 700;
    margin-bottom: 4px;
  }
  .c-detail-variants-sub {
    color: var(--text-secondary); font-size: 13px;
    margin-bottom: 14px;
  }
  .c-detail-var {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    border: none; background: none; width: 100%; text-align: left;
    font-family: inherit; font-size: inherit; color: inherit;
  }
  .c-detail-var + .c-detail-var { margin-top: 4px; }
  .c-detail-var-info { flex: 1; }
  .c-detail-var-label {
    color: var(--text-primary); font-size: 15px; font-weight: 500;
  }
  .c-detail-var-price {
    color: var(--text-secondary); font-size: 14px; margin-top: 2px;
    font-variant-numeric: tabular-nums;
  }
  .c-detail-radio {
    width: 24px; height: 24px; border-radius: 12px;
    border: 2px solid var(--border-strong);
    flex-shrink: 0; margin-left: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: background-color .15s ease-out, border-color .15s ease-out;
  }
  .c-detail-radio[data-selected="true"] {
    border-color: var(--accent); background: var(--accent);
  }
  .c-detail-radio-dot {
    width: 8px; height: 8px; border-radius: 4px;
    background: #fff;
  }

  /* ── Detail Footer ── */
  .c-detail-footer {
    padding: 14px 20px;
    padding-bottom: max(14px, env(safe-area-inset-bottom));
    display: flex; align-items: center; gap: 14px;
    background: var(--bg-surface);
  }
  .c-detail-qty {
    display: flex; align-items: center;
    border: 1.5px solid var(--border); border-radius: 12px;
    overflow: hidden;
  }
  .c-detail-qty-btn {
    width: 44px; height: 44px; border: none; background: transparent;
    color: var(--text-primary); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background .1s;
  }
  .c-detail-qty-btn:active { background: var(--accent-hover); }
  .c-detail-qty-btn[data-disabled="true"] {
    color: var(--border-strong); pointer-events: none;
  }
  .c-detail-qty-num {
    color: var(--text-primary); font-size: 16px; font-weight: 700;
    min-width: 32px; text-align: center;
    font-variant-numeric: tabular-nums;
  }
  .c-detail-add {
    flex: 1; min-height: 48px; border-radius: 12px;
    border: none; background: var(--accent); color: #fff;
    font-size: 15px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    font-family: inherit; transition: opacity .15s ease-out, transform .15s ease-out;
    -webkit-tap-highlight-color: transparent;
    font-variant-numeric: tabular-nums;
  }
  .c-detail-add:active { transform: scale(0.98); }
  .c-detail-add:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  /* ── Toast (add feedback) ── */
  .c-toast {
    position: fixed; bottom: 88px; left: 50%; z-index: 55;
    background: #1a1a1a; color: #fff;
    padding: 10px 20px; border-radius: 12px;
    font-size: 14px; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    pointer-events: none;
    animation: c-toast-in .3s ease-out forwards, c-toast-out .3s ease-out .9s forwards;
  }
  .c-toast[data-error="true"] {
    background: #ff4d4f; color: #fff;
  }
  @keyframes c-toast-in {
    from { opacity: 0; transform: translate(-50%, 12px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes c-toast-out {
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, -8px); }
  }

  /* ── Cart bottom bar ── */
  .c-fab {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 480px;
    display: flex; align-items: center; justify-content: space-between;
    min-height: 56px; padding: 0 20px;
    padding-bottom: max(0px, env(safe-area-inset-bottom));
    background: var(--accent); color: #fff; border: none;
    border-top-left-radius: 16px; border-top-right-radius: 16px;
    font-size: 15px; font-weight: 700; cursor: pointer;
    font-family: inherit; z-index: 30;
    transition: transform .15s ease-out;
    -webkit-tap-highlight-color: transparent;
    animation: c-fab-in .25s ease-out;
  }
  .c-fab:active { opacity: 0.9; }
  @keyframes c-fab-in {
    from { opacity: 0; transform: translateX(-50%) translateY(100%); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .c-fab-left { display: flex; align-items: center; gap: 10px; }
  .c-fab-badge {
    background: #fff; color: var(--accent);
    font-size: 12px; font-weight: 700;
    min-width: 24px; height: 24px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-variant-numeric: tabular-nums;
  }
  .c-fab-price {
    font-variant-numeric: tabular-nums;
    font-size: 17px; font-weight: 800;
  }

  /* ── Overlay ── */
  .c-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 40;
    animation: c-fade-in .2s ease-out;
  }
  @keyframes c-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes c-slide-up {
    from { transform: translateX(-50%) translateY(100%); }
    to { transform: translateX(-50%) translateY(0); }
  }

  /* ── Cart Drawer ── */
  .c-drawer {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 480px; max-height: 85dvh;
    background: var(--bg-elevated); border-top-left-radius: 20px; border-top-right-radius: 20px;
    z-index: 50; display: flex; flex-direction: column; overflow: hidden;
    animation: c-slide-up .25s ease-out;
  }
  .c-drawer-handle {
    width: 36px; height: 4px; border-radius: 2px;
    background: var(--border-strong); margin: 10px auto 0;
    flex-shrink: 0;
  }
  .c-drawer-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 20px 16px;
  }
  .c-drawer-title {
    color: var(--text-primary); font-size: 18px; font-weight: 700;
    letter-spacing: -0.02em;
  }
  .c-drawer-close {
    width: 44px; height: 44px; border-radius: 12px;
    background: none; border: none; color: var(--text-secondary);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    margin: -8px -8px -8px 0;
  }
  .c-drawer-close:active { background: rgba(0,0,0,.05); }

  /* ── Cart items ── */
  .c-cart-items {
    flex: 1; overflow-y: auto; padding: 0 20px 12px;
    display: flex; flex-direction: column; gap: 8px;
    -webkit-overflow-scrolling: touch;
  }
  .c-cart-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px; background: var(--bg-surface); border-radius: 12px;
  }
  .c-cart-row-info { flex: 1; min-width: 0; }
  .c-cart-item-name {
    color: var(--text-primary); font-size: 15px; font-weight: 600;
    letter-spacing: -0.01em;
  }
  .c-cart-item-variant {
    color: var(--text-secondary); font-size: 13px; margin-top: 2px;
  }
  .c-cart-item-price {
    color: var(--accent); font-size: 15px; font-weight: 700;
    margin-top: 4px; font-variant-numeric: tabular-nums;
  }

  /* ── Qty controls ── */
  .c-qty { display: flex; align-items: center; gap: 6px; }
  .c-qty-btn {
    width: 44px; height: 44px; border-radius: 12px;
    border: 1.5px solid var(--border); background: transparent;
    color: var(--text-primary); display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-family: inherit;
    -webkit-tap-highlight-color: transparent;
    transition: background-color .12s ease-out, border-color .12s ease-out, color .12s ease-out;
  }
  .c-qty-btn:active { background: var(--accent-hover); border-color: var(--accent); color: var(--accent); }
  .c-qty-num {
    color: var(--text-primary); font-size: 15px; font-weight: 700;
    min-width: 24px; text-align: center;
    font-variant-numeric: tabular-nums;
  }

  /* ── Cart footer ── */
  .c-footer {
    padding: 16px 20px; padding-bottom: max(16px, env(safe-area-inset-bottom));
    background: var(--bg-surface);
  }
  .c-name-input {
    width: 100%; min-height: 48px; padding: 0 16px;
    border-radius: 12px; border: 1.5px solid var(--border);
    background: var(--bg-surface); color: var(--text-primary);
    font-size: 16px; font-family: inherit; outline: none;
    margin-bottom: 14px; transition: border-color .15s;
  }
  .c-name-input::placeholder { color: var(--text-placeholder); }
  .c-name-input:focus { border-color: var(--accent); }
  .c-total-row {
    display: flex; justify-content: space-between;
    align-items: baseline; margin-bottom: 14px;
  }
  .c-total-label { color: var(--text-secondary); font-size: 14px; font-weight: 500; }
  .c-total-value {
    color: var(--text-primary); font-size: 22px; font-weight: 700;
    letter-spacing: -0.02em; font-variant-numeric: tabular-nums;
  }
  .c-submit {
    width: 100%; min-height: 52px; border-radius: 14px;
    border: none; background: var(--accent); color: #fff;
    font-size: 16px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-family: inherit; transition: opacity .15s ease-out, transform .15s ease-out;
    -webkit-tap-highlight-color: transparent;
  }
  .c-submit:active { transform: scale(0.98); }
  .c-submit:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  /* ── Empty state ── */
  .c-empty {
    text-align: center; padding: 80px 20px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .c-empty svg { color: var(--border-strong); }
  .c-empty p { color: var(--text-secondary); font-size: 15px; font-weight: 500; }

  /* ── Success overlay ── */
  .c-success {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(0,0,0,.45);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: c-fade-in .25s ease-out;
  }
  .c-success-card {
    background: var(--bg-surface); border-radius: 24px;
    padding: 48px 32px 36px; text-align: center;
    width: 100%; max-width: 340px;
    animation: c-pop-in .3s ease-out;
  }
  @keyframes c-pop-in {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }
  .c-success-icon {
    width: 64px; height: 64px; border-radius: 32px;
    background: var(--accent-active);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; color: var(--accent);
  }
  .c-success-title {
    color: var(--text-primary); font-size: 20px; font-weight: 700;
    letter-spacing: -0.02em; margin-bottom: 8px;
  }
  .c-success-desc {
    color: var(--text-secondary); font-size: 14px; line-height: 1.55;
  }
  .c-success-action { margin-top: 24px; }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .c-toast, .c-fab, .c-drawer, .c-overlay, .c-success, .c-success-card, .c-detail, .c-pop-in {
      animation: none !important;
    }
    .c-tab:active, .c-pill:active, .c-card:active,
    .c-fab:active, .c-qty-btn:active, .c-submit:active,
    .c-detail-add:active, .c-detail-qty-btn:active {
      transform: none !important;
    }
  }
`

export default function CardapioPage({ shop, categories, products, mesa, initialChannel = 'presencial' }: {
  shop: Shop; categories: Category[]; products: Product[]; mesa: number | null
  initialChannel?: 'presencial' | 'delivery'
}) {
  const [channel, setChannel] = useState<'presencial' | 'delivery'>(initialChannel)
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [clientName, setClientName] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null)
  const [visibleCatId, setVisibleCatId] = useState<string | null>(null)

  // Product detail sheet
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailQty, setDetailQty] = useState(1)
  const [detailVariant, setDetailVariant] = useState<PriceVariant | null>(null)

  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const detailCloseRef = useRef<HTMLButtonElement>(null)
  const pillsRef = useRef<HTMLElement>(null)
  const isScrollingToCat = useRef(false)

  const filteredCats = useMemo(() =>
    categories.filter(c => c.channel === channel || c.channel === 'ambos'),
    [categories, channel]
  )

  const filteredProducts = useMemo(() => {
    const catFilter = activeCat
      ? products.filter(p => p.category_id === activeCat)
      : products.filter(p => filteredCats.some(c => c.id === p.category_id))
    return catFilter.filter(p => p.channel === channel || p.channel === 'ambos')
  }, [products, activeCat, filteredCats, channel])

  const cartTotal = useMemo(() =>
    cart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0), [cart]
  )
  const cartCount = useMemo(() =>
    cart.reduce((sum, i) => sum + i.quantity, 0), [cart]
  )

  const showToast = useCallback((msg: string, error = false) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, error })
    toastTimer.current = setTimeout(() => setToast(null), error ? 3500 : 1300)
  }, [])

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])

  // IntersectionObserver: track which category section is visible
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-cat-section]')
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingToCat.current) return
        let bestId: string | null = null
        let bestRatio = 0
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-cat-section')
            if (id && entry.intersectionRatio > bestRatio) {
              bestId = id
              bestRatio = entry.intersectionRatio
            }
          }
        })
        if (bestId) setVisibleCatId(bestId)
      },
      { rootMargin: '-160px 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [filteredCats, channel])

  // Scroll active pill into view (use scrollLeft to avoid window scroll reset on mobile)
  useEffect(() => {
    if (!visibleCatId || !pillsRef.current) return
    const container = pillsRef.current
    const pill = container.querySelector<HTMLElement>(`[data-pill-id="${visibleCatId}"]`)
    if (pill) {
      const pillCenter = pill.offsetLeft + pill.offsetWidth / 2
      const scrollTarget = pillCenter - container.clientWidth / 2
      container.scrollTo({ left: scrollTarget, behavior: 'smooth' })
    }
  }, [visibleCatId])

  // Focus trap + Escape for cart drawer
  useEffect(() => {
    if (!drawerOpen) return
    closeRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { closeDrawer(); return }
      if (e.key !== 'Tab' || !drawerRef.current) return
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  // Focus trap + Escape for detail sheet
  useEffect(() => {
    if (!selectedProduct) return
    detailCloseRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { closeDetail(); return }
      if (e.key !== 'Tab' || !detailRef.current) return
      const focusable = detailRef.current.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectedProduct])

  // Focus + Escape for success
  const successBtnRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!success) return
    successBtnRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeSuccess()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [success])

  // Back button closes modals via popstate
  const modalStack = useRef<string[]>([])
  const pushModal = useCallback((id: string) => {
    modalStack.current.push(id)
    history.pushState({ modal: id }, '')
  }, [])
  const popModal = useCallback((id: string) => {
    const idx = modalStack.current.lastIndexOf(id)
    if (idx >= 0) {
      modalStack.current.splice(idx, 1)
      if (history.state?.modal === id) history.back()
    }
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const top = modalStack.current.pop()
      if (top === 'success') setSuccess(false)
      else if (top === 'drawer') setDrawerOpen(false)
      else if (top === 'detail') setSelectedProduct(null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Push/pop history entries when modals open/close
  useEffect(() => { if (selectedProduct) pushModal('detail'); return () => { /* popModal handled in close fns */ } }, [!!selectedProduct])
  useEffect(() => { if (drawerOpen) pushModal('drawer') }, [drawerOpen])
  useEffect(() => { if (success && !modalStack.current.includes('success')) pushModal('success') }, [success])

  const closeDetail = useCallback(() => { setSelectedProduct(null); popModal('detail') }, [popModal])
  const closeDrawer = useCallback(() => { setDrawerOpen(false); popModal('drawer') }, [popModal])
  const closeSuccess = useCallback(() => { setSuccess(false); popModal('success') }, [popModal])

  function openProduct(p: Product) {
    setSelectedProduct(p)
    setDetailQty(1)
    const variants = p.price_variants as PriceVariant[] | null
    setDetailVariant(variants?.length ? variants[0] : null)
  }

  function addFromDetail() {
    if (!selectedProduct) return
    const variant = detailVariant
    const price = variant?.price ?? selectedProduct.price
    const key = `${selectedProduct.id}|${variant?.label ?? ''}`
    setCart(prev => {
      const idx = prev.findIndex(i => `${i.product_id}|${i.variant_label ?? ''}` === key)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + detailQty }
        return next
      }
      return [...prev, {
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        variant_label: variant?.label,
        unit_price: price,
        quantity: detailQty,
      }]
    })
    const label = variant ? `${selectedProduct.name} (${variant.label})` : selectedProduct.name
    showToast(`${detailQty}x ${label}`)
    closeDetail()
  }

  function updateQty(productId: string, variantLabel: string | undefined, delta: number) {
    setCart(prev => {
      const key = `${productId}|${variantLabel ?? ''}`
      const idx = prev.findIndex(i => `${i.product_id}|${i.variant_label ?? ''}` === key)
      if (idx < 0) return prev
      const next = [...prev]
      next[idx] = { ...next[idx], quantity: next[idx].quantity + delta }
      if (next[idx].quantity <= 0) next.splice(idx, 1)
      return next
    })
  }

  async function submitOrder() {
    if (cart.length === 0) return
    setSending(true)
    try {
      const res = await fetch(`/api/menu/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barbershop_id: shop.id,
          source: channel === 'presencial' ? 'qrcode' : 'whatsapp_delivery',
          table_number: mesa,
          client_name: clientName || undefined,
          items: cart,
        }),
      })
      if (!res.ok) throw new Error('Erro ao enviar pedido')
      setCart([])
      setDrawerOpen(false)
      // Swap drawer→success in stack and history (replaceState avoids
      // the popstate race that would immediately close the success overlay)
      const idx = modalStack.current.lastIndexOf('drawer')
      if (idx >= 0) {
        modalStack.current[idx] = 'success'
        history.replaceState({ modal: 'success' }, '')
      }
      setSuccess(true)
    } catch {
      showToast('Erro ao enviar pedido. Tente novamente.', true)
    } finally {
      setSending(false)
    }
  }

  function scrollToCategory(catId: string) {
    setActiveCat(null)
    isScrollingToCat.current = true
    setVisibleCatId(catId)
    setTimeout(() => {
      document.getElementById(`cat-${catId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => { isScrollingToCat.current = false }, 600)
    }, 50)
  }

  const activePillId = activeCat ?? visibleCatId
  const detailPrice = detailVariant?.price ?? selectedProduct?.price ?? 0
  const detailTotal = detailPrice * detailQty

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="c-wrap">
        {/* Shop Hero */}
        <div>
          {shop.cover_url ? (
            <img src={shop.cover_url} alt="" className="c-hero-cover" fetchPriority="high" />
          ) : (
            <div className="c-hero-cover-placeholder">
              <Coffee size={40} strokeWidth={1.2} />
            </div>
          )}
          <div className="c-hero-info">
            <div className="c-hero-avatar">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt={shop.nome} />
              ) : (
                <div className="c-hero-avatar-fallback">
                  {shop.nome.charAt(0)}
                </div>
              )}
            </div>
            <h1 className="c-shop-name">{shop.nome}</h1>
            {shop.endereco && <p className="c-shop-address">{shop.endereco}</p>}
            {mesa != null && <p className="c-mesa">Mesa {mesa}</p>}

            {/* Channel tabs (scroll away with hero) */}
            <nav className="c-tabs" aria-label="Canal de atendimento">
              <button
                className="c-tab"
                data-active={channel === 'presencial'}
                onClick={() => { setChannel('presencial'); setActiveCat(null); setVisibleCatId(null) }}
                aria-pressed={channel === 'presencial'}
              >
                <Coffee size={16} strokeWidth={2.2} /> Presencial
              </button>
              <button
                className="c-tab"
                data-active={channel === 'delivery'}
                onClick={() => { setChannel('delivery'); setActiveCat(null); setVisibleCatId(null) }}
                aria-pressed={channel === 'delivery'}
              >
                <Truck size={16} strokeWidth={2.2} /> Delivery
              </button>
            </nav>
          </div>
        </div>

        {/* Sticky pills only */}
        <header className="c-header">
        {/* Category pills */}
        <div className="c-cats-wrap">
        <nav className="c-cats" aria-label="Categorias" ref={pillsRef}>
          <button
            className="c-pill"
            data-active={activePillId === null}
            aria-pressed={activePillId === null}
            onClick={() => { setActiveCat(null); setVisibleCatId(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          >
            Todos
          </button>
          {filteredCats.map(c => (
            <button
              key={c.id}
              className="c-pill"
              data-active={activePillId === c.id}
              aria-pressed={activePillId === c.id}
              data-pill-id={c.id}
              onClick={() => scrollToCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </nav>
        </div>
        </header>

        {/* Products */}
        <div className="c-list">
          {filteredProducts.length === 0 ? (
            <div className="c-empty">
              <Coffee size={48} strokeWidth={1.5} />
              <p>Nenhum produto disponível</p>
            </div>
          ) : (
            filteredCats
              .filter(c => !activeCat || c.id === activeCat)
              .map(cat => {
                const catProducts = filteredProducts.filter(p => p.category_id === cat.id)
                if (catProducts.length === 0) return null
                return (
                  <section key={cat.id} id={`cat-${cat.id}`} data-cat-section={cat.id}>
                    <h2 className="c-cat-title">{cat.name}</h2>
                    {catProducts.map(p => {
                      const hasVariants = !!p.price_variants?.length
                      const minPrice = hasVariants
                        ? Math.min(...(p.price_variants as PriceVariant[]).map(v => v.price))
                        : p.price
                      return (
                        <button
                          key={p.id}
                          className="c-card"
                          onClick={() => openProduct(p)}
                          aria-label={`${p.name}, ${hasVariants ? `a partir de ${BRL(minPrice)}` : BRL(p.price)}`}
                        >
                          <div className="c-card-info">
                            <p className="c-card-name">{p.name}</p>
                            {p.description && <p className="c-card-desc">{p.description}</p>}
                            {hasVariants ? (
                              <p className="c-card-from">
                                A partir de <span className="c-card-from-price">{BRL(minPrice)}</span>
                              </p>
                            ) : (
                              <p className="c-card-price">{BRL(p.price)}</p>
                            )}
                          </div>
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="c-card-img" loading="lazy" />
                          ) : (
                            <div className="c-card-no-img" aria-hidden="true">
                              <Coffee size={28} strokeWidth={1.5} />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </section>
                )
              })
          )}
        </div>

        {/* Add-to-cart toast */}
        {toast && (
          <div className="c-toast" key={toast.msg + (toast.error ? '-err' : '')} data-error={toast.error || undefined} role="status" aria-live="polite">
            {toast.error ? <X size={16} strokeWidth={2.5} /> : <Check size={16} strokeWidth={2.5} />} {toast.msg}
          </div>
        )}

        {/* Cart FAB */}
        {cartCount > 0 && !selectedProduct && (
          <button className="c-fab" onClick={() => setDrawerOpen(true)} aria-label={`Ver pedido, ${cartCount} itens`}>
            <span className="c-fab-left">
              <ShoppingCart size={18} strokeWidth={2.2} />
              Ver Pedido
              <span className="c-fab-badge">{cartCount}</span>
            </span>
            <span className="c-fab-price">{BRL(cartTotal)}</span>
          </button>
        )}

        {/* ── Product Detail Sheet ── */}
        {selectedProduct && (
          <>
            <div className="c-overlay" onClick={closeDetail} aria-hidden="true" />
            <div className="c-detail" role="dialog" aria-modal="true" aria-label={selectedProduct.name} ref={detailRef}>
              <div className="c-detail-scroll">
                {/* Hero image */}
                <div className="c-detail-hero">
                  {selectedProduct.image_url ? (
                    <img src={heroUrl(selectedProduct.image_url)} alt={selectedProduct.name} />
                  ) : (
                    <div className="c-detail-hero-placeholder">
                      <Coffee size={56} strokeWidth={1.2} />
                    </div>
                  )}
                  <button
                    ref={detailCloseRef}
                    className="c-detail-close"
                    onClick={closeDetail}
                    aria-label="Fechar"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Body */}
                <div className="c-detail-body">
                  <h2 className="c-detail-name">{selectedProduct.name}</h2>
                  {selectedProduct.description && (
                    <p className="c-detail-desc">{selectedProduct.description}</p>
                  )}

                  {!(selectedProduct.price_variants as PriceVariant[] | null)?.length && (
                    <div className="c-detail-price-row">
                      <span className="c-detail-price">{BRL(selectedProduct.price)}</span>
                    </div>
                  )}

                  {/* Variants */}
                  {!!(selectedProduct.price_variants as PriceVariant[] | null)?.length && (
                    <div className="c-detail-variants">
                      <p className="c-detail-variants-title">Escolha uma opção</p>
                      <p className="c-detail-variants-sub">Selecione 1 opção</p>
                      {(selectedProduct.price_variants as PriceVariant[]).map(v => (
                        <button
                          key={v.label}
                          className="c-detail-var"
                          onClick={() => setDetailVariant(v)}
                          aria-pressed={detailVariant?.label === v.label}
                          aria-label={`${v.label}, ${BRL(v.price)}`}
                        >
                          <div className="c-detail-var-info">
                            <p className="c-detail-var-label">{v.label}</p>
                            <p className="c-detail-var-price">{BRL(v.price)}</p>
                          </div>
                          <div className="c-detail-radio" data-selected={detailVariant?.label === v.label} aria-hidden="true">
                            {detailVariant?.label === v.label && <div className="c-detail-radio-dot" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: qty + add */}
              <div className="c-detail-footer">
                <div className="c-detail-qty">
                  <button
                    className="c-detail-qty-btn"
                    data-disabled={detailQty <= 1}
                    onClick={() => setDetailQty(q => Math.max(1, q - 1))}
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={18} strokeWidth={2.2} />
                  </button>
                  <span className="c-detail-qty-num">{detailQty}</span>
                  <button
                    className="c-detail-qty-btn"
                    onClick={() => setDetailQty(q => q + 1)}
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={18} strokeWidth={2.2} />
                  </button>
                </div>
                <button className="c-detail-add" onClick={addFromDetail} aria-label={`Adicionar ${selectedProduct.name}, ${BRL(detailTotal)}`}>
                  Adicionar
                  <span>{BRL(detailTotal)}</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Cart Drawer */}
        {drawerOpen && (
          <>
            <div className="c-overlay" onClick={closeDrawer} aria-hidden="true" />
            <div className="c-drawer" role="dialog" aria-modal="true" aria-label="Seu pedido" ref={drawerRef}>
              <div className="c-drawer-handle" aria-hidden="true" />
              <div className="c-drawer-head">
                <h2 className="c-drawer-title">Seu Pedido</h2>
                <button
                  ref={closeRef}
                  className="c-drawer-close"
                  onClick={closeDrawer}
                  aria-label="Fechar"
                >
                  <X size={20} strokeWidth={2.2} />
                </button>
              </div>

              <div className="c-cart-items">
                {cart.map((item) => (
                  <div key={`${item.product_id}|${item.variant_label ?? ''}`} className="c-cart-row">
                    <div className="c-cart-row-info">
                      <p className="c-cart-item-name">{item.product_name}</p>
                      {item.variant_label && (
                        <p className="c-cart-item-variant">{item.variant_label}</p>
                      )}
                      <p className="c-cart-item-price">
                        {BRL(item.unit_price * item.quantity)}
                      </p>
                    </div>
                    <div className="c-qty">
                      <button
                        className="c-qty-btn"
                        onClick={() => updateQty(item.product_id, item.variant_label, -1)}
                        aria-label={`Diminuir ${item.product_name}`}
                      >
                        <Minus size={16} strokeWidth={2.2} />
                      </button>
                      <span className="c-qty-num">{item.quantity}</span>
                      <button
                        className="c-qty-btn"
                        onClick={() => updateQty(item.product_id, item.variant_label, 1)}
                        aria-label={`Aumentar ${item.product_name}`}
                      >
                        <Plus size={16} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="c-footer">
                <label>
                  <span className="sr-only">Seu nome</span>
                  <input
                    className="c-name-input"
                    placeholder="Seu nome (opcional)"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    autoComplete="given-name"
                  />
                </label>
                <div className="c-total-row">
                  <span className="c-total-label">Total</span>
                  <span className="c-total-value">{BRL(cartTotal)}</span>
                </div>
                <button
                  className="c-submit"
                  disabled={sending || cart.length === 0}
                  onClick={submitOrder}
                >
                  {sending ? (
                    'Enviando...'
                  ) : (
                    <><Send size={17} strokeWidth={2.2} /> Enviar Pedido</>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Success */}
        {success && (
          <div className="c-success" onClick={closeSuccess} role="dialog" aria-modal="true" aria-label="Pedido enviado">
            <div className="c-success-card" onClick={e => e.stopPropagation()}>
              <div className="c-success-icon">
                <Check size={28} strokeWidth={2.5} />
              </div>
              <h3 className="c-success-title">Pedido enviado</h3>
              <p className="c-success-desc">
                {mesa
                  ? `Seu pedido da mesa ${mesa} foi recebido. Aguarde o preparo.`
                  : 'Seu pedido foi recebido. Entraremos em contato.'}
              </p>
              <button
                ref={successBtnRef}
                className="c-submit c-success-action"
                onClick={closeSuccess}
              >
                Fazer outro pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
