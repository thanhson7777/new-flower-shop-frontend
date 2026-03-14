import './index.css'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

// Auth Pages
import Login from '~/page/Auth/Login'
import Register from '~/page/Auth/Register'
import Verify from '~/page/Auth/Verify'
import ForgotPassword from '~/page/Auth/ForgotPassword'
import ResetPassword from '~/page/Auth/ResetPassword'

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

        {/* Home - placeholder */}
        <Route path="/" element={<div className="p-8 text-center">Shop Hoa Tươi - Đang phát triển...</div>} />
      </Routes>
    </>
  )
}

export default App
