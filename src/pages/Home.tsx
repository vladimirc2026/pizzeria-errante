import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { BRAND } from '../config/brand'
import { useStore } from '../lib/store'
import { waLink } from '../components/Layout'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const { categories, products, loading, error, settings } = useStore()
  const featured = (products.some(p => p.featured) ? products.filter(p => p.featured) : products).slice(0, 8)
  return (
    <>
      <section className="hero"><div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Un viaje de sabores</span>
          <h1>Hay sabores<br />que te hacen<br /><em>volver.</em></h1>
          <p>Pizza recién hecha, café para disfrutar, postres que alegran el día y mucho más. En {BRAND.name}, cada antojo puede convertirse en tu nuevo favorito.</p>
          <div className="actions">
            <Link to="/tienda" className="btn">Explorar el menú <ArrowRight size={16} /></Link>
            <a className="btn outline" href={waLink(settings.whatsapp, 'Hola ERRANTE, quisiera consultar el menú.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> Consultar por WhatsApp</a>
          </div>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1100&q=85" alt="Pizza artesanal recién horneada" />
          <div className="stamp">HECHO PARA<br />DISFRUTAR<br />✦</div>
        </div>
      </div></section>

      <section className="wrap section">
        <div className="head"><div><span className="kicker">Encuentra tu favorito</span><h2>¿Qué se te antoja hoy?</h2></div></div>
        <div className="cats">
          {categories.map(c => (
            <Link key={c.id} to={`/categoria/${c.slug}`} className="cat"><span>{c.emoji}</span><strong>{c.name}</strong></Link>
          ))}
        </div>
      </section>

      <section className="alt"><div className="wrap section">
        <div className="head"><div><span className="kicker">Un vistazo al menú</span><h2>Algo rico te espera</h2></div><Link to="/tienda" className="btn outline">Ver todo</Link></div>
        {loading && <p className="muted">Cargando…</p>}
        {error && <p className="notice">{error}</p>}
        <div className="grid">{featured.map(p => <ProductCard key={p.id} p={p} />)}</div>
      </div></section>
    </>
  )
}
