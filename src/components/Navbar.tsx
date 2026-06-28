'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

const NAV_LINKS = [
  { label: 'Collection', href: '#products' },
  { label: 'Treasure Hunt', href: '#products' },
  { label: 'Track Sets', href: '#track-sets' },
  { label: 'Vintage', href: '#products' },
]

export default function Navbar() {
  const { totalItems, toggleCart } = useCartStore()
  const { user } = useAuthStore()
  const { openAuthModal } = useUIStore()
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hasMounted, setHasMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setHasMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const scrollable = document.body.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
      setMenuOpen(false)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[9998] bg-gradient-to-r from-[#FF3D00] to-[#FFD700]"
        style={{ width: `${progress * 100}%`, transition: 'width 0.1s' }}
      />

      {/* Main navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300
        ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-[#FF3D00]/20 shadow-lg' : 'bg-transparent'}`}
      >
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 sm:py-4">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="font-['Bebas_Neue'] text-2xl sm:text-3xl leading-none bg-gradient-to-r
              from-[#FF3D00] to-[#FF5500] bg-clip-text text-transparent">
              HOTWHEEL
            </span>
            <div className="hidden sm:block w-[2px] h-6 bg-[#FFD700]/40" />
            <span className="hidden sm:block font-['Bebas_Neue'] text-xl tracking-[4px] bg-gradient-to-r
              from-[#FFD700] to-[#FF3D00] bg-clip-text text-transparent">
              VAULT
            </span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex gap-2 list-none">
            {NAV_LINKS.map(item => (
              <li key={item.label}>
                <a href={item.href}
                  className="text-gray-800 text-xs tracking-[2px] uppercase font-bold
                    font-['Barlow_Condensed'] px-4 py-2 bg-white/80 backdrop-blur-sm
                    border border-white/40 hover:bg-white hover:text-[#FF3D00]
                    hover:border-[#FF3D00]/30 transition-all shadow-sm block">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Desktop SIGN IN */}
            {hasMounted && !user && (
              <button
                onClick={openAuthModal}
                className="hidden lg:block text-gray-800 text-xs tracking-[2px] uppercase
                  font-bold font-['Barlow_Condensed'] px-4 py-2 bg-white/80 backdrop-blur-sm
                  border border-white/40 hover:bg-white hover:text-[#FF3D00]
                  hover:border-[#FF3D00]/30 transition-all shadow-sm"
              >
                SIGN IN
              </button>
            )}

            {/* Desktop user avatar */}
            {hasMounted && user && (
              <a href="/account"
                className="hidden lg:flex w-8 h-8 rounded-full bg-[#FF3D00] items-center
                  justify-center text-white text-sm font-bold flex-shrink-0">
                {user.user_metadata?.full_name?.[0] ?? user.email?.[0]?.toUpperCase() ?? 'U'}
              </a>
            )}

            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative bg-[#FF3D00] text-white px-3 sm:px-5 py-2 text-xs sm:text-sm
                font-bold tracking-widest uppercase font-['Barlow_Condensed']
                hover:bg-[#FF5500] transition-all active:scale-95 flex items-center gap-1"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
            >
              <span>🛒</span>
              <span className="hidden sm:inline">CART</span>
              {hasMounted && totalItems() > 0 && (
                <motion.span
                  key={totalItems()}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-[#FFD700] text-black
                    text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {totalItems()}
                </motion.span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="lg:hidden flex flex-col justify-center items-center
                w-10 h-10 gap-[5px] flex-shrink-0"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300
                origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300
                ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300
                origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden bg-white/98 backdrop-blur-md
                border-t border-gray-100"
            >
              <div className="flex flex-col px-4 py-3 gap-1">
                {NAV_LINKS.map(item => (
                  <a key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-800 text-sm tracking-[2px] uppercase font-bold
                      font-['Barlow_Condensed'] px-4 py-3 border border-gray-100
                      hover:text-[#FF3D00] hover:border-[#FF3D00]/20 transition-all"
                  >
                    {item.label}
                  </a>
                ))}
                {hasMounted && !user && (
                  <button
                    onClick={() => { openAuthModal(); setMenuOpen(false) }}
                    className="text-left text-[#FF3D00] text-sm tracking-[2px] uppercase
                      font-bold font-['Barlow_Condensed'] px-4 py-3 border
                      border-[#FF3D00]/30 mt-1"
                  >
                    SIGN IN
                  </button>
                )}
                {hasMounted && user && (
                  <a href="/account"
                    className="text-gray-800 text-sm tracking-[2px] uppercase font-bold
                      font-['Barlow_Condensed'] px-4 py-3 border border-gray-100">
                    MY ACCOUNT
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
