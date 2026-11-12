import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { supabase, slugify } from '../../lib/supabase'
import { uploadImage } from '../../lib/upload'
import type { Category } from '../../types'

interface Form { id?: string; name: string; emoji: string; image_url: string; active: boolean }
const empty: Form = { name: '', emoji: '🍽️', image_url: '', active: true }

export default function AdminCategories() {
  const [list, setList] = useState<Category[]>([])
  const [f, setF] = useState<Form | null>(null)
  const [err, setErr] = useState('')
  const [up, setUp] = useState(false)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const load = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('sort')
    setList((data as Category[]) ?? [])
    const { data: pr } = await supabase.from('products').select('category_id')
    const m: Record<string, number> = {}; (pr ?? []).forEach((r: { category_id: string | null }) => { if (r.category_id) m[r.category_id] = (m[r.category_id] ?? 0) + 1 }); setCounts(m)
  }, [])
  useEffect(() => { void load() }, [load])

  const save = async (e: FormEvent) => {
    e.preventDefault(); if (!f) return
    setErr('')
    const { id, ...rest } = f
    const res = id
      ? await supabase.from('categories').update(rest).eq('id', id)
      : await supabase.from('categories').insert({ ...rest, slug: slugify(f.name) || `cat-${Date.now()}`, sort: list.length })
    if (res.error) setErr(res.error.message); else { setF(null); void load() }
  }
  const pick = async (file: File) => {
    if (!f) return
    setUp(true); setErr('')
    try { setF({ ...f, image_url: await uploadImage(file) }) } catch (x) { setErr('No se pudo subir la imagen: ' + (x as Error).message) }
    setUp(false)
  }
  const move = async (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= list.length) return
    const arr = [...list]; [arr[i], arr[j]] = [arr[j], arr[i]]
    await Promise.all(arr.map((c, k) => supabase.from('categories').update({ sort: k }).eq('id', c.id)))
    void load()
  }
  const toggle = async (c: Category) => { await supabase.from('categories').update({ active: !c.active }).eq('id', c.id); void load() }
  const del = async (c: Category) => {
    if (!confirm(`¿Eliminar "${c.name}"? Sus ${counts[c.id] ?? 0} productos quedarán sin categoría.`)) return
    await supabase.from('categories').delete().eq('id', c.id); void load()
  }

  if (f) return (
    <>
      <h2>{f.id ? 'Editar categoría' : 'Nueva categoría'}</h2>
      <form className="card form" onSubmit={save}>
        <label>Nombre<input required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label>
        <label>Emoji (se usa si no hay foto)<input className="emoji" value={f.emoji} onChange={e => setF({ ...f, emoji: e.target.value })} /></label>
        <label>Foto de la categoría<input type="file" accept="image/*" onChange={e => { const x = e.target.files?.[0]; if (x) void pick(x) }} /></label>
        {up && <p className="muted">Subiendo…</p>}
        {f.image_url && <><img className="preview" src={f.image_url} alt="Vista previa" /><button type="button" className="link danger" onClick={() => setF({ ...f, image_url: '' })}>Quitar foto</button></>}
        <label className="check"><input type="checkbox" checked={f.active} onChange={e => setF({ ...f, active: e.target.checked })} /> Visible en la tienda</label>
        {err && <p className="notice">{err}</p>}
        <div className="actions"><button className="btn">Guardar</button><button type="button" className="btn outline" onClick={() => setF(null)}>Cancelar</button></div>
      </form>
    </>
  )
  return (
    <>
      <div className="head"><h2>Categorías</h2><button className="btn" onClick={() => setF(empty)}>+ Nueva categoría</button></div>
      <p className="muted">Usa las flechas para cambiar el orden en que se muestran en la tienda.</p>
      <table><thead><tr><th>Orden</th><th></th><th>Nombre</th><th>Productos</th><th>Visible</th><th></th></tr></thead><tbody>
        {list.map((c, i) => <tr key={c.id}>
          <td><button className="link" onClick={() => void move(i, -1)} aria-label="Subir"><ArrowUp size={16} /></button><button className="link" onClick={() => void move(i, 1)} aria-label="Bajar"><ArrowDown size={16} /></button></td>
          <td>{c.image_url ? <img className="thumb" src={c.image_url} alt="" /> : <span style={{ fontSize: 26 }}>{c.emoji}</span>}</td>
          <td>{c.name}</td><td>{counts[c.id] ?? 0}</td>
          <td><input type="checkbox" checked={c.active} onChange={() => void toggle(c)} /></td>
          <td><button className="link" onClick={() => setF({ id: c.id, name: c.name, emoji: c.emoji, image_url: c.image_url ?? '', active: c.active })}>Editar</button>{c.slug !== 'promociones' && <button className="link danger" onClick={() => void del(c)}>Eliminar</button>}</td></tr>)}
      </tbody></table>
    </>
  )
}
