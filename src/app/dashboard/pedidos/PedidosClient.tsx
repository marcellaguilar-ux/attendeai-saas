'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Clock, ChefHat, CheckCircle, Package, XCircle, RefreshCw } from 'lucide-react'

type OrderItem = {
  id: string; product_name: string; variant_label: string | null
  quantity: number; unit_price: number
}
type Order = {
  id: string; barbershop_id: string; table_id: string | null
  source: string; client_name: string | null; status: string
  total: number; notes: string | null; created_at: string
  menu_order_items: OrderItem[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  recebido:   { label: 'Recebido',   color: '#5b9cff', bg: 'rgba(91,156,255,0.1)',  icon: Clock },
  em_preparo: { label: 'Em Preparo', color: '#f5a623', bg: 'rgba(245,166,35,0.1)',  icon: ChefHat },
  pronto:     { label: 'Pronto',     color: '#00e5a0', bg: 'rgba(0,229,160,0.1)',   icon: CheckCircle },
  entregue:   { label: 'Entregue',   color: '#6c7884', bg: 'rgba(108,120,132,0.1)', icon: Package },
  cancelado:  { label: 'Cancelado',  color: '#ff6079', bg: 'rgba(255,96,121,0.1)',  icon: XCircle },
}
const STATUS_FLOW = ['recebido', 'em_preparo', 'pronto', 'entregue']

const card: React.CSSProperties = {
  background: '#13181c', border: '1px solid #1d2429', borderRadius: 14, padding: 18,
}

const BRL = (n: number) => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export default function PedidosClient({ barbershopId, initialOrders }: {
  barbershopId: string; initialOrders: Order[]
}) {
  const supabase = createClient()
  const [orders, setOrders] = useState(initialOrders)
  const [filterStatus, setFilterStatus] = useState<string>('active')

  // Realtime subscription for new/updated orders
  useEffect(() => {
    const channel = supabase
      .channel('menu_orders_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'menu_orders',
        filter: `barbershop_id=eq.${barbershopId}`,
      }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          // Fetch the full order with items
          const { data } = await supabase
            .from('menu_orders')
            .select('*, menu_order_items(*)')
            .eq('id', payload.new.id)
            .single()
          if (data) setOrders(prev => [data, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(o =>
            o.id === payload.new.id ? { ...o, ...payload.new } : o
          ))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [barbershopId, supabase])

  async function updateStatus(orderId: string, newStatus: string) {
    const { error } = await supabase
      .from('menu_orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    }
  }

  function nextStatus(current: string): string | null {
    const idx = STATUS_FLOW.indexOf(current)
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return null
    return STATUS_FLOW[idx + 1]
  }

  const filteredOrders = filterStatus === 'active'
    ? orders.filter(o => ['recebido', 'em_preparo', 'pronto'].includes(o.status))
    : filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus)

  const activeCount = orders.filter(o => ['recebido', 'em_preparo', 'pronto'].includes(o.status)).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e9eef3', letterSpacing: '-0.025em' }}>
          Pedidos
        </h1>
        <p style={{ color: '#6c7884', fontSize: 13.5, marginTop: 4 }}>
          {activeCount} pedidos ativos · Atualização em tempo real
        </p>
      </div>

      {/* Status filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[
          { key: 'active', label: `Ativos (${activeCount})` },
          { key: 'recebido', label: 'Recebidos' },
          { key: 'em_preparo', label: 'Em Preparo' },
          { key: 'pronto', label: 'Prontos' },
          { key: 'entregue', label: 'Entregues' },
          { key: 'all', label: 'Todos' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
            padding: '6px 14px', borderRadius: 20, border: '1px solid #1d2429',
            background: filterStatus === f.key ? '#00e5a0' : 'transparent',
            color: filterStatus === f.key ? '#000' : '#6c7884',
            fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            borderColor: filterStatus === f.key ? '#00e5a0' : '#1d2429',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredOrders.map(order => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.recebido
          const Icon = cfg.icon
          const next = nextStatus(order.status)

          return (
            <div key={order.id} style={card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  {/* Status + time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 10px', borderRadius: 6, background: cfg.bg,
                      fontSize: 11.5, fontWeight: 600, color: cfg.color,
                    }}>
                      <Icon size={12} /> {cfg.label}
                    </div>
                    <span style={{ color: '#3a454f', fontSize: 11.5 }}>
                      {timeAgo(order.created_at)}
                    </span>
                    {order.source === 'qrcode' && (
                      <span style={{ color: '#6c7884', fontSize: 11 }}>QR Code</span>
                    )}
                  </div>

                  {/* Client + table */}
                  <p style={{ color: '#e9eef3', fontSize: 14, fontWeight: 500 }}>
                    {order.client_name || 'Cliente anônimo'}
                  </p>

                  {/* Items */}
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {order.menu_order_items?.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#8c959e' }}>
                        <span>
                          {item.quantity}x {item.product_name}
                          {item.variant_label && <span style={{ color: '#6c7884' }}> ({item.variant_label})</span>}
                        </span>
                        <span>{BRL(item.unit_price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <p style={{ color: '#00e5a0', fontSize: 15, fontWeight: 700, marginTop: 10 }}>
                    Total: {BRL(order.total)}
                  </p>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  {next && (
                    <button onClick={() => updateStatus(order.id, next)} style={{
                      padding: '8px 14px', borderRadius: 8, border: 'none',
                      background: '#00e5a0', color: '#000', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      <RefreshCw size={12} />
                      {STATUS_CONFIG[next]?.label}
                    </button>
                  )}
                  {order.status !== 'cancelado' && order.status !== 'entregue' && (
                    <button onClick={() => updateStatus(order.id, 'cancelado')} style={{
                      padding: '6px 14px', borderRadius: 8, border: '1px solid #ff607933',
                      background: 'transparent', color: '#ff6079', fontSize: 11.5, fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {filteredOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: '#6c7884' }}>
            <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
