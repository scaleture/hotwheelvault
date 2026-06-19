import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    console.log('PATCH payload received:', body)
    const supabase = createServerSupabase()

    const updatePayload = {
      name: body.name,
      series: body.series,
      scale: body.scale,
      price: body.price,
      old_price: body.oldPrice ?? null,
      badge: body.badge ?? null,
      section: body.section,
      sort_order: body.sortOrder,
      image_url: body.image,
      description: body.description ?? null,
      highlights: body.highlights ?? [],
      images: body.images ?? [],
      specs: body.specs ?? {},
      stock: body.stock ?? 99,
      is_published: body.isPublished ?? true,
    }
    console.log('Updating product with image_url:', updatePayload.image_url)

    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabase()

    const { data: existing } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', params.id)
      .single()

    if (existing?.image_url?.includes('/product-images/')) {
      const filename = existing.image_url.split('/product-images/')[1]
      if (filename) {
        try {
          await supabase.storage.from('product-images').remove([filename])
        } catch {
          // image cleanup failure is non-fatal
        }
      }
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
