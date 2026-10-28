'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Eye, EyeOff, Pencil, Trash2, X, Save, Coffee, Truck } from 'lucide-react'

type Category = {
  id: string; barbershop_id: string; name: string; channel: string
  sort_order: number; active: boolean; created_at: string
}
type Product = {
  id: string; barbershop_id: string; category_id: string; name: string
  description: string | null; price: number; price_variants: unknown
  image_url: string | null; channel: string; available: boolean
  sort_order: number; created_at: string
}

const card: React.CSSProperties = {
  background: 'var(--dash-bg-card)', border: '1px solid var(--dash-border)', borderRadius: 14, padding: 24,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--dash-border)',
  background: 'var(--dash-bg)', color: 'var(--dash-text)', fontSize: 14, fontFamily: 'inherit', outline: 'none',
}
const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 8, border: 'none', background: 'var(--dash-accent)',
  color: '#000', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  display: 'inline-flex', alignItems: 'center', gap: 6,
}
const btnGhost: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--dash-border)', background: 'transparent',
  color: 'var(--dash-text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
  display: 'inline-flex', alignItems: 'center', gap: 4,
}

export default function CardapioClient({ barbershopId, categories: initCats, products: initProds }: {
  barbershopId: string; categories: Category[]; products: Product[]
}) {
  const supabase = createClient()
  const [categories, setCategories] = useState(initCats)
  const [products, setProducts] = useState(initProds)
  const [filterChannel, setFilterChannel] = useState<string>('all')
  const [filterCat, setFilterCat] = useState<string>('all')
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [saving, setSaving] = useState(false)

  const filteredProducts = useMemo(() => {
    let list = products
    if (filterChannel !== 'all') list = list.filter(p => p.channel === filterChannel || p.channel === 'ambos')
    if (filterCat !== 'all') list = list.filter(p => p.category_id === filterCat)
    return list
  }, [products, filterChannel, filterCat])

  async function toggleAvailable(product: Product) {
    const { error } = await supabase
      .from('menu_products')
      .update({ available: !product.available })
      .eq('id', product.id)
    if (!error) {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, available: !p.available } : p))
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Remover este produto?')) return
    const { error } = await supabase.from('menu_products').delete().eq('id', id)
    if (!error) setProducts(prev => prev.filter(p => p.id !== id))
  }

  async function saveProduct() {
    if (!editingProduct?.name || !editingProduct?.category_id) return
    setSaving(true)
    try {
      if (editingProduct.id) {
        // Update
        const { data, error } = await supabase
          .from('menu_products')
          .update({
            name: editingProduct.name,
            description: editingProduct.description || null,
            price: editingProduct.price || 0,
            category_id: editingProduct.category_id,
            channel: editingProduct.channel || 'ambos',
          })
          .eq('id', editingProduct.id)
          .select()
          .single()
        if (!error && data) {
          setProducts(prev => prev.map(p => p.id === data.id ? data : p))
        }
      } else {
        // Insert
        const { data, error } = await supabase
          .from('menu_products')
          .insert({
            barbershop_id: barbershopId,
            name: editingProduct.name,
            description: editingProduct.description || null,
            price: editingProduct.price || 0,
            category_id: editingProduct.category_id,
            channel: editingProduct.channel || 'ambos',
            available: true,
            sort_order: products.length,
          })
          .select()
          .single()
        if (!error && data) {
          setProducts(prev => [...prev, data])
        }
      }
      setEditingProduct(null)
    } finally {
      setSaving(false)
    }
  }

  function getCatName(id: string) {
    return categories.find(c => c.id === id)?.name ?? '—'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--dash-text)', letterSpacing: '-0.025em' }}>
            Cardápio
          </h1>
          <p style={{ color: 'var(--dash-text-muted)', fontSize: 13.5, marginTop: 4 }}>
            {products.length} produtos · {categories.length} categorias
          </p>
        </div>
        <button style={btnPrimary} onClick={() => setEditingProduct({
          channel: 'ambos', category_id: categories[0]?.id, price: 0,
        })}>
          <Plus size={14} /> Novo Produto
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['all', 'presencial', 'delivery'].map(ch => (
          <button key={ch} onClick={() => setFilterChannel(ch)} style={{
            ...btnGhost,
            background: filterChannel === ch ? 'var(--dash-accent)' : 'transparent',
            color: filterChannel === ch ? '#000' : 'var(--dash-text-muted)',
            borderColor: filterChannel === ch ? 'var(--dash-accent)' : 'var(--dash-border)',
          }}>
            {ch === 'all' ? 'Todos' : ch === 'presencial' ? <><Coffee size={12} /> Presencial</> : <><Truck size={12} /> Delivery</>}
          </button>
        ))}
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          style={{ ...btnGhost, appearance: 'auto', paddingRight: 8 }}
        >
          <option value="all">Todas categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Product list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredProducts.map(p => (
          <div key={p.id} style={{
            ...card, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
            opacity: p.available ? 1 : 0.5,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ color: 'var(--dash-text)', fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>
                  {p.name}
                </p>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase',
                  padding: '2px 6px', borderRadius: 4,
                  background: p.channel === 'delivery' ? 'rgba(91,156,255,0.1)' : 'rgba(0,229,160,0.1)',
                  color: p.channel === 'delivery' ? '#5b9cff' : 'var(--dash-accent)',
                }}>
                  {p.channel}
                </span>
              </div>
              <p style={{ color: 'var(--dash-text-muted)', fontSize: 12, marginTop: 2 }}>
                {getCatName(p.category_id)} · R$ {Number(p.price).toFixed(2)}
              </p>
            </div>

            <button onClick={() => toggleAvailable(p)} style={btnGhost} title={p.available ? 'Pausar' : 'Ativar'}>
              {p.available ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button onClick={() => setEditingProduct(p)} style={btnGhost}>
              <Pencil size={14} />
            </button>
            <button onClick={() => deleteProduct(p.id)} style={{ ...btnGhost, color: '#ff6079', borderColor: '#ff607933' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--dash-text-muted)' }}>
            Nenhum produto encontrado
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {editingProduct && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 40 }}
            onClick={() => setEditingProduct(null)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: '90%', maxWidth: 440, background: 'var(--dash-bg-sidebar)', border: '1px solid var(--dash-border)',
            borderRadius: 16, padding: 24, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--dash-text)', fontSize: 16, fontWeight: 600 }}>
                {editingProduct.id ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', color: 'var(--dash-text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div>
              <label style={{ color: 'var(--dash-text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 4, display: 'block' }}>Nome</label>
              <input style={inputStyle} value={editingProduct.name || ''} onChange={e => setEditingProduct(prev => ({ ...prev!, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ color: 'var(--dash-text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 4, display: 'block' }}>Descrição</label>
              <input style={inputStyle} value={editingProduct.description || ''} onChange={e => setEditingProduct(prev => ({ ...prev!, description: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'var(--dash-text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 4, display: 'block' }}>Preço (R$)</label>
                <input style={inputStyle} type="number" step="0.01" value={editingProduct.price || ''} onChange={e => setEditingProduct(prev => ({ ...prev!, price: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'var(--dash-text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 4, display: 'block' }}>Canal</label>
                <select style={inputStyle} value={editingProduct.channel || 'ambos'} onChange={e => setEditingProduct(prev => ({ ...prev!, channel: e.target.value }))}>
                  <option value="ambos">Ambos</option>
                  <option value="presencial">Presencial</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ color: 'var(--dash-text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 4, display: 'block' }}>Categoria</label>
              <select style={inputStyle} value={editingProduct.category_id || ''} onChange={e => setEditingProduct(prev => ({ ...prev!, category_id: e.target.value }))}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.channel})</option>)}
              </select>
            </div>

            <button style={{ ...btnPrimary, justifyContent: 'center', marginTop: 4 }} onClick={saveProduct} disabled={saving}>
              <Save size={14} /> {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
