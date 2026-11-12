import { Link } from 'react-router-dom'
import { ShoppingCart, SlidersHorizontal } from 'lucide-react'
import type { Product } from '../types'
import { money } from '../config/brand'
import { useCart, useStore } from '../lib/store'
import { ingredientList } from '../lib/upload'

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart()
  const { categories } = useStore()
  const cat = categories.find(c => c.id === p.category_id)
  const variants = p.variants ?? []
  const multi = variants.length > 0
  const off = !multi && p.old_price && p.old_price > p.price ? Math.round((1 - p.price / p.old_price) * 100) : 0
  const ing = ingredientList(p.ingredients ?? '')
  const to = `/producto/${p.slug}`
  return (
    <article className="product">
      <Link to={to} className="product-img">
        {p.image_url ? <img src={p.image_url} alt={p.name} loading="lazy" /> : <span className="ph">{cat?.emoji ?? '🍽️'}</span>}
        {off > 0 && <span className="off">-{off}%</span>}
        {p.tag && <span className="tag">{p.tag}</span>}
      </Link>
      <div className="product-info">
        {cat && <span className="product-type">{cat.name}</span>}
        <h3><Link to={to}>{p.name}</Link></h3>
        {p.description && <p>{p.description}</p>}
        {ing.length > 0 && <div className="card-ing">{ing.slice(0, 4).join(' · ')}{ing.length > 4 ? ' · …' : ''}</div>}
        {multi && (
          <div className="card-sizes">
            {variants.map(v => <span key={v.name}><b>{v.name}</b>{money(v.price)}</span>)}
          </div>
        )}
        <div className="card-foot">
          <div className="prices">{multi && <small>Desde</small>}<span className="price">{money(p.price)}</span>{off > 0 && <s>{money(p.old_price ?? 0)}</s>}</div>
          <Link to={to} className="more-link">Ver detalle</Link>
        </div>
        {multi
          ? <Link to={to} className="btn full"><SlidersHorizontal size={16} /> Elegir tamaño</Link>
          : <button className="btn full" onClick={() => add(p)}><ShoppingCart size={16} /> Agregar</button>}
      </div>
    </article>
  )
}
