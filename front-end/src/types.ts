export type Product = {
  id: number
  name: string
  category: string
  description: string
  price: number
  qty: number
  image: string
  overview: string
  status: string
}

export type CartItem = {
  product: Product
  quantity: number
}

export type User = {
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  paymentMethod?: string
  isAdmin?: boolean
}
