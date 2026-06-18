'use client'
import { useState, useRef, DragEvent, ChangeEvent } from 'react'

interface Props {
  value: string
  onChange: (url: string) => void
  onUploadingChange?: (uploading: boolean) => void
}

export default function ImageUploader({ value, onChange, onUploadingChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB')
      return
    }

    setUploading(true)
    onUploadingChange?.(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (res.ok) {
        onChange(data.url)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    setDragOver(true)
  }

  function onDragLeave() {
    setDragOver(false)
  }

  function onClick() {
    inputRef.current?.click()
  }

  function onChangeInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <div
        onClick={onClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative border-2 border-dashed rounded-sm p-6 text-center cursor-pointer
          transition-all duration-200
          ${dragOver ? 'border-[#FF3D00] bg-[#FF3D00]/5' : 'border-[#FF3D00]/30 hover:border-[#FF3D00]/60'}
          ${value ? 'p-2' : 'p-6'}`}
      >
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-sm text-[#FF3D00] font-['Barlow_Condensed'] font-bold tracking-widest uppercase">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading...
            </div>
          </div>
        )}

        {value ? (
          <div className="relative max-w-xs mx-auto">
            <img src={value} alt="Preview" className="w-full h-auto max-h-48 object-contain" />
          </div>
        ) : (
          <div className="text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs font-['Barlow_Condensed'] tracking-wider uppercase">
              Drop an image or click to browse
            </p>
            <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, WebP · Max 5MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChangeInput}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-xs text-red-500 font-['Barlow_Condensed']">{error}</p>
      )}

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-2 text-xs text-gray-400 hover:text-[#FF3D00] transition-colors font-['Barlow_Condensed'] uppercase tracking-wider"
        >
          Remove image
        </button>
      )}
    </div>
  )
}
