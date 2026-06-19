import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import AuthModal from '@/components/AuthModal'

export const metadata: Metadata = {
  title: 'HotWheels Vault — Premium Die-Cast Collection',
  description: 'India\'s premier Hot Wheels store. Authentic die-cast models, limited editions, track sets.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  )
}
