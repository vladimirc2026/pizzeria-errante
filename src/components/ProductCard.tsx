import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Product } from '../types'
import { money } from '../config/brand'
import { useCart, useStore } from '../lib/store'

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart()
  const { categories } = useStore()
  const cat = categories.find(c => c.id === p.category_id)
  return (
    <article className="product">
      <Link to={`/producto/${p.slug}`} className="product-img">
        {p.image_url ? <img src={p.image_url} alt={p.name} loading="lazy" /> : <span className="ph">{cat?.emoji ?? '🍽️'}</span>}
        {p.tag && <span className="tag">{p.tag}</span>}
      </Link>
      <div className="product-info">
        <span className="product-type">{cat?.name ?? ''}</span>
        <h3><Link to={`/producto/${p.slug}`}>{p.name}</Link></h3>
        <p>{p.description}</p>
        <div className="product-bottom">
          <span className="price">{money(p.price)}</span>
          <button className="add" onClick={() => add(p)} aria-label={`Agregar ${p.name}`}><Plus size={18} /></button>
        </div>
      </div>
    </article>
  )
}
