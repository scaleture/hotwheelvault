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
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [highlights, setHighlights] = useState<string[]>(initialData?.highlights ?? [])
  const [extraImages, setExtraImages] = useState<string[]>(initialData?.images ?? [])
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    initialData?.specs
      ? Object.entries(initialData.specs).map(([k, v]) => ({ key: k, value: v }))
      : [{ key: 'Scale', value: '1:64' }, { key: 'Series', value: '' }, { key: 'Year', value: '2024' }]
  )
  const [stock, setStock] = useState(String(initialData?.stock ?? 99))
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const specsObj: Record<string, string> = {}
    specs.forEach(s => { if (s.key.trim()) specsObj[s.key.trim()] = s.value })

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
      description: description || undefined,
      highlights: highlights.filter(h => h.trim()),
      images: extraImages.filter(img => img.trim()),
      specs: specsObj,
      stock: parseInt(stock, 10) || 0,
      isPublished,
    }

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

  function addHighlight() {
    if (highlights.length < 8) setHighlights([...highlights, ''])
  }

  function updateHighlight(i: number, val: string) {
    const next = [...highlights]; next[i] = val; setHighlights(next)
  }

  function removeHighlight(i: number) {
    setHighlights(highlights.filter((_, idx) => idx !== i))
  }

  function addExtraImage() {
    if (extraImages.length < 4) setExtraImages([...extraImages, ''])
  }

  function updateExtraImage(i: number, val: string) {
    const next = [...extraImages]; next[i] = val; setExtraImages(next)
  }

  function removeExtraImage(i: number) {
    setExtraImages(extraImages.filter((_, idx) => idx !== i))
  }

  function addSpec() {
    setSpecs([...specs, { key: '', value: '' }])
  }

  function updateSpecKey(i: number, val: string) {
    const next = [...specs]; next[i] = { ...next[i], key: val }; setSpecs(next)
  }

  function updateSpecValue(i: number, val: string) {
    const next = [...specs]; next[i] = { ...next[i], value: val }; setSpecs(next)
  }

  function removeSpec(i: number) {
    setSpecs(specs.filter((_, idx) => idx !== i))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 px-5 py-4">
          <p className="text-red-600 text-xs font-['Barlow_Condensed'] uppercase tracking-wider">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
        <div>
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Stock</label>
          <input type="number" value={stock} onChange={e => setStock(e.target.value)} min={0}
            className="bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[#FF3D00] outline-none w-full" />
        </div>
        <div>
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Published</label>
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={`relative w-28 h-9 rounded-full transition-colors duration-300 ${
              isPublished ? 'bg-[#FF3D00]' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white shadow transition-transform duration-300 ${
              isPublished ? 'translate-x-[76px]' : 'translate-x-0'
            }`} />
            <span className={`text-xs font-bold uppercase tracking-wider font-['Barlow_Condensed'] ${
              isPublished ? 'text-white ml-3' : 'text-gray-500 mr-3'
            }`}>
              {isPublished ? 'PUBLISHED' : 'DRAFT'}
            </span>
          </button>
        </div>
      </div>

      <div>
        <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Main Image</label>
        <ImageUploader value={image} onChange={setImage} onUploadingChange={setIsUploading} />
      </div>

      <div>
        <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6}
          placeholder="Describe the car — paint, history, collectability..."
          className="bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[#FF3D00] outline-none w-full" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500">Highlights (max 8)</label>
          {highlights.length < 8 && (
            <button type="button" onClick={addHighlight}
              className="text-xs text-[#FF3D00] hover:text-[#FF5500] font-['Barlow_Condensed'] uppercase tracking-wider font-bold">
              + ADD HIGHLIGHT
            </button>
          )}
        </div>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input value={h} onChange={e => updateHighlight(i, e.target.value)}
                placeholder="e.g. Real Riders wheels"
                className="bg-white border border-gray-200 px-4 py-2 text-sm focus:border-[#FF3D00] outline-none flex-1" />
              <button type="button" onClick={() => removeHighlight(i)}
                className="text-red-500 hover:text-red-700 text-xs font-bold px-2">✗</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500">Extra Images (max 4 additional)</label>
          {extraImages.length < 4 && (
            <button type="button" onClick={addExtraImage}
              className="text-xs text-[#FF3D00] hover:text-[#FF5500] font-['Barlow_Condensed'] uppercase tracking-wider font-bold">
              + ADD IMAGE
            </button>
          )}
        </div>
        <div className="space-y-4">
          {extraImages.map((img, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 font-['Barlow_Condensed'] uppercase tracking-wider">Image {i + 2}</span>
                <button type="button" onClick={() => removeExtraImage(i)}
                  className="text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
              </div>
              <ImageUploader value={img} onChange={(val) => updateExtraImage(i, val)} onUploadingChange={setIsUploading} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[2px] text-gray-500">Specifications</label>
          <button type="button" onClick={addSpec}
            className="text-xs text-[#FF3D00] hover:text-[#FF5500] font-['Barlow_Condensed'] uppercase tracking-wider font-bold">
            + ADD SPEC
          </button>
        </div>
        <div className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={s.key} onChange={e => updateSpecKey(i, e.target.value)}
                placeholder="Key (e.g. Scale)"
                className="bg-white border border-gray-200 px-4 py-2 text-sm focus:border-[#FF3D00] outline-none w-1/2" />
              <input value={s.value} onChange={e => updateSpecValue(i, e.target.value)}
                placeholder="Value (e.g. 1:64)"
                className="bg-white border border-gray-200 px-4 py-2 text-sm focus:border-[#FF3D00] outline-none w-1/2" />
              <button type="button" onClick={() => removeSpec(i)}
                className="text-red-500 hover:text-red-700 text-xs font-bold px-2">✗</button>
            </div>
          ))}
        </div>
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
