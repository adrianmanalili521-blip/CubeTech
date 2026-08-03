import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AppContext'

type Order = {
  id: number
  orderNumber: string
  customerName: string
  createdAt: string
  total: number
  paymentMethod: string
  status: string
}

export default function AdminOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/orders')
        if (!response.ok) throw new Error('Unable to load admin orders.')
        setOrders(await response.json())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load admin orders.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (!user?.isAdmin) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-slate-700">
        <p className="text-xl font-semibold">Admin access required</p>
        <p className="mt-2 text-sm text-slate-500">You must be signed in as an administrator to view this page.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Loading orders...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Order management</p>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Dashboard
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Order Number</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Order Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Total</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{order.orderNumber}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{order.customerName}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">${order.total.toFixed(2)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{order.paymentMethod}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{order.status}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="rounded-xl bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200 transition"
                  >
                    View details
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
