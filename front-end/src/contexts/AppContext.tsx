import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product, User } from '../types.ts'

const AUTH_USER_KEY = 'cubetech_user'
const CART_KEY = 'cubetech_cart'

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  signup: (
    name: string,
    email: string,
    password: string,
    extras?: Omit<User, 'name' | 'email'>,
  ) => Promise<string | null>
  login: (email: string, password: string) => Promise<User | string | null>
  logout: () => void
  updateProfile: (profile: Partial<User>) => Promise<string | null>
}

type CartContextType = {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product, quantity?: number) => string | null
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const CartContext = createContext<CartContextType | undefined>(undefined)

function safeParse<T>(value: string | null): T | undefined {
  if (!value) return undefined
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const storedUser = safeParse<User>(localStorage.getItem(AUTH_USER_KEY))
    const storedCart = safeParse<CartItem[]>(localStorage.getItem(CART_KEY))

    if (storedUser) {
      setUser(storedUser)
    }

    if (storedCart) {
      setCartItems(storedCart)
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_USER_KEY)
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const signup = async (
    name: string,
    email: string,
    password: string,
    extras?: Omit<User, 'name' | 'email'>,
  ): Promise<string | null> => {
    if (!name || !email || !password) {
      return 'Please enter name, email, and password.'
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, ...extras }),
      })

      const data = await response.json()
      if (!response.ok) {
        return data.error || 'Unable to sign up.'
      }

      setUser(data)
      return null
    } catch (err) {
      return err instanceof Error ? err.message : 'Unable to sign up.'
    }
  }

  const login = async (email: string, password: string): Promise<User | string | null> => {
    if (!email || !password) {
      return 'Please enter email and password.'
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        return data.error || 'Unable to log in.'
      }

      setUser(data)
      return data
    } catch (err) {
      return err instanceof Error ? err.message : 'Unable to log in.'
    }
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = async (profile: Partial<User>): Promise<string | null> => {
    if (!user) {
      return 'No authenticated user.'
    }

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentEmail: user.email, ...profile }),
      })

      const data = await response.json()
      if (!response.ok) {
        return data.error || 'Unable to update profile.'
      }

      setUser(data)
      return null
    } catch (err) {
      return err instanceof Error ? err.message : 'Unable to update profile.'
    }
  }

  const addToCart = (product: Product, quantity = 1) => {
    if (product.qty <= 0) {
      return 'This product is out of stock.'
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id)
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, product.qty)
        return currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item,
        )
      }

      return [...currentItems, { product, quantity: Math.min(quantity, product.qty) }]
    })

    return null
  }

  const removeFromCart = (productId: number) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.qty)) }
          : item,
      ),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const authValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      updateProfile,
    }),
    [user],
  )

  const cartValue = useMemo(
    () => ({
      cartItems,
      cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
      cartTotal: cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cartItems],
  )

  return (
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AppProvider')
  }
  return context
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within AppProvider')
  }
  return context
}
