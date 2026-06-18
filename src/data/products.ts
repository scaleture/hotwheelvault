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
}
