import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import type { Product } from '../types'
import { money } from '../config/brand'
import { useCart } from '../lib/store'

export default function Banner({ slides }: { slides: Product[] }) {
  const [i, setI] = useState(0)
  const { add } = useCart()
  const n = slides.length
  useEffect(() => {
    if (n < 2) return
    const t = window.setInterval(() => setI(x => (x + 1) % n), 5500)
    return () => window.clearInterval(t)
  }, [n])
  if (n === 0) return null
  const p = slides[i % n]
  const off = p.old_price && p.old_price > p.price ? Math.round((1 - p.price / p.old_price) * 100) : 0
  return (
    <section className="banner" style={{ backgroundImage: `url(${p.image_url})` }}>
      <div className="banner-shade" />
      <div className="wrap banner-body">
        <span className="kicker light">{off > 0 ? `Promo · -${off}%` : 'Recomendado'}</span>
        <h1 className="banner-title">{p.name}</h1>
        <p>{p.description}</p>
        <div className="prices big"><span className="price">{money(p.price)}</span>{off > 0 && <s>{money(p.old_price ?? 0)}</s>}</div>
        <div className="actions">
          {(p.variants ?? []).length > 0
            ? <Link to={`/producto/${p.slug}`} className="btn"><ShoppingCart size={16} /> Elegir tamaño</Link>
            : <button className="btn" onClick={() => add(p)}><ShoppingCart size={16} /> Agregar al carrito</button>}
          <Link to={`/producto/${p.slug}`} className="btn ghost">Ver más</Link>
        </div>
      </div>
      {n > 1 && <>
        <button className="arrow l" onClick={() => setI((i + n - 1) % n)} aria-label="Anterior"><ChevronLeft size={20} /></button>
        <button className="arrow r" onClick={() => setI((i + 1) % n)} aria-label="Siguiente"><ChevronRight size={20} /></button>
        <div className="dots">{slides.map((s, k) => <button key={s.id} className={k === i % n ? 'on' : ''} onClick={() => setI(k)} aria-label={`Promoción ${k + 1}`} />)}</div>
      </>}
    </section>
  )
}
