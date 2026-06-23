'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  productName: string
  productId: string
}

export default function ShareButton({ productName, productId }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = `${window.location.origin}/products/${productId}`
    if (navigator.share) {
      await navigator.share({
        title: `${productName} — HotWheel Vault`,
        text: `Check out the ${productName} on HotWheel Vault!`,
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-5 py-3 border border-gray-200
          text-gray-500 text-xs font-bold tracking-[2px] uppercase font-['Barlow_Condensed']
          hover:border-[#FF3D00] hover:text-[#FF3D00] transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        SHARE
      </button>
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1A1A1A]
            text-white text-xs px-3 py-1.5 whitespace-nowrap font-['Barlow_Condensed'] tracking-wider"
        >
          ✓ Link copied!
        </motion.div>
      )}
    </div>
  )
}
