import { Link } from 'react-router-dom'
import { BRAND } from '../config/brand'
import { useStore } from '../lib/store'
import ProductCard from '../components/ProductCard'
import Row from '../components/Row'
import Banner from '../components/Banner'
import Location from '../components/Location'

export default function Home() {
  const { categories, products, loading, error } = useStore()
  const promoCat = categories.find(c => c.slug === 'promociones')
  const promos = products.filter(p => p.category_id === promoCat?.id && p.image_url)
  const slides = (promos.length ? promos : products.filter(p => p.featured && p.image_url)).slice(0, 5)
  const go = (slug: string) => document.getElementById(`cat-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <>
      {slides.length > 0 ? <Banner slides={slides} /> : (
        <section className="hero"><div className="wrap section center">
          <h1>{BRAND.name}</h1><p className="muted">{BRAND.tagline}</p>
          {loading && <p className="muted">Cargando…</p>}{error && <p className="notice">{error}</p>}
        </div></section>
      )}

      <div className="wrap"><div className="catnav" role="navigation" aria-label="Categorías del menú">
        {categories.map(c => <button key={c.id} onClick={() => go(c.slug)}><span>{c.emoji}</span>{c.name}</button>)}
        <a href="#ubicacion"><span>📍</span>Ubicación</a>
      </div></div>

      {categories.map(c => {
        const list = products.filter(p => p.category_id === c.id)
        if (list.length === 0) return null
        return (
          <Row key={c.id} id={`cat-${c.slug}`} title={`${c.emoji} ${c.name}`} to={`/categoria/${c.slug}`}>
            {list.map(p => <div className="slide" key={p.id}><ProductCard p={p} /></div>)}
          </Row>
        )
      })}

      <section className="wrap section center story">
        <span className="kicker">Nuestra esencia</span><h2>Un lugar para disfrutar juntos.</h2>
        <p className="muted">Para empresas, familias, jóvenes y niños. <Link to="/nosotros">Conócenos →</Link></p>
      </section>
      <Location />
    </>
  )
}
