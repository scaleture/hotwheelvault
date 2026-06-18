'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  visible: boolean
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-[300] bg-[#1A1A1A] text-white px-5 py-3 text-sm 
            font-['Barlow_Condensed'] tracking-widest border-l-4 border-[#FF3D00] shadow-xl"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}