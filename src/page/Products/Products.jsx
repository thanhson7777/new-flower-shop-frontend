import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProductsWithFilterAPI, getCategoriesAPI } from '~/apis'
import { Search, Filter, X, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import ProductCard from '~/components/home/ProductCard'

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'bestseller', label: 'Bán chạy' },
  { value: 'price-asc', label: 'Giá: Thấp → Cao' },
  { value: 'price-desc', label: 'Giá: Cao → Thấp' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  // State
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)

  // Filters from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentSort = searchParams.get('sort') || 'newest'
  const currentCategory = searchParams.get('category') || ''
  const currentSearch = searchParams.get('search') || ''

  const itemsPerPage = 12
  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  // Mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesAPI()
        setCategories(res.data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await getProductsWithFilterAPI({
          page: currentPage,
          itemsPerPage,
          sort: currentSort,
          category: currentCategory,
          search: currentSearch
        })
        setProducts(res.data?.products || [])
        setTotalProducts(res.data?.totalProducts || 0)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
        setTotalProducts(0)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [currentPage, currentSort, currentCategory, currentSearch])

  // Update URL params
  const updateParams = (newParams) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    // Reset to page 1 when filter changes
    if (newParams.sort !== undefined || newParams.category !== undefined || newParams.search !== undefined) {
      params.set('page', '1')
    }
    setSearchParams(params)
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      updateParams({ page: page.toString() })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle sort change
  const handleSortChange = (e) => {
    updateParams({ sort: e.target.value })
  }

  // Handle category filter
  const handleCategoryFilter = (categoryId) => {
    if (currentCategory === categoryId) {
      updateParams({ category: '' })
    } else {
      updateParams({ category: categoryId })
    }
    setShowMobileFilters(false)
  }

  // Clear all filters
  const clearFilters = () => {
    updateParams({ category: '', search: '', sort: 'newest', page: '1' })
  }

  const hasActiveFilters = currentCategory || currentSearch

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
            Sản phẩm
          </h1>
          <p className="text-blue-100">
            Khám phá bộ sưu tập hoa tươi đẹp nhất của chúng tôi
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories Filter */}
          <aside className={`
            lg:w-1/4 fixed lg:static inset-0 z-50 lg:z-auto
            bg-white lg:bg-transparent p-6 lg:p-0
            transition-transform duration-300 lg:transition-none
            ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto lg:overflow-visible
          `}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-semibold">Bộ lọc</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">Danh mục</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter('')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    !currentCategory
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tất cả sản phẩm
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryFilter(category._id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      currentCategory === category._id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.name}</span>
                    {currentCategory === category._id && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 px-4 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}

            {/* Close button for mobile */}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="lg:hidden mt-4 w-full py-3 bg-blue-600 text-white rounded-lg"
            >
              Áp dụng
            </button>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Mobile filter button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
              >
                <Filter className="w-5 h-5" />
                Bộ lọc
              </button>

              {/* Results count */}
              <p className="text-gray-500">
                {!loading && (
                  <>Tìm thấy <span className="font-semibold text-gray-800">{totalProducts}</span> sản phẩm</>
                )}
              </p>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 whitespace-nowrap">Sắp xếp:</span>
                <select
                  value={currentSort}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {currentSearch && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Tìm: "{currentSearch}"
                    <button onClick={() => updateParams({ search: '' })}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {currentCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Danh mục: {categories.find(c => c._id === currentCategory)?.name || 'Đã chọn'}
                    <button onClick={() => updateParams({ category: '' })}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="aspect-[4/5] bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="w-10 h-10 rounded-lg hover:bg-gray-100"
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="px-2">...</span>}
                    </>
                  )}

                  {/* Pages around current */}
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    if (page >= currentPage - 2 && page <= currentPage + 2) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    }
                    return null
                  })}

                  {/* Last page */}
                  {currentPage < totalPages - 3 && (
                    <>
                      {currentPage < totalPages - 4 && <span className="px-2">...</span>}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="w-10 h-10 rounded-lg hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {showMobileFilters && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileFilters(false)}
        ></div>
      )}
    </div>
  )
}
