'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const { totalItems, toggleCart } = useCartStore()
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const scrollable = document.body.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div
        className="fixed top-0 left-0 h-[3px] z-[9998] bg-gradient-to-r from-[#FF3D00] to-[#FFD700]"
        style={{ width: `${progress * 100}%`, transition: 'width 0.1s' }}
      />
      <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center
        justify-between px-4 sm:px-12 py-4 transition-all duration-300
        ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-[#FF3D00]/20 shadow-lg' : 'bg-transparent'}`}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-['Bebas_Neue'] text-2xl sm:text-3xl leading-none bg-gradient-to-r
              from-[#FF3D00] to-[#FF5500] bg-clip-text text-transparent">
              HOTWHEEL
            </span>
            <div className="w-[2px] h-6 sm:h-7 bg-[#FFD700]/40" />
            <span className="font-['Bebas_Neue'] text-xl sm:text-2xl tracking-[4px] sm:tracking-[6px] bg-gradient-to-r
              from-[#FFD700] to-[#FF3D00] bg-clip-text text-transparent">
              VAULT
            </span>
          </Link>
        </div>

        <ul className="hidden md:flex gap-3 list-none">
          {[
            { label: 'Collection', href: '#products' },
            { label: 'Treasure Hunt', href: '#products' },
            { label: 'Track Sets', href: '#track-sets' },
            { label: 'Vintage', href: '#products' },
          ].map(item => (
            <li key={item.label}>
              <a href={item.href}
                className="text-gray-800 text-sm tracking-[2px] uppercase font-bold
                  font-['Barlow_Condensed'] px-5 py-3 bg-white/80 backdrop-blur-sm
                  border border-white/40 hover:bg-white hover:text-[#FF3D00]
                  hover:border-[#FF3D00]/30 transition-all shadow-sm">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleCart}
            className="relative bg-[#FF3D00] text-white px-4 sm:px-5 py-2 text-sm
              font-bold tracking-widest uppercase font-['Barlow_Condensed']
              hover:bg-[#FF5500] transition-all hover:scale-105 active:scale-95"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
          >
            🛒 CART
            <AnimatePresence>
              {totalItems() > 0 && (
                <motion.span
                  key={totalItems()}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-[#FFD700] text-black
                    text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {totalItems()}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>
    </>
  )
}
