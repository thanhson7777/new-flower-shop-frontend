import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { getCategoriesAPI } from '~/apis'

const categoryImages = {
  'Hoa hồng': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
  'Hoa lan': 'https://images.unsplash.com/photo-1566906008954-82d534c8243c?w=400',
  'Hoa cúc': 'https://images.unsplash.com/photo-1596522354195-e84ae3c98731?w=400',
  'Hoa lily': 'https://images.unsplash.com/photo-1591189863345-9db079d96638?w=400',
  'Hoa đào': 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=400',
  'Hoa sen': 'https://images.unsplash.com/photo-1518882605630-8c7a2e38c1d8?w=400',
  'default': 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400'
}

const defaultCategories = [
  { _id: '1', name: 'Hoa hồng', description: 'Hoa tình yêu', image: categoryImages['Hoa hồng'] },
  { _id: '2', name: 'Hoa lan', description: 'Loài hoa quý', image: categoryImages['Hoa lan'] },
  { _id: '3', name: 'Hoa cúc', description: 'Hoa mùa thu', image: categoryImages['Hoa cúc'] },
  { _id: '4', name: 'Hoa lily', description: 'Hoa thơm ngát', image: categoryImages['Hoa lily'] },
  { _id: '5', name: 'Bó hoa', description: 'Mix các loại', image: categoryImages['default'] },
]

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await getCategoriesAPI()
        let data = response

        // Handle different API response formats
        if (response && typeof response === 'object') {
          if (Array.isArray(response.data)) {
            data = response.data
          } else if (Array.isArray(response.data?.data)) {
            data = response.data.data
          } else if (Array.isArray(response.categories)) {
            data = response.categories
          }
        }

        if (!Array.isArray(data)) {
          console.warn('Categories API returned non-array:', response)
          setCategories(defaultCategories)
          return
        }

        const activeCategories = data.filter(cat => cat.status !== 'inactive')
        setCategories(activeCategories.length > 0 ? activeCategories : defaultCategories)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setCategories(defaultCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getCategoryImage = (category) => {
    if (category.image) return category.image
    return categoryImages[category.name] || categoryImages['default']
  }

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-3">
            Danh Mục HOA
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Khám phá bộ sưu tập hoa tươi đa dạng của chúng tôi
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-2xl mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.slice(0, 5).map((category, index) => (
              <motion.div
                key={category._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category._id}`}
                  className="group block"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-md">
                    <img
                      src={getCategoryImage(category)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-flex items-center gap-1 text-white text-sm font-medium">
                        Xem ngay <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.description || 'Xem chi tiết'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Xem tất cả danh mục
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
