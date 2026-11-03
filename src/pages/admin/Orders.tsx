import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { money } from '../../config/brand'
import type { Order } from '../../types'

const STATES = ['nuevo', 'confirmado', 'entregado', 'cancelado']

export default function AdminOrders() {
  const [list, setList] = useState<Order[]>([])
  const load = useCallback(async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setList((data as Order[]) ?? [])
  }, [])
  useEffect(() => { void load() }, [load])
  const setStatus = async (id: string, status: string) => { await supabase.from('orders').update({ status }).eq('id', id); void load() }
  return (
    <>
      <h2>Pedidos</h2>
      {list.length === 0 && <p className="muted">Aún no hay pedidos.</p>}
      {list.map(o => (
        <div className="card order" key={o.id}>
          <div className="order-head">
            <div><strong>{o.customer_name}</strong> · <a href={`https://wa.me/${o.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{o.phone}</a>
              <div className="muted">{new Date(o.created_at).toLocaleString('es-BO')}</div></div>
            <select value={o.status} onChange={e => void setStatus(o.id, e.target.value)}>{STATES.map(s => <option key={s}>{s}</option>)}</select>
          </div>
          <ul>{o.items.map(i => <li key={i.id}>{i.qty} × {i.name} — {money(i.qty * i.price)}</li>)}</ul>
          {o.address && <p className="muted">📍 {o.address}</p>}
          {o.notes && <p className="muted">📝 {o.notes}</p>}
          <strong>Total: {money(o.total)}</strong>
        </div>
      ))}
    </>
  )
}
