export const dynamic = 'force-dynamic'
export const revalidate = 0
import dynamicImport from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MarqueeTicker from '@/components/MarqueeTicker'
import CategoryStrip from '@/components/CategoryStrip'
import ProductGrid from '@/components/ProductGrid'
import PromoBanner from '@/components/PromoBanner'
import TrustBadges from '@/components/TrustBadges'
import Footer from '@/components/Footer'
import { getProducts } from '@/lib/products'
import ErrorBoundary from '@/components/ErrorBoundary'

const CarShowcase3D = dynamicImport(
  () => import('@/components/CarShowcase3D'),
  { ssr: false }
)

export default async function Home() {
  console.log('Homepage rendering at:', new Date().toISOString())
  const products = await getProducts()
  const featured = products.filter(p => p.section === 'featured')
  const trackSets = products.filter(p => p.section === 'track-sets')

  return (
    <main className="bg-[#E8F5E9] min-h-screen">
      <Navbar />
      <Hero />
      <MarqueeTicker />
      <CategoryStrip />
      
      <section id="products" className="px-12 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8F5E9] via-white to-[#F1F8E9] animate-gradient" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A5D6A7]/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C8E6C9]/20 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-['Bebas_Neue'] text-5xl text-[#1A1A1A]">
                FEATURED <span className="text-[#FF3D00]">DROPS</span>
              </h2>
              <p className="text-[11px] tracking-[3px] uppercase text-gray-400 mt-2">
                Hand-picked by our collectors
              </p>
            </div>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="px-12 py-20 relative overflow-hidden bg-gradient-to-br from-[#A5D6A7]/15 via-[#E8F5E9] to-[#C8E6C9]/15">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#81C784]/20 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="relative z-10">
          <h2 className="font-['Bebas_Neue'] text-5xl text-[#1A1A1A] mb-2">
            3D <span className="text-[#FF3D00]">SHOWCASE</span>
          </h2>
          <p className="text-gray-500 text-sm mb-8 tracking-widest uppercase">
            Drag to rotate · Scroll to zoom
          </p>
          <ErrorBoundary>
            <CarShowcase3D />
          </ErrorBoundary>
        </div>
      </section>

      <PromoBanner />

      <section id="track-sets" className="px-12 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F1F8E9] via-white to-[#E8F5E9] animate-gradient" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#C8E6C9]/20 rounded-full blur-[80px] animate-pulse-glow" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#A5D6A7]/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-['Bebas_Neue'] text-5xl text-[#1A1A1A]">
                TRACK <span className="text-[#FF3D00]">SETS</span>
              </h2>
              <p className="text-[11px] tracking-[3px] uppercase text-gray-400 mt-2">
                Go full throttle
              </p>
            </div>
          </div>
          <ProductGrid products={trackSets} />
        </div>
      </section>

      <TrustBadges />
      <Footer />
    </main>
  )
}
