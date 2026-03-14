import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { publicAxiosInstance } from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error' | 'invalid'
  const [errors, setErrors] = useState({})

  // Password validation
  const passwordChecks = {
    length: formData.newPassword.length >= 8,
    hasLetter: /[a-zA-Z]/.test(formData.newPassword),
    hasNumber: /\d/.test(formData.newPassword)
  }

  useEffect(() => {
    // Check if email and token exist
    if (!email || !token) {
      setStatus('invalid')
    } else {
      setStatus('idle')
    }
  }, [email, token])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc'
    } else if (formData.newPassword.length < 8 || !/[a-zA-Z]/.test(formData.newPassword) || !/\d/.test(formData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự, chữ cái và số'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await publicAxiosInstance.post(`${API_ROOT}/v1/users/reset-password`, {
        email,
        resetToken: token,
        newPassword: formData.newPassword
      })

      if (response.status === 200) {
        setStatus('success')
        toast.success('Đặt lại mật khẩu thành công!')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.'
      toast.error(message)
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const renderPasswordCheck = (isValid, text) => (
    <div className={`flex items-center gap-1 text-xs ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
      {isValid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {text}
    </div>
  )

  // Invalid token state
  if (status === 'invalid') {
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
            Link không hợp lệ
          </h2>

          <p className="text-gray-500 mb-6">
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại link.
          </p>

          <Link to="/forgot-password">
            <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700">
              Quên mật khẩu
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  // Success state
  if (status === 'success') {
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
            Đặt lại mật khẩu thành công!
          </h2>

          <p className="text-gray-500 mb-6">
            Mật khẩu của bạn đã được cập nhật thành công. Bây giờ bạn có thể đăng nhập với mật khẩu mới.
          </p>

          <Link to="/login">
            <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700">
              Đăng nhập ngay
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8"
      >
        {/* Mobile Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="font-serif text-xl font-semibold text-gray-800">Tiệm Hoa Tươi</span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đặt lại mật khẩu
          </h2>
          <p className="text-gray-500 text-sm">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {email && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
            <p className="text-sm text-blue-700">
              Email: <span className="font-medium">{email}</span>
            </p>
          </div>
        )}

        {errors.general && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu mới"
                value={formData.newPassword}
                onChange={handleChange}
                className={`h-11 pr-10 ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formData.newPassword && (
              <div className="grid grid-cols-3 gap-1 mt-2">
                {renderPasswordCheck(passwordChecks.length, '8 ký tự')}
                {renderPasswordCheck(passwordChecks.hasLetter, 'Chữ cái')}
                {renderPasswordCheck(passwordChecks.hasNumber, 'Số')}
              </div>
            )}
            {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu mới"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`h-11 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Đặt lại mật khẩu'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại đăng nhập
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
