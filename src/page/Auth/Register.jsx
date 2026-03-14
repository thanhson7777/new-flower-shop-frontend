import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react'
import AuthLayout from '~/components/layout/AuthLayout'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { registerUserAPI } from '~/apis'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Password validation
  const passwordChecks = {
    length: formData.password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    // Phone validation (10-11 digits)
    if (!formData.phone) {
      newErrors.phone = 'Số điện thoại là bắt buộc'
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải là 10-11 chữ số'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 8 || !/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, chữ cái và số'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    // Terms validation
    if (!agreedToTerms) {
      newErrors.terms = 'Bạn phải đồng ý với điều khoản'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await registerUserAPI({
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })

      if (response.status === 201) {
        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.')
        navigate('/login')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
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

  const footer = (
    <div className="text-center text-sm text-gray-600">
      Đã có tài khoản?{' '}
      <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
        Đăng nhập ngay
      </Link>
    </div>
  )

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Đăng ký để khám phá thế giới hoa tươi đẹp"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {errors.general}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            className={`h-11 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0123456789"
            value={formData.phone}
            onChange={handleChange}
            maxLength={11}
            className={`h-11 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu *</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className={`h-11 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formData.password && (
            <div className="grid grid-cols-2 gap-1 mt-2">
              {renderPasswordCheck(passwordChecks.length, 'Tối thiểu 8 ký tự')}
              {renderPasswordCheck(passwordChecks.hasLetter, 'Có chữ cái')}
              {renderPasswordCheck(passwordChecks.hasNumber, 'Có số')}
              {renderPasswordCheck(passwordChecks.hasSpecial, 'Có ký tự đặc biệt')}
            </div>
          )}
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
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

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            Tôi đồng ý với{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">Điều khoản</Link>
            {' '}và{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">Chính sách bảo mật</Link>
          </label>
        </div>
        {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang đăng ký...
            </>
          ) : (
            'Đăng ký ngay'
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
