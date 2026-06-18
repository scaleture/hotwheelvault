import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-['Bebas_Neue'] text-4xl text-[#1A1A1A] mb-8">
        ADD <span className="text-[#FF3D00]">PRODUCT</span>
      </h1>
      <ProductForm />
    </div>
  )
}
