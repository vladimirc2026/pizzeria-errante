import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Row({ id, title, to, children }: { id: string; title: string; to: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const go = (d: number) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.85), behavior: 'smooth' })
  return (
    <section className="row" id={id}>
      <div className="wrap">
        <div className="head"><h2>{title}</h2><Link to={to} className="more">Ver todo →</Link></div>
        <div className="row-wrap">
          <button className="arrow l" onClick={() => go(-1)} aria-label="Anterior"><ChevronLeft size={20} /></button>
          <div className="scroller" ref={ref}>{children}</div>
          <button className="arrow r" onClick={() => go(1)} aria-label="Siguiente"><ChevronRight size={20} /></button>
        </div>
      </div>
    </section>
  )
}
