import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const configured = Boolean(url && key)
export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder')
// Cliente temporal (sin sesión) para crear usuarios sin cerrar la sesión del admin.
export const tempClient = () =>
  createClient(url || 'https://placeholder.supabase.co', key || 'placeholder', {
    auth: { persistSession: false, autoRefreshToken: false, storageKey: 'errante-temp' },
  })
export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
