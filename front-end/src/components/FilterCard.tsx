import { Search } from 'lucide-react'

type FilterCardProps = {
  searchTerm: string
  selectedCategory: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

const categories = [
  { id: '', label: 'All' },
  { id: 'smartphone', label: 'Smartphones' },
  { id: 'laptop', label: 'Laptops' },
  { id: 'audio', label: 'Audio' },
  { id: 'watch', label: 'Wearables' },
  { id: 'accessory', label: 'Accessories' },
  { id: 'gaming', label: 'Gaming' },
]

export default function FilterCard({ searchTerm, selectedCategory, onSearchChange, onCategoryChange }: FilterCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 mb-2">Search</p>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 mb-2">Category</p>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat.id}
                checked={selectedCategory === cat.id}
                onChange={() => onCategoryChange(cat.id)}
                className="h-4 w-4 rounded-full border border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
