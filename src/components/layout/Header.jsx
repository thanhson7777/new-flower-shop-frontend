import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  Flower,
  Bell,
  Loader2,
  ArrowRight
} from 'lucide-react'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { searchProductsAPI } from '~/apis'

const navLinks = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Sản phẩm', path: '/products' },
  { label: 'Blog', path: '/blog' },
  { label: 'Giới thiệu', path: '/about' },
  { label: 'Liên hệ', path: '/contact' },
]

export default function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const cartItems = useSelector((state) => state.cart?.items || [])

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const searchRef = useRef(null)
  const searchQueryRef = useRef(searchQuery)

  searchQueryRef.current = searchQuery

  // Chỉ đếm số dòng sản phẩm (distinct items), không đếm tổng số lượng
  const cartCount = cartItems.length

  // Debounced search – chỉ cập nhật kết quả nếu response đúng với từ khóa hiện tại (tránh race condition)
  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = searchQuery.trim()
      if (query.length >= 2) {
        const queryAtRequest = query
        setSearchResults([])
        setSearchLoading(true)
        try {
          const response = await searchProductsAPI(queryAtRequest, 5)
          // Chỉ áp dụng kết quả nếu người dùng chưa đổi từ khóa (tránh kết quả cũ ghi đè)
          if (searchQueryRef.current.trim() !== queryAtRequest) return
          let data = []
          // Backend trả về { success, message, data: { products, totalProducts } }
          if (response?.data?.products) {
            data = response.data.products
          } else if (response?.data?.data?.products) {
            data = response.data.data.products
          } else if (Array.isArray(response?.data)) {
            data = response.data
          } else if (Array.isArray(response?.data?.data)) {
            data = response.data.data
          } else if (Array.isArray(response?.products)) {
            data = response.products
          }
          setSearchResults(Array.isArray(data) ? data : [])
          setHasSearched(true)
        } catch (error) {
          if (searchQueryRef.current.trim() !== queryAtRequest) return
          console.error('Search error:', error)
          setSearchResults([])
          setHasSearched(true)
        } finally {
          if (searchQueryRef.current.trim() === queryAtRequest) {
            setSearchLoading(false)
          }
        }
      } else {
        setSearchResults([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleResultClick = (productId) => {
    navigate(`/products/${productId}`)
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
  }

  const handleViewAll = () => {
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserAPI()).unwrap()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
              <Flower className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-serif font-semibold text-gray-800">TVU Shop</h1>
              <p className="text-xs text-blue-500">Hoa tươi mỗi ngày</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Search, Cart, User */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search with Autocomplete */}
            <div ref={searchRef} className="hidden md:block relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm hoa..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSearchResults(true)
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                  {searchLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
                  )}
                </div>
              </form>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchQuery.trim().length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    {searchResults.length > 0 ? (
                      <>
                        {searchResults.map((product) => (
                          <button
                            key={product._id}
                            onClick={() => handleResultClick(product._id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                          >
                            <img
                              src={product.images?.[0] || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=50'}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-blue-600 font-medium">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(product.variants?.[0]?.price || 0)}
                              </p>
                            </div>
                          </button>
                        ))}
                        <button
                          onClick={handleViewAll}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          Xem tất cả kết quả
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    ) : hasSearched ? (
                      <div className="px-4 py-6 text-center text-gray-500 text-sm">
                        Không tìm thấy sản phẩm nào phù hợp
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => navigate('/products')}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 hover:bg-blue-50 rounded-full transition-colors"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.displayName}
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-medium">
                      {currentUser.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-blue-100 shadow-lg py-2 z-20"
                      >
                        <div className="px-4 py-2 border-b border-blue-100">
                          <p className="text-sm font-medium text-gray-800">
                            {currentUser.displayName}
                          </p>
                          <p className="text-xs text-gray-500">{currentUser.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          <User className="w-4 h-4" />
                          Tài khoản của tôi
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          <Package className="w-4 h-4" />
                          Đơn hàng của tôi
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          <Settings className="w-4 h-4" />
                          Cài đặt
                        </Link>
                        {currentUser.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                          >
                            <Settings className="w-4 h-4" />
                            Quản lý shop
                          </Link>
                        )}
                        <div className="border-t border-blue-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <User className="w-4 h-4" />
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-blue-100"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
              {!currentUser && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg"
                >
                  Đăng nhập
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
