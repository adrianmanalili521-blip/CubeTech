import { Link } from 'react-router-dom'
import { Box, Search, ShoppingCart, User } from 'lucide-react'
import { useAuth, useCart } from '../contexts/AppContext'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const { cartCount } = useCart()

  const isAdmin = Boolean(user?.isAdmin)

  return (
    <header className="bg-white shadow p-4">
      <div className="container mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Box size={28} className="bg-blue-500 rounded-sm" />
          <h1 className="text-xl font-bold">CubeTech</h1>
        </div>

        <nav className="flex flex-1 justify-center gap-5">
          {isAdmin ? (
            <>
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/products">Products</Link>
              <Link to="/admin/categories">Categories</Link>
              <Link to="/admin/orders">Orders</Link>
              <Link to="/admin/customers">Customers</Link>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/about">About Us</Link>
              {isAuthenticated && <Link to="/orders">My Orders</Link>}
            </>
          )}
        </nav>

        {!isAdmin && (
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="w-70 h-7 bg-blue-50/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 border border-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isAdmin && (
            <Link to="/cart" className="relative text-slate-700 hover:text-black transition">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <>
              {user?.name && <span className="text-sm font-medium text-slate-700">{user.name}</span>}
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
