import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, MessageCircle, MapPin } from 'lucide-react'
import { BRAND } from '../config/brand'
import { useCart, useStore } from '../lib/store'

export const waLink = (phone: string, text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const { settings } = useStore()
  useLocation()
  const close = () => setOpen(false)
  return (
    <>
      <div className="topline">{BRAND.name} · {BRAND.tagline.toUpperCase()} · UNA EXPERIENCIA PARA COMPARTIR</div>
      <header className="header">
        <div className="nav">
          <Link to="/" className="brand" onClick={close}><img src={BRAND.logo} alt={`${BRAND.name} — ${BRAND.tagline}`} /></Link>
          <nav className={open ? 'open' : ''}>
            <NavLink to="/" end onClick={close}>Inicio</NavLink>
            <NavLink to="/tienda" onClick={close}>Menú</NavLink>
            <NavLink to="/nosotros" onClick={close}>Nosotros</NavLink>
            <NavLink to="/contacto" onClick={close}>Contacto</NavLink>
          </nav>
          <div className="nav-actions">
            <Link to="/carrito" className="cart-btn" aria-label="Carrito"><ShoppingBag size={20} />{count > 0 && <b>{count}</b>}</Link>
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
      <a className="wa-float" href={waLink(settings.whatsapp, 'Hola ERRANTE, quiero hacer un pedido.')} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={18} /> Pedir por WhatsApp
      </a>
    </>
  )
}
