import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AppContext'

export default function Auth() {
  const navigate = useNavigate()
  const { isAuthenticated, user, signup, login, logout, updateProfile } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [address, setAddress] = useState(user?.address ?? '')
  const [city, setCity] = useState(user?.city ?? '')
  const [postalCode, setPostalCode] = useState(user?.postalCode ?? '')
  const [country, setCountry] = useState(user?.country ?? '')
  const [paymentMethod, setPaymentMethod] = useState(user?.paymentMethod ?? 'credit-card')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (mode === 'signup') {
      const result = await signup(name, email, password, {
        phone,
        address,
        city,
        postalCode,
        country,
      })

      if (result) {
        setError(result)
        return
      }

      navigate('/cart')
      return
    }

    const result = await login(email, password)
    if (typeof result === 'string') {
      setError(result)
      return
    }

    navigate(result?.isAdmin ? '/admin' : '/cart')
  }

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const result = await updateProfile({
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      paymentMethod,
    })

    if (result) {
      setError(result)
      return
    }
  }

  if (isAuthenticated && user) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage profile</h1>
              <p className="text-slate-500">Update your account information anytime.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/auth')
              }}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
            >
              Sign out
            </button>
          </div>

          <form className="mt-8 grid gap-4" onSubmit={handleUpdateProfile}>
            <label className="grid gap-2 text-sm text-slate-700">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              Address
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-700">
                City
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-700">
                Postal code
                <input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm text-slate-700">
              Country
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              Payment method
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="credit-card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="cash-on-delivery">Cash on Delivery</option>
              </select>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button className="rounded-3xl bg-black px-6 py-3 text-white font-semibold hover:bg-slate-900 transition">
              Save profile
            </button>
          </form>
        </div>
        <p className="text-sm text-slate-500 text-center">Your saved profile will be used for checkout.</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{mode === 'signup' ? 'Create account' : 'Sign in'}</h1>
            <p className="text-slate-500">{mode === 'signup' ? 'Add your account details to use checkout.' : 'Enter your credentials to proceed.'}</p>
          </div>
          <button
            type="button"
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
          >
            {mode === 'signup' ? 'Already have an account?' : 'Create an account'}
          </button>
        </div>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="grid gap-2 text-sm text-slate-700">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </label>
          )}

          <label className="grid gap-2 text-sm text-slate-700">
            {mode === 'signup' ? 'Email' : 'Email or username'}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type={mode === 'signup' ? 'email' : 'text'}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
            />
          </label>

          {mode === 'signup' && (
            <>
              <label className="grid gap-2 text-sm text-slate-700">
                Phone
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-700">
                Address
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-700">
                  City
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </label>
                <label className="grid gap-2 text-sm text-slate-700">
                  Postal code
                  <input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm text-slate-700">
                Country
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button className="rounded-3xl bg-black px-6 py-3 text-white font-semibold hover:bg-slate-900 transition">
            {mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </div>
      <p className="text-sm text-slate-500 text-center">By continuing, you agree to our Terms of Service.</p>
    </div>
  )
}
