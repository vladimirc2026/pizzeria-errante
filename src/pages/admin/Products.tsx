import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { supabase, slugify } from '../../lib/supabase'
import { BRAND, money } from '../../config/brand'
import type { Category, Product } from '../../types'

type Form = Omit<Product, 'id' | 'slug' | 'created_at'> & { id?: string }
const empty: Form = { category_id: null, name: '', description: '', price: 0, old_price: null, image_url: '', tag: '', active: true, featured: false }

export default function AdminProducts() {
  const [list, setList] = useState<Product[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [f, setF] = useState<Form | null>(null)
  const [err, setErr] = useState('')
  const [up, setUp] = useState(false)

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort'),
    ])
    setList((p.data as Product[]) ?? []); setCats((c.data as Category[]) ?? [])
  }, [])
  useEffect(() => { void load() }, [load])

  const upload = async (file: File) => {
    if (!f) return
    setUp(true); setErr('')
    const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from(BRAND.storageBucket).upload(path, file)
    if (error) setErr('No se pudo subir la imagen: ' + error.message)
    else setF({ ...f, image_url: supabase.storage.from(BRAND.storageBucket).getPublicUrl(path).data.publicUrl })
    setUp(false)
  }
  const save = async (e: FormEvent) => {
    e.preventDefault(); if (!f) return
    setErr('')
    const { id, ...rest } = f
    const res = id
      ? await supabase.from('products').update(rest).eq('id', id)
      : await supabase.from('products').insert({ ...rest, slug: `${slugify(f.name)}-${Date.now().toString(36).slice(-4)}` })
    if (res.error) setErr(res.error.message); else { setF(null); void load() }
  }
  const del = async (p: Product) => { if (confirm(`¿Eliminar "${p.name}"?`)) { await supabase.from('products').delete().eq('id', p.id); void load() } }

  if (f) return (
    <>
      <h2>{f.id ? 'Editar producto' : 'Nuevo producto'}</h2>
      <form className="card form" onSubmit={save}>
        <label>Nombre<input required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label>
        <label>Categoría<select value={f.category_id ?? ''} onChange={e => setF({ ...f, category_id: e.target.value || null })}>
          <option value="">Sin categoría</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label>Precio ({BRAND.currency})<input type="number" step="0.01" min="0" required value={f.price} onChange={e => setF({ ...f, price: Number(e.target.value) })} /></label>
        <label>Precio anterior (opcional, se muestra tachado como oferta)<input type="number" step="0.01" min="0" value={f.old_price ?? ''} onChange={e => setF({ ...f, old_price: e.target.value === '' ? null : Number(e.target.value) })} /></label>
        <label>Descripción<textarea rows={3} value={f.description} onChange={e => setF({ ...f, description: e.target.value })} /></label>
        <label>Etiqueta (opcional, ej. Favorito)<input value={f.tag} onChange={e => setF({ ...f, tag: e.target.value })} /></label>
        <label>Imagen<input type="file" accept="image/*" onChange={e => { const x = e.target.files?.[0]; if (x) void upload(x) }} /></label>
        {up && <p className="muted">Subiendo…</p>}
        <label>…o pega un enlace de imagen<input value={f.image_url} onChange={e => setF({ ...f, image_url: e.target.value })} /></label>
        {f.image_url && <img className="preview" src={f.image_url} alt="Vista previa" />}
        <label className="check"><input type="checkbox" checked={f.active} onChange={e => setF({ ...f, active: e.target.checked })} /> Visible en la tienda</label>
        <label className="check"><input type="checkbox" checked={f.featured} onChange={e => setF({ ...f, featured: e.target.checked })} /> Destacado en el inicio</label>
        {err && <p className="notice">{err}</p>}
        <div className="actions"><button className="btn">Guardar</button><button type="button" className="btn outline" onClick={() => setF(null)}>Cancelar</button></div>
      </form>
    </>
  )
  return (
    <>
      <div className="head"><h2>Productos</h2><button className="btn" onClick={() => setF(empty)}>+ Nuevo producto</button></div>
      <table><thead><tr><th></th><th>Nombre</th><th>Precio</th><th>Visible</th><th></th></tr></thead><tbody>
        {list.map(p => <tr key={p.id}>
          <td>{p.image_url && <img className="thumb" src={p.image_url} alt="" />}</td><td>{p.name}</td><td>{money(p.price)}</td><td>{p.active ? 'Sí' : 'No'}</td>
          <td><button className="link" onClick={() => setF({ ...p })}>Editar</button> <button className="link danger" onClick={() => void del(p)}>Eliminar</button></td></tr>)}
      </tbody></table>
    </>
  )
}
