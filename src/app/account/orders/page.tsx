'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useAuthStore } from '@/store/authStore'

interface OrderItem {
  id: string
  product_name: string
  product_image: string
  price: number
  qty: number
}

interface Order {
  id: string
  status: string
  payment_method: string
  total: number
  created_at: string
  order_items: OrderItem[]
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function OrdersPage() {
  const user = useAuthStore(s => s.user)
  const [orders, setOrders] = useState<Order[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    supabaseBrowser
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as unknown as Order[])
      })
  }, [user])

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-12 text-center">
        <span className="text-4xl block mb-4">📦</span>
        <p className="text-gray-500 text-sm mb-4">No orders yet</p>
        <Link href="/" className="text-[#FF3D00] text-sm font-bold uppercase tracking-wider
          font-['Barlow_Condensed'] hover:underline">
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="bg-white border border-gray-200">
          <button
            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="font-mono text-xs font-bold text-[#1A1A1A]">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-['Bebas_Neue'] text-lg text-[#1A1A1A]">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
              <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                {order.status}
              </span>
              <span className="text-gray-300 text-sm">{expanded === order.id ? '▲' : '▼'}</span>
            </div>
          </button>

          {expanded === order.id && (
            <div className="border-t border-gray-100 px-4 py-4 space-y-3">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-['Barlow_Condensed']">
                Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}
              </div>
              {order.order_items?.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-gray-100 flex-shrink-0">
                    <Image src={item.product_image} alt={item.product_name} fill sizes="48px" className="object-contain p-1" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#1A1A1A]">{item.product_name}</p>
                    <p className="text-xs text-gray-400">{item.qty} × ₹{item.price}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1A1A1A]">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
