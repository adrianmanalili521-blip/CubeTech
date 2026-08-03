import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AppContext'

type Customer = {
  id: number
  name: string
  email: string
  phone: string | null
  orderCount: number
  totalPurchase: number
  status: string
}

export default function AdminCustomers() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/customers')
        if (!response.ok) throw new Error('Unable to load customers.')
        setCustomers(await response.json())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load customers.')
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
    return <div className="p-8 text-center text-slate-600">Loading customers...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Customer management</p>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Orders</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Total spent</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{customer.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{customer.email}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{customer.phone ?? 'N/A'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{customer.orderCount}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">${customer.totalPurchase.toFixed(2)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{customer.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
