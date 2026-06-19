'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  images: string[]
  heroFallback: string
  alt: string
}

export default function ProductGallery({ images, heroFallback, alt }: Props) {
  const allImages = images.length > 0 ? images : [heroFallback]
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      <div className="relative w-full aspect-square bg-gradient-to-br from-[#FFF5F0] to-[#FFFDF0] overflow-hidden mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={allImages[activeIndex]}
              alt={`${alt} - Image ${activeIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-16 flex-shrink-0 border-2 transition-all overflow-hidden
                ${activeIndex === i ? 'border-[#FF3D00]' : 'border-gray-200 hover:border-gray-400'}`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
