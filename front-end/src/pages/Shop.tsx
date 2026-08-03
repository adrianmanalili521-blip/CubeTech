import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FilterCard from '../components/FilterCard'
import ProductsCard from '../components/ProductsCard'
import type { Product } from '../types'

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unable to load products')
        }
        return res.json()
      })
      .then((data: Product[]) => {
        setProducts(data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="m-5">
      <h2 className="text-2xl font-semibold">All Products</h2>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <FilterCard />

        <div className="flex-1">
          {loading ? (
            <div className="text-gray-600">Loading products...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="flex flex-wrap gap-5">
              {products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="block">
                  <ProductsCard {...product} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
