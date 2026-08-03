import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AppContext'
import type { Product } from '../types'

const statusOptions = ['Active', 'Inactive', 'Out of Stock']

export default function AdminProducts() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product? This action cannot be undone.')) return
    setError(null)
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Unable to delete product.')
      return
    }
    setProducts((current) => current.filter((product) => product.id !== id))
  }

  useEffect(() => {
    if (!user) return

    const loadProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/products?includeInactive=true')
        if (!response.ok) throw new Error('Unable to load products.')
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load products.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [user])

  useEffect(() => {
    const lowerSearch = search.trim().toLowerCase()
    setFilteredProducts(
      products.filter((product) => {
        const matchesSearch = lowerSearch
          ? [product.name, product.category, product.description, product.overview]
              .join(' ')
              .toLowerCase()
              .includes(lowerSearch)
          : true
        const matchesCategory = category ? product.category.toLowerCase() === category.toLowerCase() : true
        const matchesStatus = status ? product.status === status : true
        return matchesSearch && matchesCategory && matchesStatus
      }),
    )
  }, [search, category, status, products])

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))), [products])

  if (!user?.isAdmin) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-slate-700">
        <p className="text-xl font-semibold">Admin access required</p>
        <p className="mt-2 text-sm text-slate-500">You must be signed in as an administrator to view this page.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Loading products...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Product management</p>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        </div>
        <button
          onClick={() => navigate('/admin/products/create')}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Add product
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none"
        >
          <option value="">All statuses</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{product.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{product.category}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">${product.price.toFixed(2)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{product.qty}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{product.status}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                    className="mr-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-xl bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
