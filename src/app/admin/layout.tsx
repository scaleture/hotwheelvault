import LogoutButton from '@/components/admin/LogoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-[#1A1A1A] px-8 py-4 flex items-center justify-between border-b border-white/10">
        <h1 className="font-['Bebas_Neue'] text-xl tracking-[3px]">
          <span className="bg-gradient-to-r from-[#FF3D00] to-[#FFD700] bg-clip-text text-transparent">
            HOTWHEEL VAULT — ADMIN
          </span>
        </h1>
        <LogoutButton />
      </header>
      <main className="bg-[#F5F5F0] min-h-screen p-8">
        {children}
      </main>
    </>
  )
}
