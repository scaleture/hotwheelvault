import ProductCard from './ProductCard'
import type { Product } from '@/data/products'

interface ProductGridProps {
  products: Product[]
  onQuickView?: (product: Product) => void
}

export default function ProductGrid({ products, onQuickView }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {products.map(product => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  )
}
