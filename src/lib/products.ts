import { createServerSupabase } from './supabase'
import type { Product } from '@/data/products'

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await createServerSupabase()
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error || !data) {
      console.error('Failed to fetch products:', error?.message)
      return []
    }

    return data.map(row => ({
      id: row.id,
      name: row.name,
      series: row.series,
      scale: row.scale,
      price: row.price,
      oldPrice: row.old_price ?? undefined,
      badge: row.badge ?? undefined,
      section: row.section,
      sortOrder: row.sort_order,
      image: row.image_url,
    }))
  } catch (err) {
    console.error('Failed to fetch products:', err instanceof Error ? err.message : err)
    return []
  }
}
