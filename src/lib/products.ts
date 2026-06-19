import { createServerSupabase } from './supabase'
import type { Product } from '@/data/products'

function rowToProduct(row: any): Product {
  return {
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
    description: row.description ?? undefined,
    highlights: row.highlights ?? undefined,
    images: row.images ?? undefined,
    specs: row.specs ?? undefined,
    stock: row.stock ?? undefined,
    isPublished: row.is_published ?? undefined,
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await createServerSupabase()
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error || !data) {
      console.error('Failed to fetch products:', error?.message)
      return []
    }

    return data.map(rowToProduct)
  } catch (err) {
    console.error('Failed to fetch products:', err instanceof Error ? err.message : err)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await createServerSupabase()
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return null
    }

    return rowToProduct(data)
  } catch {
    return null
  }
}
