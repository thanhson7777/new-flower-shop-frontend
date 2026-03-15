import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Loader2, Send } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) return

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setMessage('Vui lòng nhập email hợp lệ')
      return
    }

    setStatus('loading')

    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setMessage('Đăng ký thành công! Cảm ơn bạn đã theo dõi')
      setEmail('')

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }, 1500)
  }

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white rounded-full opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6"
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-bold text-white mb-3"
          >
            Đăng Ký Nhận Tin Khuyến Mãi
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-blue-100 mb-8"
          >
            Đừng bỏ lỡ những ưu đãi đặc biệt dành riêng cho khách hàng thân thiết của TVU Shop
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                placeholder="Nhập địa chỉ email của bạn"
                disabled={status === 'loading' || status === 'success'}
                className="w-full px-5 py-4 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang gửi...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Đã đăng ký
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Đăng ký
                </>
              )}
            </button>
          </motion.form>

          {/* Message */}
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 text-sm ${
                status === 'success' ? 'text-green-200' : 'text-red-200'
              }`}
            >
              {message}
            </motion.p>
          )}

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-blue-200 text-xs mt-4"
          >
            Bằng việc đăng ký, bạn đồng ý với chính sách bảo mật của chúng tôi
          </motion.p>
        </div>
      </div>
    </section>
  )
}
