'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Incorrect password')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-['Bebas_Neue'] text-4xl tracking-[3px]">
            <span className="bg-gradient-to-r from-[#FF3D00] to-[#FFD700] bg-clip-text text-transparent">
              HOTWHEEL VAULT
            </span>
          </h1>
          <p className="font-['Barlow_Condensed'] text-sm tracking-[4px] uppercase text-white/40 mt-2">
            Admin Access
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30
                px-5 py-4 text-sm outline-none focus:border-[#FF3D00] transition-colors"
            />
          </div>
          {error && (
            <p className="text-[#FF3D00] text-xs text-center tracking-wider uppercase font-['Barlow_Condensed']">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-gradient-to-r from-[#FF3D00] to-[#FF5500] text-white py-4
              text-sm font-bold tracking-[3px] uppercase font-['Barlow_Condensed']
              hover:from-[#FF5500] hover:to-[#FF3D00] transition-all duration-300
              disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
          >
            {loading ? 'VERIFYING...' : 'UNLOCK'}
          </button>
        </form>
      </div>
    </div>
  )
}
