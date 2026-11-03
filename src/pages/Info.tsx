import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Clock } from 'lucide-react'
import { BRAND } from '../config/brand'
import { useStore } from '../lib/store'
import { waLink } from '../components/Layout'

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
  const { settings } = useStore()
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`
  return (
    <div className="wrap section">
      <div className="head"><div><span className="kicker">Te esperamos</span><h2>Contacto</h2></div></div>
      <div className="contact">
        <div className="card"><MapPin /><h3>Dirección</h3><p>{settings.address}</p><a className="btn outline" href={maps} target="_blank" rel="noopener noreferrer">Cómo llegar</a></div>
        <div className="card"><MessageCircle /><h3>WhatsApp</h3><p>+{settings.whatsapp}</p><a className="btn" href={waLink(settings.whatsapp, 'Hola ERRANTE, tengo una consulta.')} target="_blank" rel="noopener noreferrer">Escribirnos</a></div>
        <div className="card"><Clock /><h3>Horario</h3><p>{settings.hours}</p></div>
      </div>
    </div>
  )
}

export function NotFound() {
  return <div className="wrap section center"><h2>Página no encontrada</h2><p className="muted">Parece que este camino no lleva a ningún sabor.</p><Link to="/" className="btn">Volver al inicio</Link></div>
}
