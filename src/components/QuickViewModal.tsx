'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/data/products'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCartStore()

  if (!product) return null

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
    onClose()
  }

  const BADGE_STYLES: Record<string, string> = {
    'HOT': 'bg-[#FF3D00] text-white',
    'NEW': 'bg-[#FFD700] text-black',
    'LIMITED': 'border border-white/40 text-white bg-black/50',
    'SUPER TH': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white max-w-[700px] w-full flex flex-col sm:flex-row shadow-2xl"
        >
          {/* Image */}
          <div className="sm:w-1/2 h-[250px] sm:h-[400px] relative bg-gradient-to-br from-[#FFF5F0] to-[#FFFDF0]">
            <Image src={product.image} alt={product.name} fill className="object-contain p-6" />
            {product.badge && (
              <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2 py-1 font-['Barlow_Condensed'] ${BADGE_STYLES[product.badge]}`}>
                {product.badge === 'HOT' ? '🔥 HOT' : product.badge === 'NEW' ? 'NEW' : product.badge === 'LIMITED' ? 'LIMITED' : '⭐ SUPER TH'}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
            <div className="text-[10px] tracking-[2px] uppercase text-[#FF3D00] font-semibold mb-1 font-['Barlow_Condensed']">
              {product.series}
            </div>
            <h2 className="font-['Bebas_Neue'] text-3xl text-[#1A1A1A] mb-2">{product.name}</h2>
            <p className="text-[11px] text-gray-400 mb-4">{product.scale}</p>

            {product.oldPrice && (
              <p className="text-sm text-gray-400 line-through font-['Barlow'] mb-1">₹{product.oldPrice}</p>
            )}
            <p className="font-['Bebas_Neue'] text-4xl text-[#FF3D00] mb-6">₹{product.price}</p>

            <button
              onClick={handleAdd}
              className="bg-[#FF3D00] text-white py-4 font-['Bebas_Neue'] text-lg tracking-[3px] 
                hover:bg-[#FF5500] transition-all hover:-translate-y-1 active:scale-95 w-full"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              ADD TO CART
            </button>

            <button
              onClick={onClose}
              className="mt-3 text-gray-400 text-xs tracking-widest uppercase font-['Barlow_Condensed'] 
                hover:text-[#FF3D00] transition-colors"
            >
              Continue browsing →
            </button>
          </div>

          {/* Close X */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-[#1A1A1A] text-xl transition-colors bg-white/80 w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}