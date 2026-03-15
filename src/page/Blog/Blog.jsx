import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getArticlesAPI } from '~/apis'
import { ArrowRight, Calendar, Loader2, Flower2 } from 'lucide-react'

export default function Blog() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await getArticlesAPI()
        const data = res.data?.data || res.data || []
        // Lọc chỉ lấy bài đã đăng
        const published = data.filter(a => a.status === 'published')
        setArticles(published)
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // Bài viết nổi bật (bài đầu tiên)
  const featuredArticle = articles[0]
  const otherArticles = articles.slice(1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flower2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog Hoa Tươi
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Khám phá thế giới hoa tươi - Từ bí quyết chăm sóc hoa đến những ý nghĩa đằng sau mỗi bó hoa
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
              Bài viết nổi bật
            </h2>
            <Link
              to={`/blog/${featuredArticle._id}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={featuredArticle.thumbnail_url || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800'}
                  alt={featuredArticle.name}
                  className="w-full h-72 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-blue-500 text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(featuredArticle.createdAt)}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {featuredArticle.name}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {featuredArticle.summary}
                </p>
                <div className="flex items-center text-blue-500 font-medium group-hover:gap-3 transition-all">
                  <span>Đọc tiếp</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Other Articles Grid */}
        {otherArticles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
              Tin tức & Bài viết
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.map((article) => (
                <Link
                  key={article._id}
                  to={`/blog/${article._id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={article.thumbnail_url || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800'}
                      alt={article.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-blue-500 text-xs mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="mt-4 flex items-center text-blue-500 text-sm font-medium">
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-16">
            <Flower2 className="w-16 h-16 text-blue-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-gray-500">
              Hãy quay lại sau để cập nhật những bài viết mới nhất!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
