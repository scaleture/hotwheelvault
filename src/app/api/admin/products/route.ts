import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('POST payload received:', body)
    const supabase = createServerSupabase()

    const insertPayload = {
      name: body.name,
      series: body.series,
      scale: body.scale,
      price: body.price,
      old_price: body.oldPrice ?? null,
      badge: body.badge ?? null,
      section: body.section,
      sort_order: body.sortOrder,
      image_url: body.image,
    }
    console.log('Inserting product with image_url:', insertPayload.image_url)

    const { data, error } = await supabase
      .from('products')
      .insert(insertPayload)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
