'use client'
import { useState, useMemo } from 'react'
import { ShoppingCart, Plus, Minus, X, Send, Coffee, Truck } from 'lucide-react'

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

// ── Styles ──────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0d10; font-family: 'Inter', sans-serif; }
  .cardapio-wrap { max-width: 480px; margin: 0 auto; min-height: 100dvh; display: flex; flex-direction: column; }
  .cardapio-header { position: sticky; top: 0; z-index: 20; background: #0a0d10; border-bottom: 1px solid #1d2429; padding: 16px 20px; }
  .channel-tabs { display: flex; gap: 8px; margin-top: 12px; }
  .channel-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 0; border-radius: 8px; border: 1px solid #1d2429; background: transparent; color: #6c7884; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; font-family: inherit; }
  .channel-tab.active { background: #00e5a0; color: #000; border-color: #00e5a0; }
  .cat-scroll { display: flex; gap: 6px; overflow-x: auto; padding: 12px 20px; scrollbar-width: none; -ms-overflow-style: none; }
  .cat-scroll::-webkit-scrollbar { display: none; }
  .cat-chip { white-space: nowrap; padding: 6px 14px; border-radius: 20px; border: 1px solid #1d2429; background: transparent; color: #8c959e; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .15s; font-family: inherit; }
  .cat-chip.active { background: #00e5a0; color: #000; border-color: #00e5a0; }
  .product-list { flex: 1; padding: 8px 20px 100px; display: flex; flex-direction: column; gap: 10px; }
  .product-card { display: flex; gap: 14px; padding: 14px; background: #13181c; border: 1px solid #1d2429; border-radius: 12px; cursor: pointer; transition: border-color .15s; }
  .product-card:hover { border-color: #2a343c; }
  .product-info { flex: 1; min-width: 0; }
  .product-name { color: #e9eef3; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
  .product-desc { color: #6c7884; font-size: 12px; margin-top: 3px; line-height: 1.4; }
  .product-price { color: #00e5a0; font-size: 14px; font-weight: 600; margin-top: 6px; }
  .product-variants { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .variant-btn { padding: 5px 10px; border-radius: 6px; border: 1px solid #1d2429; background: transparent; color: #8c959e; font-size: 11.5px; cursor: pointer; transition: all .15s; font-family: inherit; }
  .variant-btn:hover, .variant-btn.selected { background: rgba(0,229,160,0.1); border-color: #00e5a0; color: #00e5a0; }
  .product-img { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; flex-shrink: 0; background: #1d2429; }
  .cart-fab { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; padding: 14px 24px; background: #00e5a0; color: #000; border: none; border-radius: 14px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 8px 32px rgba(0,229,160,0.3); z-index: 30; font-family: inherit; transition: transform .15s; }
  .cart-fab:active { transform: translateX(-50%) scale(0.97); }
  .cart-badge { background: #000; color: #00e5a0; font-size: 12px; font-weight: 700; min-width: 22px; height: 22px; border-radius: 11px; display: flex; align-items: center; justify-content: center; }
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 40; }
  .cart-drawer { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; max-height: 85dvh; background: #0f1316; border-top-left-radius: 20px; border-top-right-radius: 20px; z-index: 50; display: flex; flex-direction: column; overflow: hidden; }
  .cart-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #1d2429; }
  .cart-items { flex: 1; overflow-y: auto; padding: 12px 20px; display: flex; flex-direction: column; gap: 10px; }
  .cart-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: #13181c; border-radius: 10px; border: 1px solid #1d2429; }
  .cart-item-info { flex: 1; min-width: 0; }
  .qty-ctrl { display: flex; align-items: center; gap: 8px; }
  .qty-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid #1d2429; background: transparent; color: #e9eef3; display: flex; align-items: center; justify-content: center; cursor: pointer; font-family: inherit; }
  .qty-btn:hover { border-color: #00e5a0; color: #00e5a0; }
  .cart-footer { padding: 16px 20px; border-top: 1px solid #1d2429; }
  .cart-total { display: flex; justify-content: space-between; margin-bottom: 12px; }
  .send-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; background: #00e5a0; color: #000; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; transition: opacity .15s; }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .empty-state { text-align: center; padding: 60px 20px; color: #6c7884; }
  .empty-state svg { margin: 0 auto 16px; opacity: 0.3; }
  .section-label { color: #6c7884; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 8px 0 4px; }
  .name-input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #1d2429; background: #13181c; color: #e9eef3; font-size: 14px; font-family: inherit; outline: none; margin-bottom: 12px; }
  .name-input::placeholder { color: #3a454f; }
  .name-input:focus { border-color: #00e5a0; }
  .success-overlay { position: fixed; inset: 0; z-index: 60; background: rgba(0,0,0,.8); display: flex; align-items: center; justify-content: center; }
  .success-card { background: #13181c; border: 1px solid #1d2429; border-radius: 20px; padding: 40px 32px; text-align: center; max-width: 340px; }
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
    cart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0),
    [cart]
  )
  const cartCount = useMemo(() =>
    cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  )

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
      <div className="cardapio-wrap">
        {/* Header */}
        <div className="cardapio-header">
          <h1 style={{ color: '#e9eef3', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {shop.nome}
          </h1>
          {mesa && (
            <p style={{ color: '#00e5a0', fontSize: 12, fontWeight: 600, marginTop: 2 }}>
              Mesa {mesa}
            </p>
          )}
          <div className="channel-tabs">
            <button
              className={`channel-tab ${channel === 'presencial' ? 'active' : ''}`}
              onClick={() => { setChannel('presencial'); setActiveCat(null) }}
            >
              <Coffee size={14} /> Presencial
            </button>
            <button
              className={`channel-tab ${channel === 'delivery' ? 'active' : ''}`}
              onClick={() => { setChannel('delivery'); setActiveCat(null) }}
            >
              <Truck size={14} /> Delivery
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className="cat-scroll">
          <button
            className={`cat-chip ${activeCat === null ? 'active' : ''}`}
            onClick={() => setActiveCat(null)}
          >
            Todos
          </button>
          {filteredCats.map(c => (
            <button
              key={c.id}
              className={`cat-chip ${activeCat === c.id ? 'active' : ''}`}
              onClick={() => setActiveCat(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <Coffee size={48} />
              <p style={{ fontSize: 15, fontWeight: 500 }}>Nenhum produto disponível</p>
            </div>
          ) : (
            filteredCats
              .filter(c => !activeCat || c.id === activeCat)
              .map(cat => {
                const catProducts = filteredProducts.filter(p => p.category_id === cat.id)
                if (catProducts.length === 0) return null
                return (
                  <div key={cat.id}>
                    <p className="section-label">{cat.name}</p>
                    {catProducts.map(p => (
                      <div key={p.id} className="product-card" onClick={() => {
                        if (!p.price_variants?.length) addToCart(p)
                      }}>
                        {p.image_url && <img src={p.image_url} alt={p.name} className="product-img" />}
                        <div className="product-info">
                          <p className="product-name">{p.name}</p>
                          {p.description && <p className="product-desc">{p.description}</p>}
                          {p.price_variants?.length ? (
                            <div className="product-variants">
                              {(p.price_variants as PriceVariant[]).map(v => (
                                <button
                                  key={v.label}
                                  className="variant-btn"
                                  onClick={e => { e.stopPropagation(); addToCart(p, v) }}
                                >
                                  {v.label} — {BRL(v.price)}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="product-price">{BRL(p.price)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })
          )}
        </div>

        {/* Cart FAB */}
        {cartCount > 0 && (
          <button className="cart-fab" onClick={() => setDrawerOpen(true)}>
            <ShoppingCart size={18} />
            Ver Pedido
            <span className="cart-badge">{cartCount}</span>
            <span style={{ marginLeft: 4 }}>{BRL(cartTotal)}</span>
          </button>
        )}

        {/* Cart Drawer */}
        {drawerOpen && (
          <>
            <div className="overlay" onClick={() => setDrawerOpen(false)} />
            <div className="cart-drawer">
              <div className="cart-header">
                <h2 style={{ color: '#e9eef3', fontSize: 16, fontWeight: 600 }}>Seu Pedido</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#6c7884', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="cart-items">
                {cart.map((item, idx) => (
                  <div key={`${item.product_id}-${item.variant_label}`} className="cart-item">
                    <div className="cart-item-info">
                      <p style={{ color: '#e9eef3', fontSize: 13.5, fontWeight: 500 }}>{item.product_name}</p>
                      {item.variant_label && (
                        <p style={{ color: '#6c7884', fontSize: 11.5, marginTop: 1 }}>{item.variant_label}</p>
                      )}
                      <p style={{ color: '#00e5a0', fontSize: 13, fontWeight: 600, marginTop: 3 }}>
                        {BRL(item.unit_price * item.quantity)}
                      </p>
                    </div>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => updateQty(idx, -1)}>
                        <Minus size={14} />
                      </button>
                      <span style={{ color: '#e9eef3', fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button className="qty-btn" onClick={() => updateQty(idx, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <input
                  className="name-input"
                  placeholder="Seu nome (opcional)"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                />
                <div className="cart-total">
                  <span style={{ color: '#8c959e', fontSize: 14 }}>Total</span>
                  <span style={{ color: '#e9eef3', fontSize: 18, fontWeight: 700 }}>{BRL(cartTotal)}</span>
                </div>
                <button className="send-btn" disabled={sending || cart.length === 0} onClick={submitOrder}>
                  <Send size={16} />
                  {sending ? 'Enviando...' : 'Enviar Pedido'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Success */}
        {success && (
          <div className="success-overlay" onClick={() => setSuccess(false)}>
            <div className="success-card" onClick={e => e.stopPropagation()}>
              <div style={{
                width: 56, height: 56, borderRadius: 28, background: 'rgba(0,229,160,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <ShoppingCart size={24} style={{ color: '#00e5a0' }} />
              </div>
              <h3 style={{ color: '#e9eef3', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                Pedido Enviado!
              </h3>
              <p style={{ color: '#6c7884', fontSize: 13.5, lineHeight: 1.5 }}>
                {mesa
                  ? `Seu pedido da mesa ${mesa} foi recebido. Aguarde o preparo.`
                  : 'Seu pedido foi recebido. Entraremos em contato.'}
              </p>
              <button
                onClick={() => setSuccess(false)}
                style={{
                  marginTop: 20, padding: '12px 32px', borderRadius: 10,
                  border: 'none', background: '#00e5a0', color: '#000',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Fazer Outro Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
