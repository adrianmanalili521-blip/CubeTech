import { Link } from 'react-router-dom'
import { Box, Search, ShoppingCart, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow p-4">
      <div className="container mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Box size={28} className="bg-blue-500"/>
          <h1 className="text-xl font-bold">CubeTech</h1>
        </div>

        <nav className="flex flex-1 justify-center gap-5">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/cart">Cart</Link>
        </nav>

        <div className="relative flex items-center">
          {/* The Icon Container */}
          <div className="absolute left-3 pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          {/* The Search Input */}
          <input 
            type="search" 
            placeholder="Search..."
            className="w-70 h-7 bg-blue-50/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 border border-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>
        <ShoppingCart />
        <User />

       
      </div>
    </header>
  )
}
