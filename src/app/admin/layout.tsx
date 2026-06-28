import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-[#1A1A1A] px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <h1 className="font-['Bebas_Neue'] text-base sm:text-xl tracking-[3px] whitespace-nowrap">
            <span className="bg-gradient-to-r from-[#FF3D00] to-[#FFD700] bg-clip-text text-transparent">
              ADMIN
            </span>
          </h1>
          <nav className="flex gap-3 sm:gap-4 text-[10px] sm:text-xs tracking-[2px] uppercase font-['Barlow_Condensed'] font-bold">
            <Link href="/admin" className="text-white/60 hover:text-white transition-colors">Products</Link>
            <Link href="/admin/orders" className="text-white/60 hover:text-white transition-colors">Orders</Link>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="bg-[#F5F5F0] min-h-screen p-4 sm:p-8">
        {children}
      </main>
    </>
  )
}
