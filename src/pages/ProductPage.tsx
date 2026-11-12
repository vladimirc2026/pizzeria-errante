import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react'
import { useStore, useCart } from '../lib/store'
import { money } from '../config/brand'
import { ingredientList } from '../lib/upload'
import ProductCard from '../components/ProductCard'
import { NotFound } from './Info'

export default function ProductPage() {
  const { slug } = useParams()
  const { products, categories, loading } = useStore()
  const { add } = useCart()
  const [vi, setVi] = useState(0)
  const [qty, setQty] = useState(1)
  const p = products.find(x => x.slug === slug)
  if (loading) return <div className="wrap section"><p className="muted">Cargando…</p></div>
  if (!p) return <NotFound />
  const cat = categories.find(c => c.id === p.category_id)
  const variants = p.variants ?? []
  const v = variants[Math.min(vi, variants.length - 1)]
  const price = Number(v ? v.price : p.price)
  const old = v ? v.old_price : p.old_price
  const off = old && old > price ? Math.round((1 - price / old) * 100) : 0
  const ing = ingredientList(p.ingredients ?? '')
  const related = products.filter(x => x.category_id === p.category_id && x.id !== p.id).slice(0, 4)
  return (
    <div className="wrap section">
      <p className="muted"><Link to="/">Menú</Link> / {cat && <Link to={`/categoria/${cat.slug}`}>{cat.name}</Link>}</p>
      <div className="ficha">
        <div className="ficha-img">
          {p.image_url ? <img src={p.image_url} alt={p.name} /> : <span className="ph">{cat?.emoji}</span>}
          {off > 0 && <span className="off">-{off}%</span>}
        </div>
        <div className="ficha-body">
          {cat && <span className="pill">{cat.emoji} {cat.name}</span>}
          <h1 className="h1s">{p.name}</h1>
          {p.description && <p className="desc">{p.description}</p>}
          {ing.length > 0 && <div className="block"><h4>Ingredientes</h4><ul className="chips">{ing.map(i => <li key={i}>{i}</li>)}</ul></div>}
          {variants.length > 0 && (
            <div className="block"><h4>Elige el tamaño <em>{v ? `· ${v.name}` : ''}</em></h4>
              <div className="sizes">{variants.map((x, k) => (
                <button key={x.name} type="button" className={k === vi ? 'size on' : 'size'} onClick={() => setVi(k)}>
                  {k === vi && <Check size={14} className="chk" />}<strong>{x.name}</strong><span>{money(x.price)}</span>{x.old_price && x.old_price > x.price && <s>{money(x.old_price)}</s>}
                </button>))}
              </div>
            </div>
          )}
          <div className="service-note"><span>🛵 Delivery</span><span>🏪 Recoger en local</span><span>🍽️ Comer en el restaurante</span></div>
          <div className="buy">
            <div className="qty big"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Menos"><Minus size={16} /></button><b>{qty}</b><button onClick={() => setQty(qty + 1)} aria-label="Más"><Plus size={16} /></button></div>
            <button className="btn grow" onClick={() => add(p, v, qty)}><ShoppingCart size={16} /> Agregar · {money(price * qty)}</button>
          </div>
        </div>
      </div>
      {related.length > 0 && <><h2 className="rel">También te puede gustar</h2><div className="grid">{related.map(r => <ProductCard key={r.id} p={r} />)}</div></>}
    </div>
  )
}
