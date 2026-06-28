import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductGallery from '@/components/ProductGallery'
import AddToCartButton from '@/components/AddToCartButton'
import ShareButton from '@/components/ShareButton'
import { getProductById, getProducts } from '@/lib/products'
import type { Product } from '@/data/products'

const BADGE_STYLES: Record<string, string> = {
  'HOT':      'bg-[#FF3D00] text-white',
  'NEW':      'bg-[#FFD700] text-black',
  'LIMITED':  'border border-white/40 text-white bg-black/50',
  'SUPER TH': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black',
}

const BADGE_LABELS: Record<string, string> = {
  'HOT': '🔥 HOT',
  'NEW': 'NEW',
  'LIMITED': 'LIMITED',
  'SUPER TH': '⭐ SUPER TH',
}

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductById(params.id)
  if (!product) return { title: 'Product Not Found — HotWheel Vault' }

  const imageUrl = product.images?.[0] ?? product.image

  return {
    title: `${product.name} — HotWheel Vault`,
    description: product.description?.slice(0, 160) ?? `${product.name} | ${product.series} | ${product.scale}`,
    openGraph: {
      title: product.name,
      description: product.description ?? `${product.series} · ${product.scale} · ₹${product.price}`,
      images: [{ url: imageUrl, width: 800, height: 600, alt: product.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description ?? `${product.series} · ₹${product.price}`,
      images: [imageUrl],
    },
  }
}

function ProductCardInline({ product }: { product: Product }) {
  const badgeStyles: Record<string, string> = {
    'HOT':      'bg-[#FF3D00] text-white',
    'NEW':      'bg-[#FFD700] text-black',
    'LIMITED':  'border border-white/40 text-white bg-black/50',
    'SUPER TH': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black',
  }
  const badgeLabels: Record<string, string> = {
    'HOT': '🔥 HOT',
    'NEW': 'NEW',
    'LIMITED': 'LIMITED',
    'SUPER TH': '⭐ SUPER TH',
  }
  return (
    <Link href={`/products/${product.id}`} className="block bg-white border border-gray-200 
      hover:border-[#FF3D00]/50 transition-all duration-300 group overflow-hidden">
      {product.badge && (
        <span className={`absolute top-3 left-3 z-10 text-[10px] font-bold 
          tracking-widest uppercase px-2 py-1 font-['Barlow_Condensed'] 
          ${badgeStyles[product.badge]}`}>
          {badgeLabels[product.badge]}
        </span>
      )}
      <div className="h-[140px] sm:h-[200px] relative bg-gradient-to-br from-[#FFF5F0] to-[#FFFDF0]">
        <div className="w-full h-full relative">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain p-3 sm:p-4 w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="text-[10px] tracking-[2px] uppercase text-[#FF3D00] font-semibold mb-1 font-['Barlow_Condensed']">
          {product.series}
        </div>
        <div className="text-sm sm:text-base font-bold text-[#1A1A1A] font-['Barlow_Condensed'] mb-1 truncate">
          {product.name}
        </div>
        <div className="font-['Bebas_Neue'] text-lg sm:text-xl text-[#1A1A1A]">
          ₹{product.price}
        </div>
      </div>
    </Link>
  )
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductById(params.id)

  if (!product || !product.isPublished) {
    notFound()
  }

  const relatedProducts = (await getProducts())
    .filter(p => p.section === product.section && p.id !== product.id)
    .slice(0, 4)

  const images = product.images ?? []
  const specs = product.specs as Record<string, string> | undefined
  const stock = product.stock ?? 0

  return (
    <main className="bg-[#FAFAF8] min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-16 pt-28 pb-16">
        <nav className="text-[10px] sm:text-xs tracking-[2px] uppercase font-['Barlow_Condensed'] text-gray-400 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#FF3D00] transition-colors">HOME</Link>
          <span className="mx-2">/</span>
          <Link href="/#products" className="hover:text-[#FF3D00] transition-colors">PRODUCTS</Link>
          <span className="mx-2">/</span>
          <span className="text-[#1A1A1A] truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-16">
          <ProductGallery images={images} heroFallback={product.image} alt={product.name} />

          <div className="flex flex-col gap-5 sm:gap-6">
            {product.badge && (
              <span className={`inline-block self-start text-[10px] font-bold 
                tracking-widest uppercase px-2.5 py-1 font-['Barlow_Condensed'] 
                ${BADGE_STYLES[product.badge]}`}>
                {BADGE_LABELS[product.badge]}
              </span>
            )}

            <div>
              <div className="text-xs tracking-[2px] uppercase text-[#FF3D00] font-semibold mb-1 font-['Barlow_Condensed']">
                {product.series}
              </div>
              <h1 className="font-['Bebas_Neue'] text-4xl sm:text-6xl text-[#1A1A1A] leading-none">
                {product.name}
              </h1>
              <div className="text-sm text-gray-400 mt-2">{product.scale}</div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-[#1A1A1A]">₹{product.price}</span>
              {product.oldPrice && (
                <>
                  <span className="text-base sm:text-lg text-gray-400 line-through">₹{product.oldPrice}</span>
                  <span className="bg-[#FFD700] text-black text-xs font-bold px-2 py-1 font-['Barlow_Condensed'] uppercase tracking-wider">
                    SAVE ₹{product.oldPrice - product.price}
                  </span>
                </>
              )}
            </div>

            <div>
              {stock === 0 ? (
                <span className="text-sm font-bold text-red-600 tracking-wider uppercase font-['Barlow_Condensed']">
                  OUT OF STOCK
                </span>
              ) : stock <= 5 ? (
                <span className="text-sm font-bold text-orange-600 tracking-wider uppercase font-['Barlow_Condensed']">
                  ⚠️ Only {stock} left!
                </span>
              ) : (
                <span className="text-sm text-green-700 tracking-wider uppercase font-['Barlow_Condensed']">
                  ✓ In Stock ({stock} available)
                </span>
              )}
            </div>

            {stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="flex-1">
                  <AddToCartButton product={product} />
                </div>
                <ShareButton productName={product.name} productId={product.id} />
              </div>
            )}

            {product.highlights && product.highlights.length > 0 && (
              <div>
                <h3 className="font-['Bebas_Neue'] text-lg text-[#1A1A1A] mb-2">HIGHLIGHTS</h3>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700 font-['Barlow']">
                      <span className="text-[#FF3D00] flex-shrink-0">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.description && (
              <div>
                <h3 className="font-['Bebas_Neue'] text-lg text-[#1A1A1A] mb-2">ABOUT THIS MODEL</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-['Barlow'] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {specs && Object.keys(specs).length > 0 && (
              <div>
                <h3 className="font-['Bebas_Neue'] text-lg text-[#1A1A1A] mb-2">SPECIFICATIONS</h3>
                <div className="border border-gray-200 divide-y divide-gray-100">
                  {Object.entries(specs).map(([key, val], i) => (
                    <div key={i} className={`flex px-4 py-2.5 ${i % 2 === 0 ? 'bg-[#FAFAF8]' : 'bg-white'}`}>
                      <span className="w-1/2 text-[11px] sm:text-xs uppercase tracking-[1px] text-gray-500 font-['Barlow_Condensed'] font-bold">
                        {key}
                      </span>
                      <span className="w-1/2 text-xs sm:text-sm text-[#1A1A1A] font-['Barlow']">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-['Bebas_Neue'] text-2xl sm:text-3xl text-[#1A1A1A] mb-6">
              YOU MAY ALSO <span className="text-[#FF3D00]">LIKE</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map(rp => (
                <ProductCardInline key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  )
}
