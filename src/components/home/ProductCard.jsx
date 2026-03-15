import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react'
import { addToCart } from '~/redux/cart/cartSlice'
import { toast } from 'sonner'

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!product) return null

  const {
    _id,
    name,
    images = [],
    variants = [],
    ratingAverage = 0,
    ratingQuantity = 0
  } = product

  const primaryImage = images?.[0] || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400'
  const firstVariant = variants?.[0]
  const price = firstVariant?.price || firstVariant?.referencePrice || 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      navigate('/login', { state: { from: window.location.pathname } })
      return
    }

    if (firstVariant) {
      dispatch(addToCart({
        productId: _id,
        name,
        price,
        image: primaryImage,
        size: firstVariant.size,
        quantity: 1,
        stockQuantity: firstVariant.stockQuantity
      }))
      toast.success(`Đã thêm "${name}" vào giỏ hàng!`)
    }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link to={`/products/${_id}`} className="group block">
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
            )}
            <img
              src={primaryImage}
              alt={name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Badges */}
            {product.isNew && (
              <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                Mới
              </div>
            )}
            {product.discount > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                -{product.discount}%
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={handleWishlist}
                className={`p-2.5 rounded-full shadow-lg transition-colors ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleAddToCart}
                className="p-2.5 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
                title="Thêm vào giỏ"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.location.href = `/products/${_id}`
                }}
                className="p-2.5 rounded-full bg-white text-gray-700 shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(price)}
              </span>
              {product.originalPrice && product.originalPrice > price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(ratingAverage)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">
                ({ratingQuantity || 0})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
