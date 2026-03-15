import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArticleByIdAPI } from '~/apis'
import { ArrowLeft, Calendar, Loader2, Flower2, Clock, User } from 'lucide-react'

export default function BlogDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await getArticleByIdAPI(id)
        const data = res.data?.data || res.data
        setArticle(data)
      } catch (err) {
        console.error('Error fetching article:', err)
        setError('Không thể tải bài viết')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return `${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Flower2 className="w-16 h-16 text-blue-200 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {error || 'Bài viết không tồn tại'}
        </h2>
        <Link
          to="/blog"
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          Quay lại blog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại blog</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {article.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>5 phút đọc</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Featured Image */}
        {article.thumbnail_url && (
          <div className="mb-8">
            <img
              src={article.thumbnail_url}
              alt={article.name}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Summary */}
        {article.summary && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-8">
            <p className="text-gray-700 text-lg italic leading-relaxed">
              {article.summary}
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <div
            className="article-content text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại blog</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
