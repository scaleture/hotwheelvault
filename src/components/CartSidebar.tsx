'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 z-[200] backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[400px] bg-white 
              border-r border-[#FF3D00]/20 z-[201] flex flex-col shadow-[10px_0_40px_rgba(255,61,0,0.1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 
              border-b border-[#FF3D00]/10 bg-gradient-to-r from-[#FFF8F5] to-white">
              <h2 className="font-['Bebas_Neue'] text-2xl tracking-widest">
                YOUR <span className="text-[#FF3D00]">CART</span> ({items.length})
              </h2>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-[#1A1A1A] text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <span className="text-6xl">🏎️</span>
                    <p className="text-gray-400 text-sm tracking-widest uppercase 
                    font-['Barlow_Condensed']">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 bg-[#F5F5F0] p-3 border border-gray-200"
                  >
                    <div className="relative w-16 h-16 bg-[#F0EFEB] flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#1A1A1A] text-sm font-bold font-['Barlow_Condensed'] 
                        truncate">
                        {item.name}
                      </div>
                      <div className="text-[#FF3D00] font-['Bebas_Neue'] text-lg">
                        ₹{item.price}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-6 h-6 bg-gray-200 text-[#1A1A1A] text-xs 
                            hover:bg-gray-300 transition-colors flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="text-[#1A1A1A] text-sm font-bold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-6 h-6 bg-gray-200 text-[#1A1A1A] text-xs 
                            hover:bg-gray-300 transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-gray-400 hover:text-[#FF3D00] 
                            text-xs transition-colors"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#FF3D00]/10 bg-gradient-to-r from-[#FFF8F5] to-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 text-sm tracking-widest uppercase 
                    font-['Barlow_Condensed']">
                    Total
                  </span>
                  <span className="font-['Bebas_Neue'] text-3xl text-[#FF3D00]">
                    ₹{totalPrice().toLocaleString('en-IN')}
                  </span>
                </div>
                <button className="w-full bg-[#FF3D00] text-white py-4 
                  font-['Bebas_Neue'] text-xl tracking-[3px] hover:bg-[#FF5500] 
                  transition-all hover:-translate-y-1 active:scale-95">
                  CHECKOUT NOW
                </button>
                <p className="text-center text-gray-400 text-xs mt-3 tracking-widest">
                  FREE SHIPPING ON THIS ORDER · COD AVAILABLE
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
