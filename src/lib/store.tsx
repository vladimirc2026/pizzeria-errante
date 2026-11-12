import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { supabase, configured } from './supabase'
import { BRAND } from '../config/brand'
import type { Category, Product, OrderItem, Variant } from '../types'

/* ---------- Datos de la tienda (categorías, productos, ajustes) ---------- */
interface StoreCtx {
  categories: Category[]; products: Product[]; loading: boolean; error: string
  settings: { whatsapp: string; address: string; hours: string; mapQuery: string }
}
const Store = createContext<StoreCtx>(null!)
export const useStore = () => useContext(Store)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [categories, setC] = useState<Category[]>([])
  const [products, setP] = useState<Product[]>([])
  const [s, setS] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!configured) { setLoading(false); setError('Faltan las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'); return }
    Promise.all([
      supabase.from('categories').select('*').eq('active', true).order('sort'),
      supabase.from('products').select('*').eq('active', true).order('created_at'),
      supabase.from('settings').select('*'),
    ]).then(([c, p, st]) => {
      if (c.error || p.error) setError('No se pudo cargar el menú. ¿Ya ejecutaste el SQL en Supabase?')
      setC((c.data as Category[]) ?? []); setP((p.data as Product[]) ?? [])
      setS(Object.fromEntries(((st.data as { key: string; value: string }[]) ?? []).map(r => [r.key, r.value])))
      setLoading(false)
    })
  }, [])
  const settings = useMemo(() => ({
    whatsapp: s.whatsapp || BRAND.whatsapp, address: s.address || BRAND.address, hours: s.hours || BRAND.hours, mapQuery: s.map_query || BRAND.mapQuery,
  }), [s])
  return <Store.Provider value={{ categories, products, loading, error, settings }}>{children}</Store.Provider>
}

/* ---------- Carrito ---------- */
interface CartCtx {
  items: OrderItem[]; count: number; total: number; toast: { name: string; n: number } | null
  add: (p: Product, v?: Variant, qty?: number) => void; setQty: (id: string, q: number) => void; clear: () => void
}
const Cart = createContext<CartCtx>(null!)
export const useCart = () => useContext(Cart)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('errante-cart') || '[]') as OrderItem[] } catch { return [] }
  })
  useEffect(() => { try { localStorage.setItem('errante-cart', JSON.stringify(items)) } catch { /* ignorar */ } }, [items])
  const [toast, setToast] = useState<{ name: string; n: number } | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const notify = (name: string) => {
    setToast(t => ({ name, n: (t?.n ?? 0) + 1 }))
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), 2600)
  }
  const add = (p: Product, v?: Variant, qty = 1) => { notify(v ? `${p.name} (${v.name})` : p.name); addItem(p, v, qty) }
  const addItem = (p: Product, v: Variant | undefined, qty: number) => setItems(cur => {
    const id = v ? `${p.id}:${v.name}` : p.id
    if (cur.some(i => i.id === id)) return cur.map(i => i.id === id ? { ...i, qty: i.qty + qty } : i)
    return [...cur, { id, name: v ? `${p.name} (${v.name})` : p.name, price: Number(v?.price ?? p.price), qty }]
  })
  const setQty = (id: string, q: number) => setItems(cur => q <= 0 ? cur.filter(i => i.id !== id) : cur.map(i => i.id === id ? { ...i, qty: q } : i))
  const value: CartCtx = {
    items, add, setQty, toast, clear: () => setItems([]),
    count: items.reduce((a, i) => a + i.qty, 0), total: items.reduce((a, i) => a + i.qty * i.price, 0),
  }
  return <Cart.Provider value={value}>{children}</Cart.Provider>
}

/* ---------- Sesión del administrador ---------- */
interface AuthCtx { loading: boolean; isAdmin: boolean; email: string; signOut: () => Promise<void> }
const Auth = createContext<AuthCtx>(null!)
export const useAuth = () => useContext(Auth)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')
  useEffect(() => {
    const check = async (uid?: string, mail?: string) => {
      if (!uid) { setIsAdmin(false); setEmail(''); setLoading(false); return }
      const { data } = await supabase.from('admins').select('user_id').eq('user_id', uid).maybeSingle()
      setIsAdmin(Boolean(data)); setEmail(mail ?? ''); setLoading(false)
    }
    supabase.auth.getSession().then(({ data }) => check(data.session?.user.id, data.session?.user.email))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setTimeout(() => { void check(session?.user.id, session?.user.email) }, 0)
    })
    return () => sub.subscription.unsubscribe()
  }, [])
  return <Auth.Provider value={{ loading, isAdmin, email, signOut: async () => { await supabase.auth.signOut() } }}>{children}</Auth.Provider>
}
