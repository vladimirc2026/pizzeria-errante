import { Link, useParams } from 'react-router-dom'
import { useStore, useCart } from '../lib/store'
import { money } from '../config/brand'
import ProductCard from '../components/ProductCard'
import { NotFound } from './Info'

export default function ProductPage() {
  const { slug } = useParams()
  const { products, categories, loading } = useStore()
  const { add } = useCart()
  const p = products.find(x => x.slug === slug)
  if (loading) return <div className="wrap section"><p className="muted">Cargando…</p></div>
  if (!p) return <NotFound />
  const cat = categories.find(c => c.id === p.category_id)
  const related = products.filter(x => x.category_id === p.category_id && x.id !== p.id).slice(0, 4)
  return (
    <div className="wrap section">
      <p className="muted"><Link to="/tienda">Menú</Link> / {cat && <Link to={`/categoria/${cat.slug}`}>{cat.name}</Link>}</p>
      <div className="detail">
        <div className="detail-img">{p.image_url ? <img src={p.image_url} alt={p.name} /> : <span className="ph">{cat?.emoji}</span>}</div>
        <div>
          {p.tag && <span className="tag static">{p.tag}</span>}
          <h1 className="h1s">{p.name}</h1>
          <p className="price big">{money(p.price)}</p>
          <p className="desc">{p.description}</p>
          <button className="btn" onClick={() => add(p)}>Agregar al carrito</button>
        </div>
      </div>
      {related.length > 0 && <><h2 className="rel">También te puede gustar</h2><div className="grid">{related.map(r => <ProductCard key={r.id} p={r} />)}</div></>}
    </div>
  )
}
