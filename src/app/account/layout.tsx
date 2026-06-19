'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useHasMounted } from '@/hooks/useHasMounted'

const SIDEBAR_LINKS = [
  { label: 'My Orders', href: '/account/orders' },
  { label: 'My Profile', href: '/account' },
  { label: 'My Addresses', href: '/account/addresses' },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const user = useAuthStore(s => s.user)
  const router = useRouter()
  const hasMounted = useHasMounted()

  if (!hasMounted) return null

  if (!user) {
    router.replace('/')
    return null
  }

  const userInitial = user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-24">
        <h1 className="font-['Bebas_Neue'] text-4xl text-[#1A1A1A] mb-8">
          MY <span className="text-[#FF3D00]">ACCOUNT</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-56 flex-shrink-0">
            <div className="bg-white border border-gray-200 p-6 text-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#FF3D00] text-white text-xl font-bold flex items-center justify-center mx-auto mb-3">
                {userInitial}
              </div>
              <p className="text-sm font-bold text-[#1A1A1A] font-['Barlow_Condensed']">
                {user.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-400 mt-1">{user.email}</p>
            </div>
            <nav className="bg-white border border-gray-200 overflow-hidden">
              {SIDEBAR_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-5 py-3.5 text-sm font-['Barlow_Condensed'] uppercase tracking-wider
                    border-b border-gray-100 last:border-b-0 transition-colors
                    ${pathname === link.href
                      ? 'bg-[#FF3D00]/5 text-[#FF3D00] font-bold border-l-2 border-l-[#FF3D00]'
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
