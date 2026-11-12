import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { supabase, slugify } from '../../lib/supabase'
import { uploadImage } from '../../lib/upload'
import { BRAND, money } from '../../config/brand'
import { ingredientList } from '../../lib/upload'
import type { Category, Product, Variant } from '../../types'

type Form = Omit<Product, 'id' | 'slug' | 'created_at'> & { id?: string }
const empty: Form = { category_id: null, name: '', description: '', ingredients: '', price: 0, old_price: null, variants: [], image_url: '', tag: '', active: true, featured: false }

export default function AdminProducts({ promo = false }: { promo?: boolean }) {
  const [list, setList] = useState<Product[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [f, setF] = useState<Form | null>(null)
  const [err, setErr] = useState('')
  const [up, setUp] = useState(false)
  const [filter, setFilter] = useState('')

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort'),
    ])
    setList((p.data as Product[]) ?? []); setCats((c.data as Category[]) ?? [])
  }, [])
  useEffect(() => { void load() }, [load])

  const promoCat = cats.find(c => c.slug === 'promociones')
  const shown = promo ? list.filter(p => p.category_id === promoCat?.id) : list.filter(p => !filter || p.category_id === filter)
  const catName = (id: string | null) => cats.find(c => c.id === id)?.name ?? '—'
  const vs: Variant[] = f?.variants ?? []
  const setV = (i: number, patch: Partial<Variant>) => f && setF({ ...f, variants: vs.map((v, k) => k === i ? { ...v, ...patch } : v) })

  const pick = async (file: File) => {
    if (!f) return
    setUp(true); setErr('')
    try { setF({ ...f, image_url: await uploadImage(file) }) } catch (x) { setErr('No se pudo subir la imagen: ' + (x as Error).message) }
    setUp(false)
  }
  const save = async (e: FormEvent) => {
    e.preventDefault(); if (!f) return
    setErr('')
    const variants = vs.filter(v => v.name.trim()).map(v => ({ name: v.name.trim(), price: Number(v.price) || 0, old_price: v.old_price ? Number(v.old_price) : null }))
    const price = variants.length ? Math.min(...variants.map(v => v.price)) : f.price
    const { id, ...rest } = { ...f, variants, price }
    const res = id
      ? await supabase.from('products').update(rest).eq('id', id)
      : await supabase.from('products').insert({ ...rest, slug: `${slugify(f.name)}-${Date.now().toString(36).slice(-4)}` })
    if (res.error) setErr(res.error.message); else { setF(null); void load() }
  }
  const del = async (p: Product) => { if (confirm(`¿Eliminar "${p.name}"?`)) { await supabase.from('products').delete().eq('id', p.id); void load() } }
  const toggle = async (p: Product) => { await supabase.from('products').update({ active: !p.active }).eq('id', p.id); void load() }
  const dup = async (p: Product) => {
    const { id: _id, created_at: _c, slug: _s, ...rest } = p
    await supabase.from('products').insert({ ...rest, name: `${p.name} (copia)`, active: false, slug: `${slugify(p.name)}-${Date.now().toString(36).slice(-4)}` }); void load()
  }
  const label = promo ? 'promoción' : 'producto'

  if (f) return (
    <>
      <h2>{f.id ? `Editar ${label}` : `Nueva ${label}`}</h2>
      <form className="card form" onSubmit={save}>
        <label>Nombre<input required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label>
        <label>Categoría<select value={f.category_id ?? ''} onChange={e => setF({ ...f, category_id: e.target.value || null })}>
          <option value="">Sin categoría</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label>Descripción (se muestra en la ficha)<textarea rows={3} value={f.description} onChange={e => setF({ ...f, description: e.target.value })} /></label>
        <label>Ingredientes (sepáralos con coma o un renglón cada uno)<textarea rows={3} placeholder="Queso mozzarella, jamón, pepperoni, salsa de tomate" value={f.ingredients} onChange={e => setF({ ...f, ingredients: e.target.value })} /></label>
        {ingredientList(f.ingredients).length > 0 && <ul className="chips">{ingredientList(f.ingredients).map(i => <li key={i}>{i}</li>)}</ul>}

        <fieldset className="fs"><legend>Tamaños y precios</legend>
          <p className="muted">Ej.: Personal, Mediana, Grande, Familiar. Si no pones tamaños, se usa el precio de abajo.</p>
          {vs.map((v, i) => (
            <div className="vrow" key={i}>
              <input placeholder="Tamaño" value={v.name} onChange={e => setV(i, { name: e.target.value })} />
              <input type="number" step="0.01" min="0" placeholder="Precio" value={v.price || ''} onChange={e => setV(i, { price: Number(e.target.value) })} />
              <input type="number" step="0.01" min="0" placeholder="Antes (opcional)" value={v.old_price ?? ''} onChange={e => setV(i, { old_price: e.target.value === '' ? null : Number(e.target.value) })} />
              <button type="button" className="link danger" onClick={() => setF({ ...f, variants: vs.filter((_, k) => k !== i) })}>✕</button>
            </div>
          ))}
          <div className="actions" style={{ marginTop: 6 }}>
            <button type="button" className="btn outline" onClick={() => setF({ ...f, variants: [...vs, { name: '', price: 0, old_price: null }] })}>+ Agregar tamaño</button>
            {vs.length === 0 && <button type="button" className="btn outline" onClick={() => setF({ ...f, variants: ['Personal', 'Mediana', 'Grande', 'Familiar'].map(name => ({ name, price: 0, old_price: null })) })}>🍕 Usar 4 tamaños de pizza</button>}
          </div>
        </fieldset>

        {vs.length === 0 && <>
          <label>Precio ({BRAND.currency})<input type="number" step="0.01" min="0" required value={f.price} onChange={e => setF({ ...f, price: Number(e.target.value) })} /></label>
          <label>Precio anterior (opcional, se muestra tachado como oferta)<input type="number" step="0.01" min="0" value={f.old_price ?? ''} onChange={e => setF({ ...f, old_price: e.target.value === '' ? null : Number(e.target.value) })} /></label>
        </>}
        <label>Etiqueta (opcional, ej. Favorito)<input value={f.tag} onChange={e => setF({ ...f, tag: e.target.value })} /></label>
        <label>Imagen<input type="file" accept="image/*" onChange={e => { const x = e.target.files?.[0]; if (x) void pick(x) }} /></label>
        {up && <p className="muted">Subiendo…</p>}
        <label>…o pega un enlace de imagen<input value={f.image_url} onChange={e => setF({ ...f, image_url: e.target.value })} /></label>
        {f.image_url && <img className="preview" src={f.image_url} alt="Vista previa" />}
        <label className="check"><input type="checkbox" checked={f.active} onChange={e => setF({ ...f, active: e.target.checked })} /> Visible en la tienda</label>
        <label className="check"><input type="checkbox" checked={f.featured} onChange={e => setF({ ...f, featured: e.target.checked })} /> Destacado</label>
        {err && <p className="notice">{err}</p>}
        <div className="actions"><button className="btn">Guardar</button><button type="button" className="btn outline" onClick={() => setF(null)}>Cancelar</button></div>
      </form>
    </>
  )
  return (
    <>
      <div className="head"><h2>{promo ? '🔥 Promociones' : 'Productos'}</h2>
        <button className="btn" onClick={() => setF({ ...empty, category_id: promo ? promoCat?.id ?? null : null })}>+ Nueva {label}</button></div>
      {promo && <p className="muted">Las promociones con foto aparecen en el banner principal de la tienda. Pon un “Precio anterior” para mostrar el descuento.</p>}
      {!promo && <div className="filters"><button className={!filter ? 'chip active' : 'chip'} onClick={() => setFilter('')}>Todos</button>{cats.map(c => <button key={c.id} className={filter === c.id ? 'chip active' : 'chip'} onClick={() => setFilter(c.id)}>{c.emoji} {c.name}</button>)}</div>}
      {promo && !promoCat && <p className="notice">No existe la categoría “Promociones”. Ejecuta el SQL de actualización (paso 4 del README).</p>}
      <table><thead><tr><th></th><th>Nombre</th>{!promo && <th>Categoría</th>}<th>Precio</th><th>Visible</th><th></th></tr></thead><tbody>
        {shown.map(p => <tr key={p.id}>
          <td>{p.image_url && <img className="thumb" src={p.image_url} alt="" />}</td><td>{p.name}</td>{!promo && <td>{catName(p.category_id)}</td>}
          <td>{(p.variants ?? []).length > 0 ? `Desde ${money(p.price)}` : money(p.price)}</td><td><input type="checkbox" checked={p.active} onChange={() => void toggle(p)} /></td>
          <td><button className="link" onClick={() => setF({ ...p, variants: p.variants ?? [], ingredients: p.ingredients ?? '' })}>Editar</button> <button className="link" onClick={() => void dup(p)}>Duplicar</button> <button className="link danger" onClick={() => void del(p)}>Eliminar</button></td></tr>)}
      </tbody></table>
    </>
  )
}
