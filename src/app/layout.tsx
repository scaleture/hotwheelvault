import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
