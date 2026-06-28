'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden px-4 sm:px-8 lg:px-12 pt-20">
      <Image
        src="/images/hotwheel.jpg"
        alt=""
        fill
        className="object-cover object-right"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF3D00]/30 via-[#FFD700]/15 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/20 via-transparent to-transparent" />

      {/* Glow orbs — smaller on mobile */}
      <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]
        bg-[#FF3D00]/20 rounded-full blur-[100px] sm:blur-[180px] animate-pulse-glow" />
      <div className="absolute bottom-0 left-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]
        bg-[#FFD700]/15 rounded-full blur-[80px] sm:blur-[150px] animate-pulse-glow"
        style={{ animationDelay: '2s' }} />

      {/* Hero card — full width on mobile */}
      <div className="relative z-10 w-full max-w-[580px] bg-white/75 backdrop-blur-md
        border border-white/40 rounded-sm p-5 sm:p-8 shadow-xl shadow-black/5">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-6 sm:w-9 h-[2px] bg-[#FFD700]" />
          <span className="text-[#FFD700] text-[10px] sm:text-xs tracking-[3px] sm:tracking-[5px]
            uppercase font-['Barlow_Condensed'] font-semibold">
            Premium Die-Cast · Since 1968
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-['Bebas_Neue'] leading-[0.9] mb-5"
          style={{ fontSize: 'clamp(56px, 14vw, 120px)' }}
        >
          <span className="block bg-gradient-to-r from-[#1A1A1A] via-[#FF3D00] to-[#1A1A1A]
            bg-clip-text text-transparent">BUILT FOR</span>
          <span className="block bg-gradient-to-r from-[#FF3D00] to-[#FFD700]
            bg-clip-text text-transparent">SPEED</span>
          <span className="block text-[#1A1A1A] font-bold"
            style={{ fontSize: 'clamp(16px, 4vw, 32px)', letterSpacing: '0.3em' }}>
            SINCE 1968
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-[#1A1A1A] font-semibold text-sm sm:text-[15px]
            leading-[1.75] mb-6 sm:mb-9"
        >
          India's premier Hot Wheels destination. Authentic die-cast models,
          limited editions, and track sets — delivered in 2 days.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
        >
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#FF3D00] text-white px-8 py-4 font-['Bebas_Neue'] text-lg
              tracking-[3px] hover:bg-[#FF5500] transition-all active:scale-95 text-center"
            style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            SHOP NOW
          </button>
          <button
            className="text-gray-500 border border-gray-300 px-8 py-4
              font-['Bebas_Neue'] text-lg tracking-[3px] hover:border-[#FF3D00]
              hover:text-[#FF3D00] transition-all text-center"
          >
            NEW ARRIVALS →
          </button>
        </motion.div>

        {/* Stats — 2 column grid on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 sm:mt-14
            pt-6 sm:pt-9 border-t border-gray-200"
        >
          {[
            { num: '4K+', label: 'Models' },
            { num: '98%', label: 'Satisfaction' },
            { num: '50+', label: 'Countries' },
            { num: '2-Day', label: 'Delivery' },
          ].map(s => (
            <div key={s.label}>
              <div className="font-['Bebas_Neue'] text-3xl sm:text-4xl bg-gradient-to-r
                from-[#FF3D00] to-[#FFD700] bg-clip-text text-transparent leading-none">
                {s.num}
              </div>
              <div className="text-[10px] tracking-[2px] uppercase text-gray-400 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
