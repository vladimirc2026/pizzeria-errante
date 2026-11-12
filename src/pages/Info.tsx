import { Link } from 'react-router-dom'
import { BRAND } from '../config/brand'
import Location from '../components/Location'

export function About() {
  return (
    <div className="wrap section about">
      <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85" alt="Ambiente acogedor de restaurante" />
      <div>
        <span className="kicker">Nuestra esencia</span><h2>Un lugar para disfrutar juntos.</h2>
        <p>En {BRAND.name} creemos que la comida reúne a las personas. Queremos acompañar tus encuentros, tus celebraciones y esos pequeños momentos en los que solo hace falta algo delicioso.</p>
        <p>Ven con tu familia, tus amigos o compañeros de trabajo y sigue explorando sabores con nosotros.</p>
        <span className="badge">Empresas · Familias · Jóvenes · Niños</span>
      </div>
    </div>
  )
}

export function Contact() {
  return <Location />
}

export function NotFound() {
  return <div className="wrap section center"><h2>Página no encontrada</h2><p className="muted">Parece que este camino no lleva a ningún sabor.</p><Link to="/" className="btn">Volver al inicio</Link></div>
}
