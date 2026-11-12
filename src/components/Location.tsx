import { Clock, MapPin, MessageCircle, Check, Map } from 'lucide-react'
import { useStore } from '../lib/store'
import { waLink } from './Layout'

export default function Location() {
  const { settings } = useStore()
  const q = encodeURIComponent(settings.mapQuery)
  return (
    <section className="location" id="ubicacion">
      <div className="wrap loc-grid">
        <div className="loc-info">
          <span className="kicker">Te esperamos</span>
          <h2>Encuentra nuestra pizzería</h2>
          <p className="li"><MapPin size={16} /> {settings.address}</p>
          <p className="li"><Clock size={16} /> {settings.hours}</p>
          <p className="li ok"><Check size={16} /> Envío a domicilio</p>
          <p className="li ok"><Check size={16} /> Recoger en local</p>
          <div className="actions">
            <a className="btn" href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer"><Map size={16} /> Abrir ubicación en mapa</a>
            <a className="btn outline" href={waLink(settings.whatsapp, 'Hola ERRANTE, tengo una consulta.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp</a>
          </div>
        </div>
        <iframe title="Mapa de ERRANTE" loading="lazy" src={`https://www.google.com/maps?q=${q}&output=embed`} />
      </div>
    </section>
  )
}
