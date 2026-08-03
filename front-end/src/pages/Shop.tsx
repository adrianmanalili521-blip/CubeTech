import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FilterCard from '../components/FilterCard'
import type { Product } from '../types.ts'

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unable to securely sync inventory rows from database.')
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = searchTerm.trim().toLowerCase()
      const matchesCategory = selectedCategory ? product.category.toLowerCase() === selectedCategory.toLowerCase() : true
      const matchesSearch = searchValue
        ? [product.name, product.category, product.description, product.overview]
            .join(' ')
            .toLowerCase()
            .includes(searchValue)
        : true

      return matchesCategory && matchesSearch
    })
  }, [products, searchTerm, selectedCategory])

  return (
    <div className="max-w-7xl mt-2 mx-auto px-4 py-10 sm:px-6 lg:px-8 min-h-screen bg-white">
      <div className="border-b border-gray-100 pb-5 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">All Products</h2>
        <p className="mt-2 text-sm text-gray-500">Explore our complete collection of premium tech and lifestyle gear.</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row items-start">
        <div className="w-full lg:w-72 lg:sticky lg:top-6 flex-shrink-0">
          <FilterCard
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <div className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="border border-gray-200/60 rounded-2xl p-4 animate-pulse">
                  <div className="bg-gray-100 aspect-square rounded-xl w-full mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-6 bg-gray-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50/60 border border-red-100 p-8 text-center max-w-xl mx-auto mt-10 shadow-sm">
              <span className="text-2xl">⚠️</span>
              <h3 className="mt-3 text-md font-semibold text-red-800">Connection Interrupted</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center max-w-xl mx-auto mt-10">
              <p className="text-gray-400 text-sm font-medium">No products match your current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isAvailable = product.qty > 0
                return (
                  <div key={product.id} className="group flex flex-col bg-white border border-gray-200/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="bg-gray-50/70 aspect-square w-full p-6 flex items-center justify-center relative overflow-hidden border-b border-gray-100">
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-gray-100">
                          {product.category}
                        </span>
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border ${
                          isAvailable ? 'bg-green-50/95 text-green-700 border-green-200/60' : 'bg-red-50/95 text-red-700 border-red-200/60'
                        }`}>
                          {isAvailable && (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                            </span>
                          )}
                          {isAvailable ? `${product.qty} Left` : 'Sold Out'}
                        </span>
                      </div>
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out" />
                    </div>
                    <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-black transition-colors text-base line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                      <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between gap-4">
                        <span className="text-lg font-black text-gray-900">
                          ${product.price.toLocaleString()}
                        </span>
                        <Link to={`/product/${product.id}`} className="text-xs font-semibold px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors shadow-sm">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
