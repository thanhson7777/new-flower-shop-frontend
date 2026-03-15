import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import { getNewestProductsAPI, getBestSellerProductsAPI } from '~/apis'
import ProductCard from './ProductCard'

const defaultProducts = [
  {
    _id: '1',
    name: 'Bó Hoa Hồng Đỏ Tình Yêu',
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400'],
    variants: [{ price: 350000, volume: 'Medium', stockQuantity: 10 }],
    averageRating: 4.8,
    reviewCount: 24,
    isNew: true
  },
  {
    _id: '2',
    name: 'Bó Hoa Lan Ý Ngọt Ngào',
    images: ['https://images.unsplash.com/photo-1566906008954-82d534c8243c?w=400'],
    variants: [{ price: 450000, volume: 'Large', stockQuantity: 8 }],
    averageRating: 4.9,
    reviewCount: 18,
    discount: 10
  },
  {
    _id: '3',
    name: 'Bó Hoa Cúc Mùa Thu',
    images: ['https://images.unsplash.com/photo-1596522354195-e84ae3c98731?w=400'],
    variants: [{ price: 280000, volume: 'Small', stockQuantity: 15 }],
    averageRating: 4.7,
    reviewCount: 12
  },
  {
    _id: '4',
    name: 'Bó Hoa Lily Thơm Ngát',
    images: ['https://images.unsplash.com/photo-1591189863345-9db079d96638?w=400'],
    variants: [{ price: 380000, volume: 'Medium', stockQuantity: 6 }],
    averageRating: 5.0,
    reviewCount: 8,
    isNew: true
  }
]

export default function ProductGrid({ type = 'new', title = 'Sản phẩm mới', limit = 8 }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        let response
        if (type === 'new') {
          response = await getNewestProductsAPI(limit)
        } else if (type === 'bestseller') {
          response = await getBestSellerProductsAPI(limit)
        } else {
          response = await getNewestProductsAPI(limit)
        }

        let data = response

        // Handle different API response formats
        if (response && typeof response === 'object') {
          if (Array.isArray(response.data)) {
            data = response.data
          } else if (Array.isArray(response.data?.data)) {
            data = response.data.data
          } else if (Array.isArray(response.products)) {
            data = response.products
          } else if (response.data?.products) {
            data = response.data.products
          }
        }

        if (!Array.isArray(data)) {
          console.warn('Products API returned non-array:', response)
          setProducts(defaultProducts)
          return
        }

        setProducts(data.length > 0 ? data : defaultProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err.message)
        setProducts(defaultProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [type, limit])

  const getViewAllLink = () => {
    if (type === 'new') return '/products?sort=newest'
    if (type === 'bestseller') return '/products?sort=bestseller'
    return '/products'
  }

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
              {title}
            </h2>
            <p className="text-gray-500 mt-1">
              {type === 'new'
                ? 'Những sản phẩm mới nhất của chúng tôi'
                : 'Những sản phẩm được yêu thích nhất'}
            </p>
          </div>
          <Link
            to={getViewAllLink()}
            className="hidden sm:inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product._id || index} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden">
          <Link
            to={getViewAllLink()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-full"
          >
            Xem tất cả
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
