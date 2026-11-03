import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useStore } from '../lib/store'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const { slug } = useParams()
  const { categories, products, loading, error } = useStore()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('nuevo')
  const cat = categories.find(c => c.slug === slug)
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    const r = products.filter(p => (!slug || p.category_id === cat?.id) && (!t || (p.name + ' ' + p.description).toLowerCase().includes(t)))
    if (sort === 'precio-asc') r.sort((a, b) => a.price - b.price)
    if (sort === 'precio-desc') r.sort((a, b) => b.price - a.price)
    if (sort === 'nombre') r.sort((a, b) => a.name.localeCompare(b.name))
    return r
  }, [products, slug, cat, q, sort])
  return (
    <div className="wrap section">
      <div className="head"><div><span className="kicker">Nuestro menú</span><h2>{cat ? cat.name : 'Todo el menú'}</h2></div></div>
      <div className="filters">
        <Link to="/tienda" className={!slug ? 'chip active' : 'chip'}>Todo</Link>
        {categories.map(c => <Link key={c.id} to={`/categoria/${c.slug}`} className={c.slug === slug ? 'chip active' : 'chip'}>{c.emoji} {c.name}</Link>)}
      </div>
      <div className="tools">
        <label className="search"><Search size={16} /><input placeholder="Buscar…" value={q} onChange={e => setQ(e.target.value)} /></label>
        <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Ordenar">
          <option value="nuevo">Más recientes</option><option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option><option value="nombre">Nombre A–Z</option>
        </select>
      </div>
      {loading && <p className="muted">Cargando…</p>}
      {error && <p className="notice">{error}</p>}
      {!loading && !error && list.length === 0 && <p className="muted">No encontramos productos.</p>}
      <div className="grid">{list.map(p => <ProductCard key={p.id} p={p} />)}</div>
    </div>
  )
}
