import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, MessageCircle, MapPin, Check } from 'lucide-react'
import { BRAND, money } from '../config/brand'
import { useCart, useStore } from '../lib/store'

export const waLink = (phone: string, text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { count, total, toast } = useCart()
  const { settings } = useStore()
  const { pathname } = useLocation()
  const close = () => setOpen(false)
  return (
    <>
      <div className="topline">{BRAND.name} · {BRAND.tagline.toUpperCase()} · UNA EXPERIENCIA PARA COMPARTIR</div>
      <header className="header">
        <div className="nav">
          <Link to="/" className="brand" onClick={close}><img src={BRAND.logo} alt={`${BRAND.name} — ${BRAND.tagline}`} /></Link>
          <nav className={open ? 'open' : ''}>
            <NavLink to="/" end onClick={close}>Inicio</NavLink>
            <NavLink to="/categoria/promociones" onClick={close}>🔥 Promociones</NavLink>
            <NavLink to="/tienda" onClick={close}>Menú completo</NavLink>
            <NavLink to="/contacto" onClick={close}>Ubicación</NavLink>
            <NavLink to="/nosotros" onClick={close}>Nosotros</NavLink>
          </nav>
          <div className="nav-actions">
            <Link to="/carrito" className="cart-btn" aria-label="Carrito"><ShoppingBag size={20} />{count > 0 && <b key={count}>{count}</b>}{count > 0 && <em>{money(total)}</em>}</Link>
            <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Menú">{open ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="footer">
        <div className="footer-inner">
          <img src={BRAND.logo} alt={BRAND.name} className="footer-logo" />
          <p><MapPin size={14} /> {settings.address}</p>
          <div className="footer-links"><Link to="/tienda">Menú</Link><Link to="/contacto">Contacto</Link><Link to="/admin">Acceso equipo</Link></div>
        </div>
      </footer>
      {toast && <div className="toast" key={toast.n} role="status"><Check size={18} /> <span><b>{toast.name}</b><br />agregado al carrito</span><Link to="/carrito">Ver carrito</Link></div>}
      {count > 0 && pathname !== '/carrito' && <Link to="/carrito" className="cart-bar"><ShoppingBag size={18} /> Ver mi pedido ({count}) <strong>{money(total)}</strong></Link>}
      <a className={count > 0 ? 'wa-float up' : 'wa-float'} href={waLink(settings.whatsapp, 'Hola ERRANTE, quiero hacer un pedido.')} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={18} /> Pedir por WhatsApp
      </a>
    </>
  )
}
