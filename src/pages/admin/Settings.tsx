import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { supabase, tempClient } from '../../lib/supabase'
import { BRAND } from '../../config/brand'
import { useAuth } from '../../lib/store'

interface AdminRow { user_id: string; email: string }

export default function AdminSettings() {
  const { email: me } = useAuth()
  const [s, setS] = useState({ whatsapp: BRAND.whatsapp, address: BRAND.address, hours: BRAND.hours })
  const [msg, setMsg] = useState('')
  const [admins, setAdmins] = useState<AdminRow[]>([])
  const [nu, setNu] = useState({ email: '', pass: '' })
  const [umsg, setUmsg] = useState('')

  const load = useCallback(async () => {
    const st = await supabase.from('settings').select('*')
    const m = Object.fromEntries(((st.data as { key: string; value: string }[]) ?? []).map(r => [r.key, r.value]))
    setS(cur => ({ whatsapp: m.whatsapp || cur.whatsapp, address: m.address || cur.address, hours: m.hours || cur.hours }))
    const a = await supabase.from('admins').select('user_id,email').order('created_at')
    setAdmins((a.data as AdminRow[]) ?? [])
  }, [])
  useEffect(() => { void load() }, [load])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('settings').upsert(Object.entries(s).map(([key, value]) => ({ key, value })))
    setMsg(error ? error.message : 'Guardado ✔ (se ve de inmediato en la tienda)')
  }
  const createUser = async (e: FormEvent) => {
    e.preventDefault(); setUmsg('Creando…')
    const { error } = await tempClient().auth.signUp({ email: nu.email, password: nu.pass })
    if (error && !/registered/i.test(error.message)) { setUmsg(error.message); return }
    const r = await supabase.rpc('add_admin', { p_email: nu.email })
    if (r.error) { setUmsg(r.error.message); return }
    setUmsg('Usuario creado ✔ ya puede entrar al panel.'); setNu({ email: '', pass: '' }); void load()
  }
  const remove = async (a: AdminRow) => {
    if (!confirm(`¿Quitar el acceso a ${a.email}?`)) return
    await supabase.from('admins').delete().eq('user_id', a.user_id); void load()
  }
  return (
    <>
      <h2>Ajustes</h2>
      <form className="card form" onSubmit={save}>
        <label>WhatsApp (con código de país, sin +)<input value={s.whatsapp} onChange={e => setS({ ...s, whatsapp: e.target.value })} /></label>
        <label>Dirección<input value={s.address} onChange={e => setS({ ...s, address: e.target.value })} /></label>
        <label>Horario<input value={s.hours} onChange={e => setS({ ...s, hours: e.target.value })} /></label>
        <button className="btn">Guardar</button>{msg && <p className="muted">{msg}</p>}
      </form>
      <h3>Usuarios del panel</h3>
      <form className="card form" onSubmit={createUser}>
        <label>Correo del nuevo usuario<input type="email" required value={nu.email} onChange={e => setNu({ ...nu, email: e.target.value })} /></label>
        <label>Contraseña (mínimo 6 caracteres)<input type="password" minLength={6} required value={nu.pass} onChange={e => setNu({ ...nu, pass: e.target.value })} /></label>
        <button className="btn">Crear usuario</button>{umsg && <p className="muted">{umsg}</p>}
      </form>
      <table><tbody>{admins.map(a => <tr key={a.user_id}><td>{a.email}</td>
        <td>{a.email === me ? <span className="muted">(tú)</span> : <button className="link danger" onClick={() => void remove(a)}>Quitar acceso</button>}</td></tr>)}</tbody></table>
    </>
  )
}
