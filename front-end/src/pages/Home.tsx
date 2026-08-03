import { useEffect, useState } from 'react'
import Bg2Image from '../assets/bg2.jpeg'
import CategoryCard from '../components/CategoryCard'
import ProductCards from '../components/ProductsCard'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Product } from '../types'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/products?limit=4')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unable to load products')
        }
        return res.json()
      })
      .then((data: Product[]) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="w-full min-h-screen bg-slate-50">
        <section className="relative w-full h-[450px] overflow-hidden bg-slate-900">
          <img
            src={Bg2Image}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white z-10">
            <h1 className="text-4xl font-bold mb-4">Your Beautiful Heading</h1>
            <p className="text-lg text-slate-200 max-w-md mb-6">
              Describe your product or feature here. This text floats completely on top of the image layout safely.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition">
                Primary Action
              </button>
              <button className="bg-white/25 hover:bg-white/35 backdrop-blur-sm text-white font-medium py-2.5 px-6 rounded-xl transition">
                Secondary Button
              </button>
            </div>
          </div>
        </section>

        <div className="p-4 m-5 flex-col w-full">
          <h2 className="font-bold mb-5">Browse by Category</h2>
          <div className="flex flex-row gap-5">
            <CategoryCard title="smartphone" />
            <CategoryCard title="laptop" />
            <CategoryCard title="audio" />
            <CategoryCard title="watch" />
            <CategoryCard title="accessory" />
            <CategoryCard title="gaming" />
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold">Featured Products</h2>
                <p className="text-gray-500">Explore our most demanding gear designed for professionals</p>
              </div>
              <Link to="/shop" className="flex items-center gap-2 mt-5 mr-40 cursor-pointer hover:opacity-80 transition text-slate-900 no-underline">
                <span className="font-medium">View All</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap justify-start justify-evenly gap-5">
              {loading ? (
                <div className="text-gray-600">Loading featured products...</div>
              ) : error ? (
                <div className="text-red-600">{error}</div>
              ) : (
                products.map((product) => <ProductCards key={product.id} {...product} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
