import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '../types'
import { money } from '../config/brand'
import { useCart, useStore } from '../lib/store'

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart()
  const { categories } = useStore()
  const cat = categories.find(c => c.id === p.category_id)
  const off = p.old_price && p.old_price > p.price ? Math.round((1 - p.price / p.old_price) * 100) : 0
  return (
    <article className="product">
      <Link to={`/producto/${p.slug}`} className="product-img">
        {p.image_url ? <img src={p.image_url} alt={p.name} loading="lazy" /> : <span className="ph">{cat?.emoji ?? '🍽️'}</span>}
        {off > 0 && <span className="off">-{off}%</span>}
        {p.tag && <span className="tag">{p.tag}</span>}
      </Link>
      <div className="product-info">
        <h3><Link to={`/producto/${p.slug}`}>{p.name}</Link></h3>
        <p>{p.description}</p>
        <div className="prices"><span className="price">{money(p.price)}</span>{off > 0 && <s>{money(p.old_price ?? 0)}</s>}</div>
        <button className="btn full" onClick={() => add(p)}><ShoppingCart size={16} /> Agregar</button>
      </div>
    </article>
  )
}
