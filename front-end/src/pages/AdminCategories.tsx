import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AppContext'

export default function AdminCategories() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Unable to load categories.')
      setCategories(await response.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (!user?.isAdmin) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-slate-700">
        <p className="text-xl font-semibold">Admin access required</p>
        <p className="mt-2 text-sm text-slate-500">You must be signed in as an administrator to view this page.</p>
      </div>
    )
  }

  if (error && categories.length === 0) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  const handleCreate = async () => {
    if (!newCategory.trim()) return
    setError(null)
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory.trim() }),
    })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Unable to add category.')
      return
    }
    setNewCategory('')
    fetchCategories()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category? It cannot be removed when products exist in it.')) return
    setError(null)
    const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Unable to delete category.')
      return
    }
    fetchCategories()
  }

  if (error && !categories.length) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Category management</p>
          <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          View products
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <label className="grid gap-2 text-sm text-slate-700">
              Add category
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>
          </div>
          <button
            onClick={handleCreate}
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900 transition"
          >
            Add category
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((categoryItem) => (
                <tr key={categoryItem.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{categoryItem.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/admin/categories/${categoryItem.id}/edit`)}
                      className="mr-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(categoryItem.id)}
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
    </div>
  )
}
