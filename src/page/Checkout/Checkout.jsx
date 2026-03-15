import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { ArrowLeft, Truck, CreditCard, Gift, Calendar, MapPin, User, Phone, MessageSquare, Package, CheckCircle, ChevronDown, X } from 'lucide-react'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCartItems, clearCart } from '~/redux/cart/cartSlice'
import { createOrderAPI, getProvincesAPI, getDistrictsAPI, getWardsAPI, getValidCouponsAPI } from '~/apis'

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const reduxCartItems = useSelector(selectCartItems)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  // Form state
  const [formData, setFormData] = useState({
    // Buyer info
    buyerFullname: '',
    buyerPhone: '',
    // Receiver address
    receiverFullname: '',
    receiverPhone: '',
    province: '',
    provinceCode: '',
    district: '',
    districtCode: '',
    ward: '',
    wardCode: '',
    address: '',
    // Delivery info
    deliveryDate: '',
    deliveryTimeSlot: '09:00 - 12:00',
    cardMessage: '',
    isAnonymous: false,
    note: '',
    // Payment & Coupon
    paymentMethod: 'COD',
    couponCode: ''
  })

  // Derived state
  const [discountAmount, setDiscountAmount] = useState(0)
  const [shippingFee, setShippingFee] = useState(30000)
  const [coupons, setCoupons] = useState([])
  const [loadingCoupons, setLoadingCoupons] = useState(false)
  const [showCouponDropdown, setShowCouponDropdown] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)

  const FREE_SHIP_THRESHOLD = 500000

  // Get cart items
  const cartItems = location.state?.cartItems || reduxCartItems

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }

    // Pre-fill from user profile
    setFormData(prev => ({
      ...prev,
      buyerFullname: currentUser.displayName || '',
      buyerPhone: currentUser.phone || '',
      receiverFullname: currentUser.displayName || '',
      receiverPhone: currentUser.phone || '',
      // Parse address if exists (simple format: "address, ward, district, province")
      address: currentUser.address || ''
    }))

    fetchProvinces()
    setLoading(false)
  }, [currentUser, cartItems])

  const fetchProvinces = async () => {
    try {
      const res = await getProvincesAPI()
      const data = res.data?.data || res.data || []
      setProvinces(data)
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }

  const fetchDistricts = async (provinceCode) => {
    try {
      const res = await getDistrictsAPI(provinceCode)
      const data = res.data?.data || res.data || []
      setDistricts(data)
      setWards([])
    } catch (error) {
      console.error('Error fetching districts:', error)
    }
  }

  const fetchWards = async (districtCode) => {
    try {
      const res = await getWardsAPI(districtCode)
      const data = res.data?.data || res.data || []
      setWards(data)
    } catch (error) {
      console.error('Error fetching wards:', error)
    }
  }

  // Fetch districts khi provinceCode thay đổi
  useEffect(() => {
    if (formData.provinceCode) {
      fetchDistricts(formData.provinceCode)
    } else {
      setDistricts([])
      setWards([])
    }
  }, [formData.provinceCode])

  // Fetch wards khi districtCode thay đổi
  useEffect(() => {
    if (formData.districtCode) {
      fetchWards(formData.districtCode)
    } else {
      setWards([])
    }
  }, [formData.districtCode])

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      setLoadingCoupons(true)
      try {
        const res = await getValidCouponsAPI()
        const data = res.data?.data || res.data || []
        setCoupons(data)
      } catch (error) {
        console.error('Error fetching coupons:', error)
      } finally {
        setLoadingCoupons(false)
      }
    }
    fetchCoupons()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }

      // Khi chọn tỉnh — lấy code từ mảng provinces
      if (name === 'province') {
        const province = provinces.find(p => p.name === value)
        newData.provinceCode = province?.code ?? ''
        newData.district = ''
        newData.districtCode = ''
        newData.ward = ''
        newData.wardCode = ''
      }

      // Khi chọn quận/huyện
      if (name === 'district') {
        const district = districts.find(d => d.name === value)
        newData.districtCode = district?.code ?? ''
        newData.ward = ''
        newData.wardCode = ''
      }

      // Khi chọn xã/phường
      if (name === 'ward') {
        const ward = wards.find(w => w.name === value)
        newData.wardCode = ward?.code ?? ''
      }

      return newData
    })
  }

  // Xử lý chọn coupon
  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon)
    setFormData(prev => ({
      ...prev,
      couponCode: coupon.code
    }))
    // Tính số tiền giảm giá
    if (coupon.discountType === 'percentage') {
      setDiscountAmount(Math.min(totalProductPrice * coupon.discountValue / 100, coupon.maxDiscount || Infinity))
    } else {
      setDiscountAmount(Math.min(coupon.discountValue, totalProductPrice))
    }
    setShowCouponDropdown(false)
  }

  // Xóa coupon đã chọn
  const handleRemoveCoupon = () => {
    setSelectedCoupon(null)
    setFormData(prev => ({
      ...prev,
      couponCode: ''
    }))
    setDiscountAmount(0)
  }

  const calculateTotals = () => {
    const totalProductPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const finalShippingFee = totalProductPrice >= FREE_SHIP_THRESHOLD ? 0 : shippingFee
    const finalPrice = totalProductPrice + finalShippingFee - discountAmount

    return { totalProductPrice, finalShippingFee, finalPrice }
  }

  const { totalProductPrice, finalShippingFee, finalPrice } = calculateTotals()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.buyerFullname || !formData.buyerPhone) {
      toast.error('Vui lòng nhập thông tin người mua')
      return
    }
    if (!formData.receiverFullname || !formData.receiverPhone || !formData.address) {
      toast.error('Vui lòng nhập địa chỉ giao hàng')
      return
    }
    if (!formData.deliveryDate) {
      toast.error('Vui lòng chọn ngày giao hàng')
      return
    }

    setSubmitting(true)

    try {
      // Build items payload
      const items = cartItems.map(item => ({
        productId: String(item.productId),
        size: String(item.size).trim(),
        name: item.name || 'Sản phẩm hoa',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity),
        image: item.image
      }))

      // Build order data
      const orderData = {
        items,
        buyerInfo: {
          fullname: formData.buyerFullname.trim(),
          phone: formData.buyerPhone.trim()
        },
        receiverAddress: {
          fullname: formData.receiverFullname.trim(),
          phone: formData.receiverPhone.trim(),
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
          address: formData.address.trim()
        },
        deliveryInfo: {
          deliveryDate: formData.deliveryDate,
          deliveryTimeSlot: formData.deliveryTimeSlot,
          cardMessage: formData.cardMessage.trim() || null,
          isAnonymous: formData.isAnonymous,
          note: formData.note.trim() || null
        },
        paymentMethod: formData.paymentMethod,
        couponCode: formData.couponCode.trim() || null,
        totalProductPrice,
        shippingFee: finalShippingFee
      }

      const response = await createOrderAPI(orderData)
      const result = response

      if (result.success) {
        // Clear cart in Redux
        dispatch(clearCart())

        // Save order to localStorage for payment return
        localStorage.setItem('pendingOrder', JSON.stringify(result.data.order))

        // If COD, go directly to success page
        if (formData.paymentMethod === 'COD') {
          localStorage.removeItem('pendingOrder')
          navigate('/order-success', { state: { order: result.data.order } })
        } else if (result.data.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = result.data.paymentUrl
        } else {
          localStorage.removeItem('pendingOrder')
          navigate('/order-success', { state: { order: result.data.order } })
        }
      }
    } catch (error) {
      console.error('Create order error:', error)
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại!')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Thanh toán</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin người mua */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Thông tin người mua
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                  <input
                    type="text"
                    name="buyerFullname"
                    value={formData.buyerFullname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    name="buyerPhone"
                    value={formData.buyerPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Địa chỉ giao hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên người nhận</label>
                  <input
                    type="text"
                    name="receiverFullname"
                    value={formData.receiverFullname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Người nhận hàng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SĐT người nhận</label>
                  <input
                    type="tel"
                    name="receiverPhone"
                    value={formData.receiverPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SĐT người nhận"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/TP</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn tỉnh/TP</option>
                    {provinces.map(p => (
                      <option key={p.code} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    disabled={!formData.province}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map(d => (
                      <option key={d.code} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xã/Phường</label>
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    disabled={!formData.district}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="">Chọn xã/phường</option>
                    {wards.map(w => (
                      <option key={w.code} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Số nhà, đường, thôn/xóm..."
                />
              </div>
            </div>

            {/* Thông tin giao hàng */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giao hàng</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khung giờ giao</label>
                  <select
                    name="deliveryTimeSlot"
                    value={formData.deliveryTimeSlot}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="09:00 - 12:00">Sáng (09:00 - 12:00)</option>
                    <option value="14:00 - 17:00">Chiều (14:00 - 17:00)</option>
                    <option value="17:00 - 20:00">Tối (17:00 - 20:00)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Lời chúc trên thiệp</label>
                <textarea
                  name="cardMessage"
                  value={formData.cardMessage}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập lời chúc..."
                  maxLength={500}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ghi chú thêm cho đơn hàng..."
                  maxLength={500}
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  id="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isAnonymous" className="text-sm text-gray-700">
                  Giao hàng ẩn danh (không hiển thị thông tin người gửi)
                </label>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-sm text-gray-500">Trả tiền mặt khi nhận được hàng</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'VNPAY' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={formData.paymentMethod === 'VNPAY'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Thanh toán qua VNPAY</p>
                    <p className="text-sm text-gray-500">Thanh toán trực tuyến qua ATM/Visa/Mastercard</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'MOMO' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="MOMO"
                    checked={formData.paymentMethod === 'MOMO'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Thanh toán qua MoMo</p>
                    <p className="text-sm text-gray-500">Thanh toán nhanh qua ứng dụng MoMo</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Mã giảm giá */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-blue-600" />
                Mã giảm giá
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mã giảm giá"
                />
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Đơn hàng ({cartItems.length} sản phẩm)
              </h2>

              {/* Cart Items Preview */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=100'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-gray-500 text-xs">Size: {item.size} | SL: {item.quantity}</p>
                      <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalProductPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>
                    {finalShippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(finalShippingFee)
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {totalProductPrice >= FREE_SHIP_THRESHOLD && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Đơn hàng đủ điều kiện miễn phí vận chuyển!</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang xử lý...' : formData.paymentMethod === 'COD' ? 'Đặt hàng' : 'Thanh toán ngay'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Bằng việc đặt hàng, bạn đồng ý với điều khoản của shop
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
