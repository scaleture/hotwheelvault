'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCountUp } from '@/hooks/useCountUp'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

function AnimatedStat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const count = useCountUp(target, 1500)
  const display = suffix === 'K+' 
    ? `${Math.floor(count / 1000)}K+`
    : suffix === '%' 
      ? `${count}%`
      : suffix === '+' 
        ? `${count}+`
        : suffix

  return (
    <div>
      <div className="font-['Bebas_Neue'] text-3xl sm:text-4xl bg-gradient-to-r from-[#FF3D00] 
        to-[#FFD700] bg-clip-text text-transparent leading-none">
        {display}
      </div>
      <div className="text-[10px] sm:text-[11px] tracking-[2px] uppercase text-gray-400 mt-1">{label}</div>
    </div>
  )
}

function HeroSignInBlock() {
  const user = useAuthStore(s => s.user)
  const openAuthModal = useUIStore(s => s.openAuthModal)

  if (user) {
    return (
      <Link href="/account/orders"
        className="bg-[#FF3D00] text-white px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold font-['Barlow_Condensed']
          tracking-widest uppercase hover:bg-[#FF5500] transition-all"
        style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
      >
        MY ACCOUNT →
      </Link>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={openAuthModal}
        className="bg-[#FF3D00] text-white px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold font-['Barlow_Condensed']
          tracking-widest uppercase hover:bg-[#FF5500] transition-all"
        style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
      >
        SIGN IN
      </button>
      <button
        onClick={() => { openAuthModal() }}
        className="border-2 border-[#FF3D00] text-[#FF3D00] px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold
          font-['Barlow_Condensed'] tracking-widest uppercase hover:bg-[#FF3D00] hover:text-white transition-all"
      >
        SIGN UP
      </button>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden px-4 sm:px-8 md:px-12 pt-20 sm:pt-24">
      {/* Background image */}
      <Image
        src="/images/hotwheel.jpg"
        alt=""
        fill
        className="object-cover object-right"
        priority
      />
      
      {/* Vibrant color overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF3D00]/30 via-[#FFD700]/15 via-[#FF6B00]/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-1/4 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-[#FF3D00]/25 rounded-full blur-[100px] sm:blur-[180px] animate-pulse-glow" />
      <div className="absolute bottom-0 left-1/4 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-[#FFD700]/20 rounded-full blur-[80px] sm:blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="hidden sm:block absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#FF0066]/15 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-[#FF3D00]/15 via-[#FFD700]/10 via-[#FF0066]/5 to-transparent rounded-full blur-[250px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[580px] mx-0 sm:mx-4 bg-white/70 backdrop-blur-md border border-white/40 rounded-sm p-6 sm:p-8 shadow-xl shadow-black/5">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-4 sm:mb-5"
        >
          <div className="w-7 sm:w-9 h-[2px] bg-[#FFD700]" />
          <span className="text-[#FFD700] text-[10px] sm:text-xs tracking-[5px] uppercase font-['Barlow_Condensed'] font-semibold">
            Premium Die-Cast · Since 1968
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-['Bebas_Neue'] leading-[0.9] mb-5 sm:mb-6"
          style={{ fontSize: 'clamp(52px, 13vw, 120px)' }}
        >
          <span className="block bg-gradient-to-r from-[#1A1A1A] via-[#FF3D00] to-[#1A1A1A] bg-clip-text text-transparent">BUILT FOR</span>
          <span className="block bg-gradient-to-r from-[#FF3D00] to-[#FFD700] bg-clip-text text-transparent">
            SPEED
          </span>
          <span className="block text-[#1A1A1A] font-bold text-[0.5em] tracking-[10px]">SINCE 1968</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-[#1A1A1A] font-semibold text-[13px] sm:text-[15px] leading-[1.75] mb-7 sm:mb-9 max-w-[420px]"
        >
          India's premier Hot Wheels destination. Authentic die-cast models,
          limited editions, and track sets — delivered to your door in 2 days.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
        >
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#FF3D00] text-white px-8 sm:px-10 py-3 sm:py-4 font-['Bebas_Neue'] text-base sm:text-lg 
              tracking-[3px] hover:bg-[#FF5500] transition-all hover:-translate-y-1 active:scale-95 w-full sm:w-auto text-center"
            style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            SHOP NOW
          </button>
          <button className="text-gray-500 border border-gray-300 px-8 sm:px-10 py-3 sm:py-4 
            font-['Bebas_Neue'] text-base sm:text-lg tracking-[3px] hover:border-[#FF3D00] 
            hover:text-[#FF3D00] transition-all w-full sm:w-auto text-center">
            NEW ARRIVALS →
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-2 sm:flex sm:gap-12 gap-4 mt-10 sm:mt-14 pt-7 sm:pt-9 border-t border-gray-200"
        >
          <AnimatedStat target={4000} suffix="K+" label="Models" />
          <AnimatedStat target={98} suffix="%" label="Satisfaction" />
          <AnimatedStat target={50} suffix="+" label="Countries" />
          <div>
            <div className="font-['Bebas_Neue'] text-3xl sm:text-4xl bg-gradient-to-r from-[#FF3D00] 
              to-[#FFD700] bg-clip-text text-transparent leading-none">
              2-Day
            </div>
            <div className="text-[10px] sm:text-[11px] tracking-[2px] uppercase text-gray-400 mt-1">
              Delivery
            </div>
          </div>
        </motion.div>

        {/* Sign In CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
        >
          <p className="text-[11px] sm:text-xs text-gray-500 tracking-wide">
            <span className="text-[#FF3D00] font-bold">★</span> Sign in for faster checkout, order tracking & exclusive drops
          </p>
          <HeroSignInBlock />
        </motion.div>
      </div>

    </section>
  )
}
