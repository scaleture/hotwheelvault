'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import Toast from './Toast'
import type { Product } from '@/data/products'

interface Props {
  product: Product
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCartStore()
  const [showToast, setShowToast] = useState(false)

  function handleClick() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="w-full bg-[#FF3D00] text-white py-4 px-8 font-['Bebas_Neue'] 
          text-2xl tracking-[3px] hover:bg-[#FF5500] transition-all 
          hover:-translate-y-0.5 active:scale-[0.98]"
        style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
      >
        ADD TO CART — ₹{product.price}
      </button>
      <Toast message="🏎️ Added to cart!" visible={showToast} />
    </>
  )
}
