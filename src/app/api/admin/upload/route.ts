import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() ?? 'png'
    const filename = `${randomUUID()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const supabase = createServerSupabase()

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filename, buffer, { contentType: file.type })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filename)

    console.log('Upload complete, returning URL:', publicUrl)

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
