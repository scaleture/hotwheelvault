export const dynamic = 'force-dynamic'
export const revalidate = 0
import { getProducts } from '@/lib/products'
import ProductTable from '@/components/admin/ProductTable'

export default async function AdminDashboard() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-['Bebas_Neue'] text-4xl text-[#1A1A1A]">
          PRODUCTS <span className="text-[#FF3D00]">({products.length})</span>
        </h1>
        <a
          href="/admin/products/new"
          className="bg-[#FF3D00] text-white px-6 py-3 text-sm font-bold tracking-[3px]
            uppercase font-['Barlow_Condensed'] hover:bg-[#FF5500] transition-all inline-block"
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
        >
          + ADD PRODUCT
        </a>
      </div>
      <ProductTable products={products} />
    </div>
  )
}
