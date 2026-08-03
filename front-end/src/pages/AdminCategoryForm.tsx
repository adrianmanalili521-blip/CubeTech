import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AppContext'

export default function AdminCategoryForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEditMode) return
    fetch(`/api/categories/${id}`)
      .then((res) => res.json())
      .then((data) => setName(data.name))
      .catch((err) => setError(err.message))
  }, [id, isEditMode])

  if (!user?.isAdmin) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-slate-700">
        <p className="text-xl font-semibold">Admin access required</p>
        <p className="mt-2 text-sm text-slate-500">You must be signed in as an administrator to view this page.</p>
      </div>
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Category name is required.')
      return
    }

    const response = await fetch(isEditMode ? `/api/categories/${id}` : '/api/categories', {
      method: isEditMode ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Unable to save category.')
      return
    }

    navigate('/admin/categories')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Category</p>
            <h1 className="text-3xl font-bold text-slate-900">{isEditMode ? 'Edit category' : 'Add category'}</h1>
          </div>
        </div>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm text-slate-700">
            Category Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="rounded-3xl bg-black px-6 py-3 text-white font-semibold hover:bg-slate-900 transition">
            {isEditMode ? 'Save category' : 'Create category'}
          </button>
        </form>
      </div>
    </div>
  )
}
