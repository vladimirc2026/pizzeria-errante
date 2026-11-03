import { Route, Routes } from 'react-router-dom'
import { AuthProvider, CartProvider, StoreProvider } from './lib/store'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import { About, Contact, NotFound } from './pages/Info'
import AdminLogin from './pages/admin/Login'
import AdminShell from './pages/admin/Shell'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminCategories from './pages/admin/Categories'
import AdminOrders from './pages/admin/Orders'
import AdminSettings from './pages/admin/Settings'

export default function App() {
  return (
    <AuthProvider><StoreProvider><CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tienda" element={<Shop />} />
          <Route path="categoria/:slug" element={<Shop />} />
          <Route path="producto/:slug" element={<ProductPage />} />
          <Route path="carrito" element={<CartPage />} />
          <Route path="nosotros" element={<About />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminShell />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="categorias" element={<AdminCategories />} />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="ajustes" element={<AdminSettings />} />
        </Route>
      </Routes>
    </CartProvider></StoreProvider></AuthProvider>
  )
}
