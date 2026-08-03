import { Link } from 'react-router-dom'
import { useCart } from '../contexts/AppContext'

export default function Cart() {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add items from the shop to begin checkout.</p>
        <Link to="/shop" className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-700 transition">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-gray-600">{cartCount} item{cartCount === 1 ? '' : 's'} in your cart</p>
        </div>
        <button
          onClick={() => clearCart()}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid gap-6">
        {cartItems.map((item) => (
          <div key={item.product.id} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[120px_1fr]">
            <img src={item.product.image} alt={item.product.name} className="h-28 w-full rounded-2xl object-cover" />
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{item.product.name}</h2>
                  <p className="text-sm text-slate-500">{item.product.category}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 transition"
                >
                  Remove
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="h-9 w-9 rounded-full border border-slate-300 text-lg text-slate-700 hover:bg-slate-100 transition"
                  >
                    -
                  </button>
                  <span className="min-w-[32px] text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="h-9 w-9 rounded-full border border-slate-300 text-lg text-slate-700 hover:bg-slate-100 transition"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Unit price</p>
                  <p className="text-lg font-semibold">${item.product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Order total</p>
            <p className="text-3xl font-semibold">${cartTotal.toFixed(2)}</p>
          </div>
          <Link
            to="/checkout"
            className="inline-flex rounded-full bg-black px-6 py-3 text-white transition hover:bg-slate-900"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
