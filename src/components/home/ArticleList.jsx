import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Loader2 } from 'lucide-react'
import { getRecentArticlesAPI } from '~/apis'

const defaultArticles = [
  {
    _id: '1',
    name: 'Cách Bảo Quản Hoa Tươi Lâu',
    summary: 'Hướng dẫn chi tiết cách giữ hoa tươi ngon trong nhiều ngày',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600',
    createdAt: '2024-01-15'
  },
  {
    _id: '2',
    name: 'Ý Nghĩa Hoa Hồng Trong Tình Yêu',
    summary: 'Khám phá ý nghĩa đặc biệt của các loại hoa hồng',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
    createdAt: '2024-01-10'
  },
  {
    _id: '3',
    name: 'Top 10 Bó Hoa Đẹp Cho Ngày Cưới',
    summary: 'Những mẫu hoa cưới được yêu thích nhất năm 2024',
    image: 'https://images.unsplash.com/photo-1519225468359-69631e0c2b81?w=600',
    createdAt: '2024-01-05'
  }
]

export default function ArticleList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const response = await getRecentArticlesAPI(3)
        let data = response

        // Handle different API response formats
        if (response && typeof response === 'object') {
          if (Array.isArray(response.data)) {
            data = response.data
          } else if (Array.isArray(response.data?.data)) {
            data = response.data.data
          } else if (Array.isArray(response.articles)) {
            data = response.articles
          } else if (response.data?.articles) {
            data = response.data.articles
          }
        }

        if (!Array.isArray(data)) {
          console.warn('Articles API returned non-array:', response)
          setArticles(defaultArticles)
          return
        }

        setArticles(data.length > 0 ? data : defaultArticles)
      } catch (err) {
        console.error('Error fetching articles:', err)
        setArticles(defaultArticles)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
              Tin Tức & Blog
            </h2>
            <p className="text-gray-500 mt-1">
              Cập nhật những tin tức mới nhất về hoa tươi
            </p>
          </div>
          <Link
            to="/articles"
            className="hidden sm:inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={article._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={`/articles/${article._id}`} className="group block">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-md">
                    <img
                      src={article.image || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600'}
                      alt={article.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.name}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {article.summary}
                    </p>
                    <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                      Đọc tiếp <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden">
          <Link
            to="/articles"
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
