'use client'
import { useState, useEffect, useRef } from 'react'

export function useCountUp(target: number, duration: number): number {
  const [count, setCount] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    startTime.current = null
    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate)
      }
    }
    rafId.current = requestAnimationFrame(animate)
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [target, duration])

  return count
}