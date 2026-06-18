export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase'
import ProductForm from '@/components/admin/ProductForm'
import type { Product } from '@/data/products'

interface Props {
  params: { id: string }
}

export default async function EditProductPage({ params }: Props) {
  const { data, error } = await createServerSupabase()
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    notFound()
  }

  const product: Product = {
    id: data.id,
    name: data.name,
    series: data.series,
    scale: data.scale,
    price: data.price,
    oldPrice: data.old_price ?? undefined,
    badge: data.badge ?? undefined,
    section: data.section,
    sortOrder: data.sort_order,
    image: data.image_url,
  }

  return (
    <div>
      <h1 className="font-['Bebas_Neue'] text-4xl text-[#1A1A1A] mb-8">
        EDIT <span className="text-[#FF3D00]">PRODUCT</span>
      </h1>
      <ProductForm initialData={product} />
    </div>
  )
}
