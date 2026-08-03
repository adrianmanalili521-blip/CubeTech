import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AppContext'
import type { Product } from '../types'

type Stats = {
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalCustomers: number
  totalSales: number
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [topProducts, setTopProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!user) return

    const load = async () => {
      setLoading(true)
      try {
        const [statsRes, productsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/products?limit=5&includeInactive=true'),
        ])

        if (!statsRes.ok) throw new Error('Unable to load admin stats.')
        if (!productsRes.ok) throw new Error('Unable to load product preview.')

        const statsData = await statsRes.json()
        const productsData = await productsRes.json()

        setStats(statsData)
        setTopProducts(productsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load admin dashboard.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user])

  if (!user?.isAdmin) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-slate-700">
        <p className="text-xl font-semibold">Admin access required</p>
        <p className="mt-2 text-sm text-slate-500">You must be signed in as an administrator to view this page.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Loading admin dashboard...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  if (!stats) {
    return null
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Admin dashboard</p>
          <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
          <p className="mt-2 text-sm text-slate-500">Manage products, categories, orders and customers from one place.</p>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900 transition"
        >
          Manage products
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Products</p>
          <p className="mt-4 text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Orders</p>
          <p className="mt-4 text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Pending Orders</p>
          <p className="mt-4 text-3xl font-bold text-slate-900">{stats.pendingOrders}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Completed Orders</p>
          <p className="mt-4 text-3xl font-bold text-slate-900">{stats.completedOrders}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Customers</p>
          <p className="mt-4 text-3xl font-bold text-slate-900">{stats.totalCustomers}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Sales</p>
          <p className="mt-4 text-3xl font-bold text-slate-900">${stats.totalSales.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Recent Products</h2>
            <p className="mt-1 text-sm text-slate-500">Products visible in the catalog, including inactive items.</p>
          </div>
          <button
            onClick={() => navigate('/admin/products')}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            View all
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topProducts.map((product) => (
            <div key={product.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{product.name}</p>
              <p className="mt-1 text-sm text-slate-500">{product.category}</p>
              <p className="mt-3 text-sm text-slate-600 line-clamp-2">{product.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-900">
                <span>${product.price.toFixed(2)}</span>
                <span>{product.qty} qty</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
