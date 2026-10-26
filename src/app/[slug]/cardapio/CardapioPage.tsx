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
type Shop = { id: string; nome: string; slug: string; telefone?: string }

type CartItem = {
  product_id: string; product_name: string; variant_label?: string
  unit_price: number; quantity: number; notes?: string
}

const BRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0d10; }

  .c-wrap {
    max-width: 480px; margin: 0 auto; min-height: 100dvh;
    display: flex; flex-direction: column;
    font-family: var(--font-geist-sans, system-ui, -apple-system, sans-serif);
    -webkit-font-smoothing: antialiased;
  }

  /* ── Header ── */
  .c-header {
    position: sticky; top: 0; z-index: 20;
    background: #0a0d10; padding: 16px 20px 0;
  }
  .c-header::after {
    content: ''; display: block;
    height: 1px; background: #1d2429;
    margin: 0 -20px;
  }
  .c-shop-name {
    color: #e9eef3; font-size: 20px; font-weight: 700;
    letter-spacing: -0.025em; line-height: 1.15;
  }
  .c-mesa {
    color: #00e5a0; font-size: 13px; font-weight: 600; margin-top: 2px;
    font-variant-numeric: tabular-nums;
  }

  /* ── Channel tabs ── */
  .c-tabs { display: flex; gap: 8px; padding: 14px 0 14px; }
  .c-tab {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
    min-height: 44px; border-radius: 10px;
    border: 1.5px solid #1d2429; background: transparent;
    color: #6c7884; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all .2s ease-out;
    font-family: inherit; -webkit-tap-highlight-color: transparent;
  }
  .c-tab:active { transform: scale(0.97); }
  .c-tab[data-active="true"] {
    background: #00e5a0; color: #0a0d10;
    border-color: #00e5a0; font-weight: 600;
  }

  /* ── Category pills ── */
  .c-cats {
    display: flex; gap: 8px; overflow-x: auto;
    padding: 4px 20px 14px; scrollbar-width: none;
  }
  .c-cats::-webkit-scrollbar { display: none; }
  .c-pill {
    white-space: nowrap; min-height: 38px;
    padding: 0 16px; border-radius: 19px;
    display: flex; align-items: center;
    border: 1.5px solid #1d2429; background: transparent;
    color: #8c959e; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all .2s ease-out;
    font-family: inherit; -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .c-pill:active { transform: scale(0.96); }
  .c-pill[data-active="true"] {
    background: #00e5a0; color: #0a0d10;
    border-color: #00e5a0; font-weight: 600;
  }

  /* ── Product list ── */
  .c-list {
    flex: 1; padding: 0 20px 120px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .c-cat-title {
    color: #e9eef3; font-size: 15px; font-weight: 600;
    letter-spacing: -0.01em;
    padding: 16px 0 8px;
  }
  .c-cat-title:first-child { padding-top: 4px; }

  /* ── Product card ── */
  .c-card {
    display: flex; gap: 14px; padding: 16px;
    background: #13181c; border-radius: 14px;
    cursor: pointer; transition: background .15s ease-out;
    -webkit-tap-highlight-color: transparent;
    position: relative; overflow: hidden;
  }
  .c-card:active { background: #181e23; }
  .c-card-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .c-card-name {
    color: #e9eef3; font-size: 15px; font-weight: 600;
    letter-spacing: -0.01em; line-height: 1.3;
  }
  .c-card-desc {
    color: #6c7884; font-size: 13px; margin-top: 4px;
    line-height: 1.45; display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .c-card-price {
    color: #00e5a0; font-size: 16px; font-weight: 700;
    margin-top: auto; padding-top: 8px;
    font-variant-numeric: tabular-nums;
  }
  .c-card-add {
    position: absolute; bottom: 12px; right: 12px;
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(0,229,160,0.12); border: none;
    color: #00e5a0; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s ease-out;
    -webkit-tap-highlight-color: transparent;
  }
  .c-card-add:active { transform: scale(0.9); background: rgba(0,229,160,0.2); }

  /* ── Variants ── */
  .c-variants { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .c-var-btn {
    min-height: 38px; padding: 0 14px; border-radius: 10px;
    border: 1.5px solid #1d2429; background: transparent;
    color: #8c959e; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all .15s ease-out;
    font-family: inherit; -webkit-tap-highlight-color: transparent;
    display: flex; align-items: center;
  }
  .c-var-btn:active { transform: scale(0.96); }
  .c-var-btn:hover { background: rgba(0,229,160,0.06); border-color: #2a343c; }

  /* ── Product image ── */
  .c-card-img {
    width: 80px; height: 80px; border-radius: 12px;
    object-fit: cover; flex-shrink: 0; background: #1d2429;
  }

  /* ── Toast (add feedback) ── */
  .c-toast {
    position: fixed; bottom: 88px; left: 50%; z-index: 35;
    background: #e9eef3; color: #0a0d10;
    padding: 10px 20px; border-radius: 12px;
    font-size: 14px; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    pointer-events: none;
    animation: c-toast-in .3s ease-out forwards, c-toast-out .3s ease-in .9s forwards;
  }
  @keyframes c-toast-in {
    from { opacity: 0; transform: translate(-50%, 12px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes c-toast-out {
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, -8px); }
  }

  /* ── Cart FAB ── */
  .c-fab {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 10px;
    min-height: 52px; padding: 0 24px;
    background: #00e5a0; color: #0a0d10; border: none; border-radius: 16px;
    font-size: 15px; font-weight: 700; cursor: pointer;
    font-family: inherit; z-index: 30;
    transition: transform .15s ease-out;
    -webkit-tap-highlight-color: transparent;
    animation: c-fab-in .3s ease-out;
  }
  .c-fab:active { transform: translateX(-50%) scale(0.96); }
  @keyframes c-fab-in {
    from { opacity: 0; transform: translateX(-50%) translateY(16px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .c-fab-badge {
    background: #0a0d10; color: #00e5a0;
    font-size: 12px; font-weight: 700;
    min-width: 24px; height: 24px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-variant-numeric: tabular-nums;
  }
  .c-fab-price { font-variant-numeric: tabular-nums; }

  /* ── Overlay + Drawer ── */
  .c-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 40;
    animation: c-fade-in .2s ease-out;
  }
  @keyframes c-fade-in { from { opacity: 0; } to { opacity: 1; } }

  .c-drawer {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 480px; max-height: 85dvh;
    background: #0f1316; border-top-left-radius: 20px; border-top-right-radius: 20px;
    z-index: 50; display: flex; flex-direction: column; overflow: hidden;
    animation: c-slide-up .25s ease-out;
  }
  @keyframes c-slide-up {
    from { transform: translateX(-50%) translateY(100%); }
    to { transform: translateX(-50%) translateY(0); }
  }
  .c-drawer-handle {
    width: 36px; height: 4px; border-radius: 2px;
    background: #2a343c; margin: 10px auto 0;
    flex-shrink: 0;
  }
  .c-drawer-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 20px 16px;
  }
  .c-drawer-close {
    width: 44px; height: 44px; border-radius: 12px;
    background: none; border: none; color: #6c7884;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    margin: -8px -8px -8px 0;
  }
  .c-drawer-close:active { background: rgba(255,255,255,.04); }

  /* ── Cart items ── */
  .c-cart-items {
    flex: 1; overflow-y: auto; padding: 0 20px 12px;
    display: flex; flex-direction: column; gap: 8px;
    -webkit-overflow-scrolling: touch;
  }
  .c-cart-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px; background: #13181c; border-radius: 12px;
  }
  .c-cart-row-info { flex: 1; min-width: 0; }

  /* ── Qty controls ── */
  .c-qty { display: flex; align-items: center; gap: 6px; }
  .c-qty-btn {
    width: 44px; height: 44px; border-radius: 12px;
    border: 1.5px solid #1d2429; background: transparent;
    color: #e9eef3; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-family: inherit;
    -webkit-tap-highlight-color: transparent;
    transition: all .12s ease-out;
  }
  .c-qty-btn:active { background: rgba(0,229,160,0.08); border-color: #00e5a0; color: #00e5a0; }
  .c-qty-num {
    color: #e9eef3; font-size: 15px; font-weight: 700;
    min-width: 24px; text-align: center;
    font-variant-numeric: tabular-nums;
  }

  /* ── Cart footer ── */
  .c-footer { padding: 16px 20px; padding-bottom: max(16px, env(safe-area-inset-bottom)); }
  .c-footer::before {
    content: ''; display: block;
    height: 1px; background: #1d2429;
    margin: 0 -20px 16px;
  }
  .c-name-input {
    width: 100%; min-height: 48px; padding: 0 16px;
    border-radius: 12px; border: 1.5px solid #1d2429;
    background: #13181c; color: #e9eef3;
    font-size: 15px; font-family: inherit; outline: none;
    margin-bottom: 14px; transition: border-color .15s;
  }
  .c-name-input::placeholder { color: #3a454f; }
  .c-name-input:focus { border-color: #00e5a0; }

  .c-total-row {
    display: flex; justify-content: space-between;
    align-items: baseline; margin-bottom: 14px;
  }
  .c-total-label { color: #6c7884; font-size: 14px; font-weight: 500; }
  .c-total-value {
    color: #e9eef3; font-size: 22px; font-weight: 700;
    letter-spacing: -0.02em; font-variant-numeric: tabular-nums;
  }

  .c-submit {
    width: 100%; min-height: 52px; border-radius: 14px;
    border: none; background: #00e5a0; color: #0a0d10;
    font-size: 16px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-family: inherit; transition: all .15s ease-out;
    -webkit-tap-highlight-color: transparent;
  }
  .c-submit:active { transform: scale(0.98); }
  .c-submit:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  /* ── Empty state ── */
  .c-empty {
    text-align: center; padding: 80px 20px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .c-empty svg { color: #2a343c; }
  .c-empty p { color: #6c7884; font-size: 15px; font-weight: 500; }

  /* ── Success overlay ── */
  .c-success {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(0,0,0,.8);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: c-fade-in .25s ease-out;
  }
  .c-success-card {
    background: #13181c; border-radius: 24px;
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
    background: rgba(0,229,160,0.12);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .c-toast, .c-fab, .c-drawer, .c-overlay, .c-success, .c-success-card {
      animation: none !important;
    }
    .c-tab:active, .c-pill:active, .c-card:active,
    .c-fab:active, .c-var-btn:active, .c-qty-btn:active,
    .c-submit:active, .c-card-add:active {
      transform: none !important;
    }
  }
`

export default function CardapioPage({ shop, categories, products, mesa }: {
  shop: Shop; categories: Category[]; products: Product[]; mesa: number | null
}) {
  const [channel, setChannel] = useState<'presencial' | 'delivery'>('presencial')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [clientName, setClientName] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null)

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

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 1300)
  }, [])

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])

  function addToCart(product: Product, variant?: PriceVariant) {
    const price = variant?.price ?? product.price
    const key = `${product.id}|${variant?.label ?? ''}`
    setCart(prev => {
      const idx = prev.findIndex(i => `${i.product_id}|${i.variant_label ?? ''}` === key)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        return next
      }
      return [...prev, {
        product_id: product.id,
        product_name: product.name,
        variant_label: variant?.label,
        unit_price: price,
        quantity: 1,
      }]
    })
    showToast(variant ? `${product.name} (${variant.label})` : product.name)
  }

  function updateQty(idx: number, delta: number) {
    setCart(prev => {
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
      setSuccess(true)
      setCart([])
      setDrawerOpen(false)
    } catch {
      alert('Erro ao enviar pedido. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="c-wrap">
        {/* Header */}
        <header className="c-header">
          <h1 className="c-shop-name">{shop.nome}</h1>
          {mesa != null && <p className="c-mesa">Mesa {mesa}</p>}
          <nav className="c-tabs" aria-label="Canal de atendimento">
            <button
              className="c-tab"
              data-active={channel === 'presencial'}
              onClick={() => { setChannel('presencial'); setActiveCat(null) }}
              aria-pressed={channel === 'presencial'}
            >
              <Coffee size={16} strokeWidth={2.2} /> Presencial
            </button>
            <button
              className="c-tab"
              data-active={channel === 'delivery'}
              onClick={() => { setChannel('delivery'); setActiveCat(null) }}
              aria-pressed={channel === 'delivery'}
            >
              <Truck size={16} strokeWidth={2.2} /> Delivery
            </button>
          </nav>
        </header>

        {/* Category pills */}
        <nav className="c-cats" aria-label="Categorias">
          <button
            className="c-pill"
            data-active={activeCat === null}
            onClick={() => setActiveCat(null)}
          >
            Todos
          </button>
          {filteredCats.map(c => (
            <button
              key={c.id}
              className="c-pill"
              data-active={activeCat === c.id}
              onClick={() => setActiveCat(c.id)}
            >
              {c.name}
            </button>
          ))}
        </nav>

        {/* Products */}
        <div className="c-list" role="list">
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
                  <section key={cat.id}>
                    <h2 className="c-cat-title">{cat.name}</h2>
                    {catProducts.map(p => (
                      <div
                        key={p.id}
                        className="c-card"
                        role="listitem"
                        onClick={() => {
                          if (!p.price_variants?.length) addToCart(p)
                        }}
                      >
                        <div className="c-card-info">
                          <p className="c-card-name">{p.name}</p>
                          {p.description && <p className="c-card-desc">{p.description}</p>}
                          {p.price_variants?.length ? (
                            <div className="c-variants">
                              {(p.price_variants as PriceVariant[]).map(v => (
                                <button
                                  key={v.label}
                                  className="c-var-btn"
                                  onClick={e => { e.stopPropagation(); addToCart(p, v) }}
                                  aria-label={`Adicionar ${p.name} ${v.label} por ${BRL(v.price)}`}
                                >
                                  {v.label} · {BRL(v.price)}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="c-card-price">{BRL(p.price)}</p>
                          )}
                        </div>
                        {p.image_url && (
                          <img src={p.image_url} alt="" className="c-card-img" loading="lazy" />
                        )}
                        {!p.price_variants?.length && (
                          <button
                            className="c-card-add"
                            aria-label={`Adicionar ${p.name}`}
                            onClick={e => { e.stopPropagation(); addToCart(p) }}
                          >
                            <Plus size={18} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    ))}
                  </section>
                )
              })
          )}
        </div>

        {/* Add-to-cart toast */}
        {toast && (
          <div className="c-toast" key={toast} aria-live="polite">
            <Check size={16} strokeWidth={2.5} /> {toast}
          </div>
        )}

        {/* Cart FAB */}
        {cartCount > 0 && (
          <button className="c-fab" onClick={() => setDrawerOpen(true)} aria-label={`Ver pedido, ${cartCount} itens`}>
            <ShoppingCart size={18} strokeWidth={2.2} />
            Ver Pedido
            <span className="c-fab-badge">{cartCount}</span>
            <span className="c-fab-price">{BRL(cartTotal)}</span>
          </button>
        )}

        {/* Cart Drawer */}
        {drawerOpen && (
          <>
            <div className="c-overlay" onClick={() => setDrawerOpen(false)} />
            <div className="c-drawer" role="dialog" aria-label="Seu pedido">
              <div className="c-drawer-handle" />
              <div className="c-drawer-head">
                <h2 style={{ color: '#e9eef3', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Seu Pedido
                </h2>
                <button
                  className="c-drawer-close"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fechar"
                >
                  <X size={20} strokeWidth={2.2} />
                </button>
              </div>

              <div className="c-cart-items">
                {cart.map((item, idx) => (
                  <div key={`${item.product_id}-${item.variant_label}`} className="c-cart-row">
                    <div className="c-cart-row-info">
                      <p style={{ color: '#e9eef3', fontSize: 15px, fontWeight: 600, letterSpacing: '-0.01em' }}>
                        {item.product_name}
                      </p>
                      {item.variant_label && (
                        <p style={{ color: '#6c7884', fontSize: 13, marginTop: 2 }}>{item.variant_label}</p>
                      )}
                      <p style={{ color: '#00e5a0', fontSize: 15, fontWeight: 700, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                        {BRL(item.unit_price * item.quantity)}
                      </p>
                    </div>
                    <div className="c-qty">
                      <button
                        className="c-qty-btn"
                        onClick={() => updateQty(idx, -1)}
                        aria-label={`Diminuir ${item.product_name}`}
                      >
                        <Minus size={16} strokeWidth={2.2} />
                      </button>
                      <span className="c-qty-num">{item.quantity}</span>
                      <button
                        className="c-qty-btn"
                        onClick={() => updateQty(idx, 1)}
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
          <div className="c-success" onClick={() => setSuccess(false)}>
            <div className="c-success-card" onClick={e => e.stopPropagation()}>
              <div className="c-success-icon">
                <Check size={28} strokeWidth={2.5} style={{ color: '#00e5a0' }} />
              </div>
              <h3 style={{ color: '#e9eef3', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
                Pedido enviado
              </h3>
              <p style={{ color: '#6c7884', fontSize: 14, lineHeight: 1.55 }}>
                {mesa
                  ? `Seu pedido da mesa ${mesa} foi recebido. Aguarde o preparo.`
                  : 'Seu pedido foi recebido. Entraremos em contato.'}
              </p>
              <button
                className="c-submit"
                onClick={() => setSuccess(false)}
                style={{ marginTop: 24 }}
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
