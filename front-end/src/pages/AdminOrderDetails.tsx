import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AppContext'

type OrderDetail = {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  customerAddress: string | null
  customerCity: string | null
  customerPostalCode: string | null
  customerCountry: string | null
  paymentMethod: string | null
  status: string
  notes: string | null
  total: number
  createdAt: string
  items: Array<{ productId: number; productName: string; quantity: number; price: number; total: number }>
}

const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Completed', 'Cancelled']

export default function AdminOrderDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/admin/orders/${id}`)
      .then((res) => res.json())
      .then((data: OrderDetail) => {
        setOrder(data)
        setStatus(data.status)
        setNotes(data.notes ?? '')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    if (!order) return
    setError(null)
    setSuccess(null)
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Unable to update order.')
      return
    }
    setOrder(data)
    setSuccess('Order status updated successfully.')
  }

  if (!user?.isAdmin) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-slate-700">
        <p className="text-xl font-semibold">Admin access required</p>
        <p className="mt-2 text-sm text-slate-500">You must be signed in as an administrator to view this page.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Loading order details...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  if (!order) {
    return null
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Order details</p>
          <h1 className="text-3xl font-bold text-slate-900">{order.orderNumber}</h1>
        </div>
        <button
          onClick={() => navigate('/admin/orders')}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Back to orders
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Customer</h2>
          <p className="mt-4 text-sm text-slate-600">{order.customerName}</p>
          <p className="text-sm text-slate-600">{order.customerEmail}</p>
          <p className="text-sm text-slate-600">{order.customerPhone ?? 'N/A'}</p>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Delivery address</p>
            <p>{order.customerAddress ?? 'N/A'}</p>
            <p>{order.customerCity}, {order.customerPostalCode}</p>
            <p>{order.customerCountry}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
          <p className="mt-4 text-sm text-slate-600">Payment: {order.paymentMethod ?? 'N/A'}</p>
          <p className="text-sm text-slate-600">Status: {order.status}</p>
          <p className="text-sm text-slate-600">Date: {new Date(order.createdAt).toLocaleString()}</p>
          <p className="mt-4 text-xl font-bold text-slate-900">Total: ${order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Products</h2>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div key={item.productId} className="rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.productName}</p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-slate-900">${item.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Update order</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-700">
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500">
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Order notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[120px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" />
          </label>
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-4 text-sm text-emerald-700">{success}</p>}
        <button onClick={handleSave} className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900 transition">
          Save changes
        </button>
      </div>
    </div>
  )
}
