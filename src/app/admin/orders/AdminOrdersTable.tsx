'use client'
import { useState } from 'react'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

interface Order {
  id: string
  user_id: string
  status: string
  payment_method: string
  subtotal: number
  total: number
  created_at: string
  profiles: { full_name: string } | null
  addresses: { full_name: string; city: string } | null
}

interface Props {
  orders: Order[]
}

export default function AdminOrdersTable({ orders }: Props) {
  const [updating, setUpdating] = useState<string | null>(null)

  async function handleStatusChange(orderId: string, status: string) {
    setUpdating(orderId)
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    } catch {}
    setUpdating(null)
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 px-8 py-16 text-center text-gray-400 text-sm">
        No orders yet.
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-[#FAFAF8]">
              <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Order ID</th>
              <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Customer</th>
              <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Date</th>
              <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Total</th>
              <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Payment</th>
              <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-[#FFF5F0] transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-bold text-[#1A1A1A]">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-[#1A1A1A]">
                  {order.profiles?.full_name || order.addresses?.full_name || 'N/A'}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(order.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3 font-bold text-[#1A1A1A]">
                  ₹{order.total.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">
                  {order.payment_method === 'cod' ? 'COD' : 'Online'}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updating === order.id}
                    className={`text-xs font-bold px-2 py-1 rounded-sm border-0 cursor-pointer
                      ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}
                      disabled:opacity-50`}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
