import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = createServerSupabase()

    const { error } = await supabase
      .from('orders')
      .update({ status: body.status })
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
