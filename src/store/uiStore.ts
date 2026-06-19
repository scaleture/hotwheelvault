import { create } from 'zustand'

interface UIStore {
  authModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  authModalOpen: false,
  openAuthModal: () => set({ authModalOpen: true }),
  closeAuthModal: () => set({ authModalOpen: false }),
}))
