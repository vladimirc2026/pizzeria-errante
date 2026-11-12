import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Flame, Package, Tags, ClipboardList, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../lib/store'
import { BRAND } from '../../config/brand'

export default function Shell() {
  const { loading, isAdmin, email, signOut } = useAuth()
  if (loading) return <div className="wrap section"><p className="muted">Cargando…</p></div>
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return (
    <div className="admin">
      <aside>
        <img src={BRAND.logo} alt={BRAND.name} />
        <NavLink to="/admin" end><LayoutDashboard size={16} /> Resumen</NavLink>
        <NavLink to="/admin/promociones"><Flame size={16} /> Promociones</NavLink>
        <NavLink to="/admin/productos"><Package size={16} /> Productos</NavLink>
        <NavLink to="/admin/categorias"><Tags size={16} /> Categorías</NavLink>
        <NavLink to="/admin/pedidos"><ClipboardList size={16} /> Pedidos</NavLink>
        <NavLink to="/admin/ajustes"><Settings size={16} /> Ajustes y usuarios</NavLink>
        <div className="spacer" />
        <small>{email}</small>
        <button onClick={() => void signOut()}><LogOut size={16} /> Salir</button>
        <NavLink to="/">Ver tienda ↗</NavLink>
      </aside>
      <section className="admin-main"><Outlet /></section>
    </div>
  )
}
