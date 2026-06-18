'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useCountUp } from '@/hooks/useCountUp'

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
      <div className="font-['Bebas_Neue'] text-4xl bg-gradient-to-r from-[#FF3D00] 
        to-[#FFD700] bg-clip-text text-transparent leading-none">
        {display}
      </div>
      <div className="text-[11px] tracking-[2px] uppercase text-gray-400 mt-1">{label}</div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden px-12 pt-20">
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
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF3D00]/25 rounded-full blur-[180px] animate-pulse-glow" />
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-[#FFD700]/20 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#FF0066]/15 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-[#FF3D00]/15 via-[#FFD700]/10 via-[#FF0066]/5 to-transparent rounded-full blur-[250px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-[580px] bg-white/70 backdrop-blur-md border border-white/40 rounded-sm p-8 shadow-xl shadow-black/5">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-9 h-[2px] bg-[#FFD700]" />
          <span className="text-[#FFD700] text-xs tracking-[5px] uppercase font-['Barlow_Condensed'] font-semibold">
            Premium Die-Cast · Since 1968
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-['Bebas_Neue'] leading-[0.9] mb-6"
          style={{ fontSize: 'clamp(72px, 9vw, 120px)' }}
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
          className="text-[#1A1A1A] font-semibold text-[15px] leading-[1.75] mb-9 max-w-[420px]"
        >
          India's premier Hot Wheels destination. Authentic die-cast models,
          limited editions, and track sets — delivered to your door in 2 days.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4 items-center"
        >
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#FF3D00] text-white px-10 py-4 font-['Bebas_Neue'] text-lg 
              tracking-[3px] hover:bg-[#FF5500] transition-all hover:-translate-y-1 active:scale-95"
            style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            SHOP NOW
          </button>
          <button className="text-gray-500 border border-gray-300 px-10 py-4 
            font-['Bebas_Neue'] text-lg tracking-[3px] hover:border-[#FF3D00] 
            hover:text-[#FF3D00] transition-all">
            NEW ARRIVALS →
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex gap-12 mt-14 pt-9 border-t border-gray-200"
        >
          <AnimatedStat target={4000} suffix="K+" label="Models" />
          <AnimatedStat target={98} suffix="%" label="Satisfaction" />
          <AnimatedStat target={50} suffix="+" label="Countries" />
          <div>
            <div className="font-['Bebas_Neue'] text-4xl bg-gradient-to-r from-[#FF3D00] 
              to-[#FFD700] bg-clip-text text-transparent leading-none">
              2-Day
            </div>
            <div className="text-[11px] tracking-[2px] uppercase text-gray-400 mt-1">
              Delivery
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  )
}
