import './index.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useSelector } from 'react-redux'

// Auth Pages
import Login from '~/page/Auth/Login'
import Register from '~/page/Auth/Register'
import Verify from '~/page/Auth/Verify'
import ForgotPassword from '~/page/Auth/ForgotPassword'
import ResetPassword from '~/page/Auth/ResetPassword'
import Home from '~/page/Home/Home'

// Admin Pages
import AdminLayout from '~/components/layout/AdminLayout'
import Dashboard from '~/page/Admin/Dashboard'
import UsersPage from '~/page/Admin/Users'

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

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<div className="p-6">Quản lý sản phẩm</div>} />
            <Route path="orders" element={<div className="p-6">Quản lý đơn hàng</div>} />
            <Route path="categories" element={<div className="p-6">Quản lý danh mục</div>} />
            <Route path="coupons" element={<div className="p-6">Quản lý mã giảm giá</div>} />
            <Route path="articles" element={<div className="p-6">Quản lý bài viết</div>} />
            <Route path="reviews" element={<div className="p-6">Quản lý đánh giá</div>} />
            <Route path="contacts" element={<div className="p-6">Quản lý liên hệ</div>} />
            <Route path="settings" element={<div className="p-6">Cài đặt</div>} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
