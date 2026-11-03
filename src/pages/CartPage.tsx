import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart, useStore } from '../lib/store'
import { supabase } from '../lib/supabase'
import { BRAND, money } from '../config/brand'
import { waLink } from '../components/Layout'

export default function CartPage() {
  const { items, total, setQty, clear } = useCart()
  const { settings } = useStore()
  const [f, setF] = useState({ name: '', phone: '', address: '', notes: '' })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true); setMsg('')
    const { error } = await supabase.from('orders').insert({
      customer_name: f.name, phone: f.phone, address: f.address, notes: f.notes, items, total, status: 'nuevo',
    })
    if (error) { setBusy(false); setMsg('No pudimos registrar el pedido. Intenta de nuevo o escríbenos por WhatsApp.'); return }
    const lines = items.map(i => `• ${i.qty} x ${i.name} — ${money(i.qty * i.price)}`).join('\n')
    const text = `Hola ${BRAND.name}, quiero hacer este pedido:\n${lines}\n\nTotal: ${money(total)}\nNombre: ${f.name}\nTeléfono: ${f.phone}\nDirección/Entrega: ${f.address || 'Recojo en local'}${f.notes ? `\nNotas: ${f.notes}` : ''}`
    window.open(waLink(settings.whatsapp, text), '_blank', 'noopener,noreferrer')
    clear(); setDone(true); setBusy(false)
  }

  if (done) return <div className="wrap section center"><h2>¡Gracias por tu pedido!</h2><p className="muted">Lo registramos y abrimos WhatsApp para confirmarlo con nosotros.</p><Link to="/tienda" className="btn">Seguir explorando</Link></div>
  if (items.length === 0) return <div className="wrap section center"><h2>Tu carrito está vacío</h2><Link to="/tienda" className="btn">Ver el menú</Link></div>
  return (
    <div className="wrap section">
      <div className="head"><div><span className="kicker">Tu pedido</span><h2>Carrito</h2></div></div>
      <div className="cart-grid">
        <div className="cart-list">
          {items.map(i => (
            <div className="cart-row" key={i.id}>
              <div><strong>{i.name}</strong><span className="muted">{money(i.price)}</span></div>
              <div className="qty"><button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Menos"><Minus size={14} /></button><b>{i.qty}</b><button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Más"><Plus size={14} /></button></div>
              <strong>{money(i.qty * i.price)}</strong>
              <button className="icon" onClick={() => setQty(i.id, 0)} aria-label="Quitar"><Trash2 size={16} /></button>
            </div>
          ))}
          <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>
        </div>
        <form className="card form" onSubmit={submit}>
          <h3>Tus datos</h3>
          <label>Nombre<input required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label>
          <label>Teléfono<input required inputMode="tel" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></label>
          <label>Dirección (vacío = recojo en local)<input value={f.address} onChange={e => setF({ ...f, address: e.target.value })} /></label>
          <label>Notas<textarea rows={3} value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} /></label>
          {msg && <p className="notice">{msg}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Enviando…' : 'Confirmar y enviar por WhatsApp'}</button>
        </form>
      </div>
    </div>
  )
}
