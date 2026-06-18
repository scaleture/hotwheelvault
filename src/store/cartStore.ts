'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  qty: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'qty'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  toggleCart: () => void
  closeCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id)
        if (existing) {
          return { 
            items: state.items.map(i => 
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            ) 
          }
        }
        return { items: [...state.items, { ...item, qty: 1 }] }
      }),
      removeItem: (id) => set(state => ({ 
        items: state.items.filter(i => i.id !== id) 
      })),
      updateQty: (id, qty) => set(state => ({
        items: qty <= 0 
          ? state.items.filter(i => i.id !== id)
          : state.items.map(i => i.id === id ? { ...i, qty } : i)
      })),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: 'hotwheels-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)
