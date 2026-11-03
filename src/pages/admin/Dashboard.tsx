import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { money } from '../../config/brand'
import type { Order } from '../../types'

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [np, setNp] = useState(0)
  useEffect(() => {
    void supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200).then(r => setOrders((r.data as Order[]) ?? []))
    void supabase.from('products').select('id', { count: 'exact', head: true }).then(r => setNp(r.count ?? 0))
  }, [])
  const nuevos = orders.filter(o => o.status === 'nuevo').length
  const ventas = orders.filter(o => o.status !== 'cancelado').reduce((a, o) => a + Number(o.total), 0)
  return (
    <>
      <h2>Resumen</h2>
      <div className="stats">
        <div className="card"><span>Pedidos nuevos</span><strong>{nuevos}</strong></div>
        <div className="card"><span>Pedidos totales</span><strong>{orders.length}</strong></div>
        <div className="card"><span>Ventas (sin cancelados)</span><strong>{money(ventas)}</strong></div>
        <div className="card"><span>Productos</span><strong>{np}</strong></div>
      </div>
      <h3>Últimos pedidos</h3>
      <table><thead><tr><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead><tbody>
        {orders.slice(0, 8).map(o => <tr key={o.id}><td>{new Date(o.created_at).toLocaleString('es-BO')}</td><td>{o.customer_name}</td><td>{money(o.total)}</td><td>{o.status}</td></tr>)}
      </tbody></table>
    </>
  )
}
