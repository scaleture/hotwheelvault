'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import Toast from './Toast'
import type { Product } from '@/data/products'

const BADGE_STYLES: Record<string, string> = {
  'HOT':      'bg-[#FF3D00] text-white',
  'NEW':      'bg-[#FFD700] text-black',
  'LIMITED':  'border border-white/40 text-white bg-black/50',
  'SUPER TH': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black',
}

const BADGE_LABELS: Record<string, string> = {
  'HOT': '🔥 HOT',
  'NEW': 'NEW',
  'LIMITED': 'LIMITED',
  'SUPER TH': '⭐ SUPER TH',
}

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCartStore()
  const [showToast, setShowToast] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = 
      `translateY(-8px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = ''
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
      className="bg-white border border-gray-200 relative overflow-hidden cursor-pointer
        hover:border-[#FF3D00]/50 hover:shadow-[0_24px_60px_rgba(255,61,0,0.25)]
        hover:shadow-[#FF3D00]/10 transition-all duration-300 group"
    >
      {product.badge && (
        <span className={`absolute top-3 left-3 z-10 text-[10px] font-bold 
          tracking-widest uppercase px-2 py-1 font-['Barlow_Condensed'] 
          ${BADGE_STYLES[product.badge]}`}>
          {BADGE_LABELS[product.badge]}
        </span>
      )}

      <div className="h-[210px] relative bg-gradient-to-br from-[#FFF5F0] to-[#FFFDF0] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 
            group-hover:scale-110 group-hover:-translate-y-1"
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 
          bg-gradient-to-t from-[#FF3D00]/10 to-transparent" />
        <div className="absolute bottom-3 left-[10%] right-[10%] h-px 
          bg-gradient-to-r from-transparent via-[#FF3D00]/50 to-transparent" />

        {/* Quick View overlay */}
        {onQuickView && (
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product) }}
            className="absolute inset-0 flex items-center justify-center bg-black/0 
              group-hover:bg-black/60 transition-all duration-300"
          >
            <span className="text-white text-xs tracking-widest uppercase font-['Barlow_Condensed'] font-bold 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#FF3D00] px-5 py-2.5">
              QUICK VIEW
            </span>
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="text-[10px] tracking-[2px] uppercase text-[#FF3D00] font-semibold mb-1 
          font-['Barlow_Condensed']">
          {product.series}
        </div>
        <div className="text-lg font-bold text-[#1A1A1A] font-['Barlow_Condensed'] mb-1">
          {product.name}
        </div>
        <div className="text-[11px] text-gray-400 mb-4">{product.scale}</div>

        <div className="flex items-center justify-between">
          <div className="font-['Bebas_Neue'] text-2xl text-[#1A1A1A] flex items-baseline gap-2">
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through font-['Barlow'] font-normal">
                ₹{product.oldPrice}
              </span>
            )}
            ₹{product.price}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 bg-[#FF3D00] flex items-center justify-center 
              hover:bg-[#FF5500] transition-all hover:scale-110 active:scale-95"
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          >
            <svg className="w-4 h-4 stroke-white fill-none" strokeWidth={2.5} viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      <Toast message="🏎️ Added to cart!" visible={showToast} />
    </motion.div>
  )
}
