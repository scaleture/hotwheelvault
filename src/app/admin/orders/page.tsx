export const dynamic = 'force-dynamic'
import { createServerSupabase } from '@/lib/supabase'
import AdminOrdersTable from './AdminOrdersTable'

export default async function AdminOrdersPage() {
  const supabase = createServerSupabase()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name), addresses(*)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-['Bebas_Neue'] text-4xl text-[#1A1A1A] mb-8">
        ALL <span className="text-[#FF3D00]">ORDERS</span>
      </h1>
      <AdminOrdersTable orders={orders || []} />
    </div>
  )
}
