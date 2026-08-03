import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AppContext'

type Order = {
  id: number
  orderNumber: string
  customerName: string
  createdAt: string
  total: number
  paymentMethod: string | null
  status: string
}

export default function Orders() {
  const { isAuthenticated, user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      setLoading(false)
      return
    }

    const loadOrders = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
        if (!response.ok) {
          throw new Error('Unable to load your orders.')
        }
        setOrders(await response.json())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load your orders.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Sign in to view your orders</h1>
        <p className="text-slate-600 mb-6">You need to be signed in to access your order history.</p>
        <Link to="/auth" className="inline-block rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition">
          Sign in
        </Link>
      </div>
    )
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Loading your orders...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Order history</p>
          <h1 className="text-3xl font-bold text-slate-900">Your orders</h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-900">No orders found</p>
          <p className="mt-2 text-sm text-slate-500">Place your first order to see it here.</p>
          <Link to="/shop" className="mt-4 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
            Shop now
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Order #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Placed</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{order.orderNumber}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">${order.total.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{order.paymentMethod ?? 'N/A'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
