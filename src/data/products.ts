export interface Product {
  id: string
  name: string
  series: string
  scale: string
  price: number
  oldPrice?: number
  badge?: 'HOT' | 'NEW' | 'LIMITED' | 'SUPER TH'
  section: 'featured' | 'track-sets'
  sortOrder: number
  image: string
  description?: string
  highlights?: string[]
  images?: string[]
  specs?: Record<string, string>
  stock?: number
  isPublished?: boolean
}
