import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductByIdAPI, getRelatedProductsAPI } from '~/apis'
import { addToCart as addToCartAction } from '~/redux/cart/cartSlice'
import { useWishlist } from '~/contexts/WishlistContext'
import { Star, Heart, ShoppingCart, Minus, Plus, ChevronRight, Check } from 'lucide-react'

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await getProductByIdAPI(id)
        setProduct(res.data)
        // Set default size to first variant
        if (res.data?.variants?.length > 0) {
          setSelectedSize(res.data.variants[0])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      if (product?.categoryId) {
        try {
          const res = await getRelatedProductsAPI(id, product.categoryId, 4)
          setRelatedProducts(res.data || [])
        } catch (error) {
          console.error('Error fetching related products:', error)
        }
      }
    }
    if (product) {
      fetchRelated()
    }
  }, [product, id])

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize) return
    dispatch(addToCartAction({
      productId: product._id,
      name: product.name,
      image: product.images?.[0] || product.image,
      volume: selectedSize.size,
      price: selectedSize.price,
      quantity: quantity
    }))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  // Handle wishlist
  const handleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist({
        productId: product._id,
        name: product.name,
        image: product.images?.[0] || product.image,
        price: selectedSize?.price || product.referencePrice
      })
    }
  }

  // Get selected variant price
  const currentPrice = selectedSize?.price || product?.referencePrice

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Không tìm thấy sản phẩm</h2>
          <Link to="/products" className="text-blue-600 hover:underline">Quay lại trang sản phẩm</Link>
        </div>
      </div>
    )
  }

  const images = product.images?.length > 0 ? product.images : [product.image].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-blue-600">Sản phẩm</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image with Zoom */}
              <div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={(e) => {
                  if (!isZoomed) return
                  const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - left) / width) * 100
                  const y = ((e.clientY - top) / height) * 100
                  e.currentTarget.style.setProperty('--zoom-x', `${x}%`)
                  e.currentTarget.style.setProperty('--zoom-y', `${y}%`)
                }}
              >
                <img
                  src={images[selectedImage] || '/placeholder.jpg'}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                  style={isZoomed ? { transformOrigin: 'var(--zoom-x, 50%) var(--zoom-y, 50%)' } : {}}
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(product.ratingAverage || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500">({product.ratingQuantity || 0} đánh giá)</span>
                </div>
              </div>

              {/* Main Price Display */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600">{formatPrice(currentPrice)}</span>
                {selectedSize?.price && product.variants?.length > 1 && (
                  <span className="text-gray-400 line-through">{formatPrice(product.referencePrice)}</span>
                )}
              </div>

              {/* Price by Size */}
              <div className="space-y-3">
                <p className="font-medium text-gray-700">Chọn kích thước:</p>
                <div className="flex flex-wrap gap-3">
                  {product.variants?.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => setSelectedSize(variant)}
                      disabled={variant.stockQuantity === 0}
                      className={`relative px-6 py-3 rounded-xl border-2 transition-all ${
                        selectedSize?.size === variant.size
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : variant.stockQuantity === 0
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <span className="font-semibold">{variant.size}</span>
                      <span className="ml-2 text-blue-600">{formatPrice(variant.price)}</span>
                      {variant.stockQuantity > 0 && variant.stockQuantity <= 5 && (
                        <span className="absolute -top-2 -right-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                          Còn {variant.stockQuantity}
                        </span>
                      )}
                      {variant.stockQuantity === 0 && (
                        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                          Hết hàng
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || selectedSize.stockQuantity === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-semibold transition-all ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Đã thêm vào giỏ
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Thêm vào giỏ
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlist}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isInWishlist(product._id)
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Stock Info */}
              {selectedSize && (
                <div className="text-sm text-gray-500">
                  {selectedSize.stockQuantity > 0 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Còn hàng ({selectedSize.stockQuantity} sản phẩm)
                    </span>
                  ) : (
                    <span className="text-red-500">Hết hàng</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t p-6 lg:p-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mô tả sản phẩm</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="border-t p-6 lg:p-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Đánh giá sản phẩm</h2>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{product.ratingAverage?.toFixed(1) || 0}</span>
                <span className="text-gray-500">({product.totalReviews || 0} đánh giá)</span>
              </div>
            </div>

            {product.recentReviews?.length > 0 ? (
              <div className="space-y-4">
                {product.recentReviews.map((review) => (
                  <div key={review._id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {review.userId?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{review.userId?.name || 'Khách hàng'}</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-gray-400 text-sm ml-2">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Chưa có đánh giá nào</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <RelatedProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Related Product Card Component
function RelatedProductCard({ product }) {
  const dispatch = useDispatch()
  const { addToWishlist, isInWishlist } = useWishlist()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const mainImage = product.images?.[0] || product.image

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={mainImage || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(product.referencePrice)}
          </span>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.preventDefault()
                addToWishlist({
                  productId: product._id,
                  name: product.name,
                  image: mainImage,
                  price: product.referencePrice
                })
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                dispatch(addToCartAction({
                  productId: product._id,
                  name: product.name,
                  image: mainImage,
                  volume: product.variants?.[0]?.size || 'M',
                  price: product.variants?.[0]?.price || product.referencePrice,
                  quantity: 1
                }))
              }}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
