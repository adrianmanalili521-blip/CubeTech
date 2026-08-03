import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Product } from '../types'

const statusOptions = ['Active', 'Inactive', 'Out of Stock']

export default function AdminProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const [product, setProduct] = useState<Product | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [image, setImage] = useState('')
  const [overview, setOverview] = useState('')
  const [status, setStatus] = useState('Active')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isEditMode) return
    setLoading(true)
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data: Product) => {
        setProduct(data)
        setName(data.name)
        setCategory(data.category)
        setDescription(data.description)
        setPrice(data.price.toString())
        setQty(data.qty.toString())
        setImage(data.image)
        setOverview(data.overview)
        setStatus(data.status || 'Active')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEditMode])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!name.trim() || !category.trim() || !description.trim() || !price.trim() || !qty.trim()) {
      setError('Please fill all required fields.')
      return
    }

    const payload = {
      name,
      category,
      description,
      price: Number(price),
      qty: Number(qty),
      image,
      overview,
      status,
    }

    const endpoint = isEditMode ? `/api/products/${id}` : '/api/products'
    const method = isEditMode ? 'PUT' : 'POST'

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Unable to save product.')
      return
    }

    navigate('/admin/products')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Product</p>
            <h1 className="text-3xl font-bold text-slate-900">{isEditMode ? 'Edit product' : 'Add product'}</h1>
          </div>
        </div>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-700">
              Product Name
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" />
            </label>
            <label className="grid gap-2 text-sm text-slate-700">
              Category
              <input value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" />
            </label>
          </div>

          <label className="grid gap-2 text-sm text-slate-700">
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[140px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-sm text-slate-700">
              Price
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" />
            </label>
            <label className="grid gap-2 text-sm text-slate-700">
              Stock Quantity
              <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" />
            </label>
            <label className="grid gap-2 text-sm text-slate-700">
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500">
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm text-slate-700">
            Product Image URL
            <input value={image} onChange={(e) => setImage(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" />
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Overview
            <textarea value={overview} onChange={(e) => setOverview(e.target.value)} className="min-h-[120px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="rounded-3xl bg-black px-6 py-3 text-white font-semibold hover:bg-slate-900 transition">
            {isEditMode ? 'Save product' : 'Create product'}
          </button>
        </form>
      </div>
    </div>
  )
}
