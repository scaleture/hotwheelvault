'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Product } from '@/data/products'

interface Props {
  products: Product[]
}

export default function ProductTable({ products }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return

    setDeleting(product.id)

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      if (res.ok) {
        setTimeout(() => router.refresh(), 100)
      } else {
        alert('Failed to delete product')
      }
    } catch {
      alert('Failed to delete product')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="lg:hidden space-y-4">
        {products.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">
            No products yet. Click "+ ADD PRODUCT" to get started.
          </p>
        )}
        {products.map(p => (
          <div key={p.id} className="bg-white border border-gray-200 p-3 sm:p-4 flex gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 relative bg-gray-100 overflow-hidden flex-shrink-0">
              <Image src={p.image} alt={p.name} fill className="object-cover" sizes="64px" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-[#1A1A1A] truncate">{p.name}</div>
              <div className="text-xs text-gray-500 truncate">{p.series}</div>
              <div className="text-[#FF3D00] font-bold text-sm sm:text-base mt-1">₹{p.price}</div>
              <div className="flex gap-2 mt-2">
                <a href={`/admin/products/${p.id}/edit`}
                  className="text-xs uppercase tracking-wider font-bold px-3 py-1.5 
                    bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  EDIT
                </a>
                <button onClick={() => handleDelete(p)}
                  disabled={deleting === p.id}
                  className="text-xs uppercase tracking-wider font-bold px-3 py-1.5 
                    bg-red-50 text-red-500 hover:bg-red-100 transition-colors
                    disabled:opacity-40 disabled:cursor-not-allowed">
                  {deleting === p.id ? '...' : 'DELETE'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-[#FAFAF8]">
                <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Image</th>
                <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Name</th>
                <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Series</th>
                <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Price</th>
                <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Badge</th>
                <th className="text-left px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Section</th>
                <th className="text-right px-4 py-3 font-['Barlow_Condensed'] text-xs uppercase tracking-[2px] text-gray-500 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No products yet. Click "+ ADD PRODUCT" to get started.
                  </td>
                </tr>
              )}
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-[#FFF5F0] transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 relative bg-gray-100 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1A1A1A]">{product.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{product.series}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-[#1A1A1A]">₹{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-gray-400 text-xs line-through ml-2">₹{product.oldPrice}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.badge && (
                      <span className="inline-block bg-gradient-to-r from-[#FF3D00] to-[#FFD700] text-white
                        text-[10px] font-bold tracking-[1px] px-2 py-0.5 uppercase">
                        {product.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs uppercase tracking-[1px] text-gray-500">
                      {product.section}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs uppercase tracking-[2px] font-['Barlow_Condensed'] font-bold
                          text-[#FF3D00] hover:text-[#FF5500] transition-colors px-3 py-1.5
                          border border-[#FF3D00]/30 hover:border-[#FF3D00]"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={deleting === product.id}
                        className="text-xs uppercase tracking-[2px] font-['Barlow_Condensed'] font-bold
                          text-red-600 hover:text-red-800 transition-colors px-3 py-1.5
                          border border-red-200 hover:border-red-400
                          disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {deleting === product.id ? 'DELETING...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
