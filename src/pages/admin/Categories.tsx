import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { supabase, slugify } from '../../lib/supabase'
import type { Category } from '../../types'

export default function AdminCategories() {
  const [list, setList] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍽️')
  const [err, setErr] = useState('')
  const load = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('sort')
    setList((data as Category[]) ?? [])
  }, [])
  useEffect(() => { void load() }, [load])
  const add = async (e: FormEvent) => {
    e.preventDefault(); setErr('')
    const { error } = await supabase.from('categories').insert({ name, slug: slugify(name), emoji, sort: list.length + 1 })
    if (error) setErr(error.message); else { setName(''); void load() }
  }
  const toggle = async (c: Category) => { await supabase.from('categories').update({ active: !c.active }).eq('id', c.id); void load() }
  const del = async (c: Category) => {
    if (!confirm(`¿Eliminar "${c.name}"? Sus productos quedarán sin categoría.`)) return
    await supabase.from('categories').delete().eq('id', c.id); void load()
  }
  return (
    <>
      <h2>Categorías</h2>
      <form className="inline-form" onSubmit={add}>
        <input className="emoji" value={emoji} onChange={e => setEmoji(e.target.value)} aria-label="Emoji" />
        <input required placeholder="Nombre de la categoría" value={name} onChange={e => setName(e.target.value)} />
        <button className="btn">Agregar</button>
      </form>
      {err && <p className="notice">{err}</p>}
      <table><thead><tr><th></th><th>Nombre</th><th>Visible</th><th></th></tr></thead><tbody>
        {list.map(c => <tr key={c.id}><td>{c.emoji}</td><td>{c.name}</td>
          <td><input type="checkbox" checked={c.active} onChange={() => void toggle(c)} /></td>
          <td><button className="link danger" onClick={() => void del(c)}>Eliminar</button></td></tr>)}
      </tbody></table>
    </>
  )
}
