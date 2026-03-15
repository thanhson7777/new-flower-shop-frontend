import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, AlertCircle, ShoppingBag } from 'lucide-react'
import { getCartAPI, updateCartAPI, removeFromCartAPI, syncCartAPI } from '~/apis'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCartItems, removeFromCart as removeFromCartAction, updateQuantity as updateQuantityAction } from '~/redux/cart/cartSlice'

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default function Cart() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const reduxCartItems = useSelector(selectCartItems)

  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (currentUser) {
      fetchCart()
    } else {
      setLoading(false)
    }
  }, [currentUser])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await getCartAPI()
      const cartData = response.data?.data || response.data
      const apiItems = cartData?.items || []

      // Nếu API trả về rỗng nhưng Redux có dữ liệu → đồng bộ Redux lên backend
      if (apiItems.length === 0 && reduxCartItems.length > 0) {
        const syncPayload = reduxCartItems.map((item) => ({
          productId: String(item.productId),
          size: String(item.size).trim(),
          quantity: Number(item.quantity) || 1
        }))
        try {
          const syncResponse = await syncCartAPI({ items: syncPayload })
          const synced = syncResponse.data?.data || syncResponse.data
          setCart(synced)
          return
        } catch (syncErr) {
          console.error('Sync cart error:', syncErr)
        }
      }

      setCart(cartData)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (productId, size, newQuantity) => {
    if (newQuantity < 1) return

    try {
      setUpdating(true)
      const response = await updateCartAPI({ productId, size, quantity: newQuantity })
      setCart(response.data?.data || response.data)
      // Cập nhật Redux
      dispatch(updateQuantityAction({ productId, size, quantity: newQuantity }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setUpdating(false)
    }
  }

  const handleRemoveItem = async (productId, size) => {
    try {
      setUpdating(true)
      const response = await removeFromCartAPI({ productId, size })
      setCart(response.data?.data || response.data)
      // Cập nhật Redux
      dispatch(removeFromCartAction({ productId, size }))
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xóa thất bại')
    } finally {
      setUpdating(false)
    }
  }

  const FREE_SHIP_THRESHOLD = 500000
  const SHIPPING_FEE = 30000

  const calculateTotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateShippingFee = () => {
    const total = calculateTotal()
    if (total >= FREE_SHIP_THRESHOLD) {
      return 0
    }
    return SHIPPING_FEE
  }

  const calculateTotalWithShipping = () => {
    return calculateTotal() + calculateShippingFee()
  }

  const calculateTotalItems = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Vui lòng đăng nhập để xem giỏ hàng của bạn</p>
          <button
            onClick={() => navigate('/login', { state: { from: '/cart' } })}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const cartItems = cart?.items || []
  const total = calculateTotal()
  const totalItems = calculateTotalItems()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <p className="text-gray-500 mt-1">
            {totalItems > 0 ? `${totalItems} sản phẩm trong giỏ` : 'Giỏ hàng trống'}
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ShoppingBag className="w-5 h-5" />
            Tiếp tục mua sắm
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Khám phá sản phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.productId}`} className="block">
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm mt-1">Size: {item.size}</p>

                  {/* Stock Warning */}
                  {item.stockQuantity <= 5 && item.stockQuantity > 0 && (
                    <p className="text-orange-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Chỉ còn {item.stockQuantity} sản phẩm
                    </p>
                  )}
                  {item.stockQuantity === 0 && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Sản phẩm đã hết hàng
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity - 1)}
                        disabled={updating || item.quantity <= 1}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity + 1)}
                        disabled={updating || item.quantity >= item.stockQuantity}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-blue-600 text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-gray-400 text-sm">{formatPrice(item.price)}/sản phẩm</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.productId, item.size)}
                  disabled={updating}
                  className="self-start p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng quan đơn hàng</h2>

              <div className="space-y-3 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className={calculateShippingFee() === 0 ? 'text-green-600' : ''}>
                    {calculateShippingFee() === 0 ? 'Miễn phí' : formatPrice(calculateShippingFee())}
                  </span>
                </div>
                {calculateTotal() < FREE_SHIP_THRESHOLD && (
                  <div className="text-xs text-gray-400">
                    Mua thêm {formatPrice(FREE_SHIP_THRESHOLD - calculateTotal())} để được miễn phí vận chuyển
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-blue-600">{formatPrice(calculateTotalWithShipping())}</span>
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { cartItems } })}
                disabled={cartItems.some(item => item.stockQuantity === 0) || updating}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiến hành đặt hàng
                <ArrowRight className="w-5 h-5" />
              </button>

              {cartItems.some(item => item.stockQuantity === 0) && (
                <p className="text-red-500 text-sm mt-3 text-center">
                  Vui lòng xóa sản phẩm hết hàng để tiếp tục
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
