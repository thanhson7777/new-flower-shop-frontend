import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { verifyUserAPI } from '~/apis'

export default function Verify() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const verifyAccount = async () => {
      if (!email || !token) {
        setStatus('error')
        return
      }

      try {
        const response = await verifyUserAPI({ email, token })
        if (response.status === 200) {
          setStatus('success')
          toast.success('Xác thực tài khoản thành công!')
        }
      } catch (error) {
        setStatus('error')
        const message = error.response?.data?.message || 'Xác thực thất bại. Link có thể đã hết hạn.'
        toast.error(message)
      }
    }

    verifyAccount()
  }, [email, token])

  const handleResendEmail = async () => {
    // TODO: Implement resend verification email
    toast.info('Tính năng đang được phát triển')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Đang xác thực tài khoản...</h2>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
        </motion.div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Xác thực thất bại
          </h2>

          <p className="text-gray-500 mb-6">
            Link xác thực đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại email xác thực.
          </p>

          {email && (
            <p className="text-sm text-gray-400 mb-6">
              Email: <span className="font-medium text-gray-600">{email}</span>
            </p>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi lại email xác thực
                </>
              )}
            </Button>

            <Link to="/login">
              <Button
                variant="outline"
                className="w-full h-11 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Xác thực thành công!
        </h2>

        <p className="text-gray-500 mb-6">
          Chúc mừng! Tài khoản của bạn đã được kích hoạt thành công. Bây giờ bạn có thể đăng nhập và trải nghiệm mua sắm tại Tiệm Hoa Tươi.
        </p>

        <Link to="/login">
          <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700">
            <ArrowRight className="w-4 h-4 mr-2" />
            Đăng nhập ngay
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
