import { useState, type FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/store'
import { BRAND } from '../../config/brand'

export default function Login() {
  const { isAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  if (!loading && isAdmin) return <Navigate to="/admin" replace />
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setErr('Correo o contraseña incorrectos.')
    setBusy(false)
  }
  return (
    <div className="login">
      <form className="card form" onSubmit={submit}>
        <img src={BRAND.logo} alt={BRAND.name} />
        <h3>Panel del equipo</h3>
        <label>Correo<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Contraseña<input type="password" required value={pass} onChange={e => setPass(e.target.value)} /></label>
        {err && <p className="notice">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        <Link to="/" className="muted center">← Volver a la tienda</Link>
      </form>
    </div>
  )
}
