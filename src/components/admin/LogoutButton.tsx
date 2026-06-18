'use client'
import { useRouter, usePathname } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === '/admin/login') return null

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="uppercase tracking-widest text-xs font-['Barlow_Condensed'] font-bold
        text-white/60 hover:text-[#FF3D00] transition-colors"
    >
      Logout
    </button>
  )
}
