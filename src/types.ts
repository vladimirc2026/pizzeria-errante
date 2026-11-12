export interface Variant { name: string; price: number; old_price?: number | null }
export interface Category { id: string; name: string; slug: string; emoji: string; image_url: string; sort: number; active: boolean }
export interface Product {
  id: string; category_id: string | null; name: string; slug: string; description: string; ingredients: string; variants: Variant[]
  price: number; old_price: number | null; image_url: string; tag: string; active: boolean; featured: boolean; created_at: string
}
export interface OrderItem { id: string; name: string; price: number; qty: number }
export interface Order {
  id: string; customer_name: string; phone: string; address: string; notes: string
  items: OrderItem[]; total: number; status: string; order_type?: string; created_at: string
}
