'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from './ImageUploader'
import type { Product } from '@/data/products'

interface Props {
  initialData?: Product
}

export default function ProductForm({ initialData }: Props) {
  const router = useRouter()
  const isEdit = !!initialData
  const [saving, setSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState(initialData?.name ?? '')
  const [series, setSeries] = useState(initialData?.series ?? '')
  const [scale, setScale] = useState(initialData?.scale ?? '')
  const [price, setPrice] = useState(String(initialData?.price ?? ''))
  const [oldPrice, setOldPrice] = useState(String(initialData?.oldPrice ?? ''))
  const [badge, setBadge] = useState(initialData?.badge ?? '')
  const [section, setSection] = useState<'featured' | 'track-sets'>(initialData?.section ?? 'featured')
  const [sortOrder, setSortOrder] = useState(String(initialData?.sortOrder ?? ''))
  const [image, setImage] = useState(initialData?.image ?? '')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      name,
      series,
      scale,
      price: parseInt(price, 10),
      oldPrice: oldPrice ? parseInt(oldPrice, 10) : undefined,
      badge: badge || undefined,
      section,
      sortOrder: parseInt(sortOrder, 10),
      image,
    }

    console.log('Submitting with image:', payload.image)

    try {
      const url = isEdit
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products'

      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin')
        setTimeout(() => router.refresh(), 100)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save product')
      }
    } catch {
      setError('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const disabled = saving || isUploading

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 px-5 py-4">
          <p className="text-red-600 text-xs font-['Barlow_Condensed'] uppercase tracking-wider">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required
            className="bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[#FF3D00] outline-none w-full" />
        </div>
        <div>
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Series</label>
          <input value={series} onChange={e => setSeries(e.target.value)} required
            className="bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[#FF3D00] outline-none w-full" />
        </div>
        <div>
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Scale / Description</label>
          <input value={scale} onChange={e => setScale(e.target.value)} required
            className="bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[#FF3D00] outline-none w-full" />
        </div>
        <div>
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Price (₹)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min={0}
            className="bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[#FF3D00] outline-none w-full" />
        </div>
        <div>
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Old Price (₹)</label>
          <input type="number" value={oldPrice} onChange={e => setOldPrice(e.target.value)} min={0}
            className="bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[#FF3D00] outline-none w-full" />
        </div>
        <div>
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Badge</label>
          <select value={badge} onChange={e => setBadge(e.target.value)}
            className="bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[#FF3D00] outline-none w-full">
            <option value="">None</option>
            <option value="HOT">HOT</option>
            <option value="NEW">NEW</option>
            <option value="LIMITED">LIMITED</option>
            <option value="SUPER TH">SUPER TH</option>
          </select>
        </div>
        <div>
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Section</label>
          <select value={section} onChange={e => setSection(e.target.value as 'featured' | 'track-sets')}
            className="bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[#FF3D00] outline-none w-full">
            <option value="featured">Featured Drops</option>
            <option value="track-sets">Track Sets</option>
          </select>
        </div>
        <div>
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Sort Order</label>
          <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} required min={0}
            className="bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[#FF3D00] outline-none w-full" />
        </div>
      </div>

      <div>
        <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Image</label>
        <ImageUploader value={image} onChange={setImage} onUploadingChange={setIsUploading} />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={disabled}
          className="bg-[#FF3D00] text-white px-8 py-3 text-sm font-bold tracking-[3px]
            uppercase font-['Barlow_Condensed'] hover:bg-[#FF5500] transition-all
            disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
        >
          {isUploading ? 'UPLOADING...' : saving ? 'SAVING...' : isEdit ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
        </button>
        <a
          href="/admin"
          className="text-sm text-gray-500 hover:text-[#1A1A1A] transition-colors font-['Barlow_Condensed'] uppercase tracking-wider"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
