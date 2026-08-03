import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth, useCart } from '../contexts/AppContext'

export default function Checkout() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState(user?.name ?? '')
  const [customerEmail, setCustomerEmail] = useState(user?.email ?? '')
  const [customerPhone, setCustomerPhone] = useState(user?.phone ?? '')
  const [addressLine, setAddressLine] = useState(user?.address ?? '')
  const [city, setCity] = useState(user?.city ?? '')
  const [postalCode, setPostalCode] = useState(user?.postalCode ?? '')
  const [country, setCountry] = useState(user?.country ?? '')
  const [paymentMethod, setPaymentMethod] = useState(user?.paymentMethod ?? 'credit-card')

  if (!isAuthenticated) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Please sign in first</h1>
        <p className="text-gray-600 mb-6">You need to authenticate before placing an order.</p>
        <Link to="/auth" className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition">
          Sign In / Sign Up
        </Link>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add items to your cart before checking out.</p>
        <Link to="/shop" className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition">
          Shop Now
        </Link>
      </div>
    )
  }

  const hasSavedDeliveryDetails = Boolean(
    user?.phone && user?.address && user?.city && user?.postalCode && user?.country && user?.paymentMethod,
  )

  const validateCheckout = () => {
    if (!customerName.trim()) return 'Please enter your full name.'
    if (!customerEmail.trim()) return 'Please enter your email address.'
    if (!hasSavedDeliveryDetails) {
      if (!customerPhone.trim()) return 'Please enter a phone number.'
      if (!addressLine.trim()) return 'Please enter a delivery address.'
      if (!city.trim()) return 'Please enter your city.'
      if (!postalCode.trim()) return 'Please enter a postal code.'
      if (!country.trim()) return 'Please enter your country.'
      if (!paymentMethod) return 'Please select a payment method.'
    }
    return null
  }

  const handlePlaceOrder = async () => {
    setError(null)
    const validationError = validateCheckout()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            name: customerName,
            email: customerEmail,
            phone: user?.phone ?? customerPhone,
            address: user?.address ?? addressLine,
            city: user?.city ?? city,
            postalCode: user?.postalCode ?? postalCode,
            country: user?.country ?? country,
            paymentMethod: user?.paymentMethod ?? paymentMethod,
          },
          items: cartItems.map((item) => ({ id: item.product.id, quantity: item.quantity })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to place order.')
      }

      clearCart()
      alert(data.message || 'Your order has been placed successfully!')
      navigate('/shop')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to place order.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Checkout details</p>
              <h1 className="text-3xl font-bold">Delivery & payment</h1>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
              Signed in as {user?.name}
            </div>
          </div>

          {hasSavedDeliveryDetails ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
              <h2 className="text-xl font-semibold text-slate-900">Saved delivery & payment</h2>
              <div className="mt-4 space-y-3 text-sm">
                <p>
                  <span className="font-semibold">Phone:</span> {user?.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {user?.address}, {user?.city}, {user?.postalCode}, {user?.country}
                </p>
                <p>
                  <span className="font-semibold">Payment method:</span> {user?.paymentMethod?.replace(/-/g, ' ')}
                </p>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Your saved checkout details will be used. Update them from your profile page if needed.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-700">
                  Phone number
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </label>
                <label className="grid gap-2 text-sm text-slate-700">
                  Payment method
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="credit-card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="cash-on-delivery">Cash on Delivery</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4">
                <label className="grid gap-2 text-sm text-slate-700">
                  Delivery address
                  <input
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-2 text-sm text-slate-700">
                    City
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-700">
                    Postal code
                    <input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-700">
                    Country
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Order summary</p>
              <h2 className="text-2xl font-semibold">Your items</h2>
            </div>
            <div className="text-sm text-slate-500">Total: ${cartTotal.toFixed(2)}</div>
          </div>

          <div className="mt-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.product.name}</p>
                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="rounded-full bg-black px-6 py-3 text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Confirming order...' : 'Confirm and Pay'}
            </button>
            <p className="text-sm text-slate-500">You will be redirected to the shop after purchase.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
