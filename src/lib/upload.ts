import { supabase, slugify } from './supabase'
import { BRAND } from '../config/brand'

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}.${ext}`
  const { error } = await supabase.storage.from(BRAND.storageBucket).upload(path, file)
  if (error) throw new Error(error.message)
  return supabase.storage.from(BRAND.storageBucket).getPublicUrl(path).data.publicUrl
}
export const ingredientList = (t: string) => t.split(/[,\n]/).map(x => x.trim()).filter(Boolean)
