import './index.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useSelector } from 'react-redux'

// Layouts
import MainLayout from '~/components/layout/MainLayout'
import AdminLayout from '~/components/layout/AdminLayout'

// Auth Pages
import Login from '~/page/Auth/Login'
import Register from '~/page/Auth/Register'
import Verify from '~/page/Auth/Verify'
import ForgotPassword from '~/page/Auth/ForgotPassword'
import ResetPassword from '~/page/Auth/ResetPassword'
import Home from '~/page/Home/Home'
import Products from '~/page/Products/Products'
import ProductDetail from '~/page/Products/ProductDetail'

// Admin Pages
import Dashboard from '~/page/Admin/Dashboard'
import UsersPage from '~/page/Admin/Users'
import CategoriesPage from '~/page/Admin/Categories'
import ProductsPage from '~/page/Admin/Products'
import CouponsPage from '~/page/Admin/Coupons'
import ArticlesPage from '~/page/Admin/Articles'
import ContactsPage from '~/page/Admin/Contacts'
import OrdersPage from '~/page/Admin/Orders'
import ReviewsPage from '~/page/Admin/Reviews'
import SettingsPage from '~/page/Admin/Settings'

// Admin Route Guard
function PrivateRoute() {
  const currentUser = useSelector((state) => state.user.currentUser)

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<div className="p-8 text-center">Giới thiệu</div>} />
          <Route path="/contact" element={<div className="p-8 text-center">Liên hệ</div>} />
          <Route path="/cart" element={<div className="p-8 text-center">Giỏ hàng</div>} />
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="contacts" element={<ContactsPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
