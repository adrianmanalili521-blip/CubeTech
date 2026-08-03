import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Auth from './pages/Auth'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminProductForm from './pages/AdminProductForm'
import AdminCategories from './pages/AdminCategories'
import AdminCategoryForm from './pages/AdminCategoryForm'
import AdminOrders from './pages/AdminOrders'
import AdminOrderDetails from './pages/AdminOrderDetails'
import AdminCustomers from './pages/AdminCustomers'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="about" element={<About />} />
          <Route path="cart" element={<Cart />} />
          <Route path="auth" element={<Auth />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/products/create" element={<AdminProductForm />} />
          <Route path="admin/products/:id/edit" element={<AdminProductForm />} />
          <Route path="admin/categories" element={<AdminCategories />} />
          <Route path="admin/categories/create" element={<AdminCategoryForm />} />
          <Route path="admin/categories/:id/edit" element={<AdminCategoryForm />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/orders/:id" element={<AdminOrderDetails />} />
          <Route path="admin/customers" element={<AdminCustomers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}