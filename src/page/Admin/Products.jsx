import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  X,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  Package,
  Filter
} from 'lucide-react'
import {
  getProductsAdminAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
  restoreProductAPI,
  forceDeleteProductAPI,
  getCategoriesAPI
} from '~/apis'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '~/components/ui/Dialog'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Label } from '~/components/ui/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/Select'

const STATUS_LABELS = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
  'out-of-stock': 'Hết hàng'
}

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  'out-of-stock': 'bg-red-100 text-red-700'
}

const TYPE_LABELS = {
  flower: 'Hoa',
  accessory: 'Phụ kiện'
}

// Modal thêm/sửa sản phẩm
const ProductFormModal = ({ open, onClose, product, categories, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [previewImages, setPreviewImages] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    type: 'flower',
    mainFlower: '',
    referencePrice: '',
    description: '',
    status: 'active',
    variants: [{ size: 'M', price: '', stockQuantity: 0 }],
    images: []
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        categoryId: product.categoryId || '',
        type: product.type || 'flower',
        mainFlower: product.mainFlower || '',
        referencePrice: product.referencePrice || '',
        description: product.description || '',
        status: product.status || 'active',
        variants: product.variants || [{ size: 'M', price: '', stockQuantity: 0 }],
        images: []
      })
      setPreviewImages(product.images || [])
    } else {
      setFormData({
        name: '',
        categoryId: categories[0]?._id || '',
        type: 'flower',
        mainFlower: '',
        referencePrice: '',
        description: '',
        status: 'active',
        variants: [{ size: 'M', price: '', stockQuantity: 0 }],
        images: []
      })
      setPreviewImages([])
    }
  }, [product, open, categories])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + formData.images.length > 5) {
      toast.error('Tối đa 5 hình ảnh')
      return
    }

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewImages([...previewImages, ...newPreviews])
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    })
  }

  const removeImage = (index, isExisting = false) => {
    const newPreviews = previewImages.filter((_, i) => i !== index)
    const newImages = formData.images.filter((_, i) => i !== index - (isExisting ? 0 : (previewImages.length - formData.images.length)))
    setPreviewImages(newPreviews)
    setFormData({ ...formData, images: isExisting ? [] : newImages })
  }

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: 'M', price: '', stockQuantity: 0 }]
    })
  }

  const removeVariant = (index) => {
    if (formData.variants.length <= 1) {
      toast.error('Phải có ít nhất 1 biến thể')
      return
    }
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    })
  }

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants]
    newVariants[index][field] = value
    setFormData({ ...formData, variants: newVariants })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm')
      return
    }
    if (!formData.categoryId) {
      toast.error('Vui lòng chọn danh mục')
      return
    }

    setLoading(true)
    try {
      const submitData = {
        ...formData,
        referencePrice: Number(formData.referencePrice)
      }

      if (product) {
        await updateProductAPI(product._id, submitData)
        toast.success('Cập nhật sản phẩm thành công!')
      } else {
        await createProductAPI(submitData)
        toast.success('Tạo sản phẩm thành công!')
      }
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                placeholder="Nhập tên sản phẩm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Loại</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flower">Hoa</SelectItem>
                  <SelectItem value="accessory">Phụ kiện</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainFlower">Hoa chính</Label>
              <Input
                id="mainFlower"
                placeholder="VD: Hồng đỏ"
                value={formData.mainFlower}
                onChange={(e) => setFormData({ ...formData, mainFlower: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="out-of-stock">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Giá tham khảo (VNĐ)</Label>
            <Input
              type="number"
              placeholder="VD: 350000"
              value={formData.referencePrice}
              onChange={(e) => setFormData({ ...formData, referencePrice: e.target.value })}
            />
          </div>

          {/* Variants */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Biến thể (Size, Giá, Tồn kho)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="w-4 h-4 mr-1" /> Thêm
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.variants.map((variant, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Select
                    value={variant.size}
                    onValueChange={(value) => updateVariant(index, 'size', value)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Giá"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Kho"
                    value={variant.stockQuantity}
                    onChange={(e) => updateVariant(index, 'stockQuantity', Number(e.target.value))}
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả sản phẩm"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Hình ảnh (tối đa 5)</Label>
            <div className="grid grid-cols-5 gap-2">
              {previewImages.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {previewImages.length < 5 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {product ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Modal xác nhận xóa/khôi phục
const ActionConfirmModal = ({ open, onClose, product, action, onConfirm }) => {
  const [loading, setLoading] = useState(false)

  const handleAction = async () => {
    setLoading(true)
    try {
      if (action === 'delete') {
        await deleteProductAPI(product._id)
        toast.success('Xóa sản phẩm thành công!')
      } else if (action === 'restore') {
        await restoreProductAPI(product._id)
        toast.success('Khôi phục sản phẩm thành công!')
      } else if (action === 'force') {
        await forceDeleteProductAPI(product._id)
        toast.success('Xóa vĩnh viễn thành công!')
      }
      onConfirm()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const actionConfig = {
    delete: { title: 'Xóa sản phẩm', message: `Bạn có chắc muốn xóa sản phẩm "${product?.name}"?`, color: 'red' },
    restore: { title: 'Khôi phục sản phẩm', message: `Khôi phục sản phẩm "${product?.name}"?`, color: 'green' },
    force: { title: 'Xóa vĩnh viễn', message: `Xóa vĩnh viễn sản phẩm "${product?.name}"? Không thể khôi phục!`, color: 'red' }
  }

  const config = actionConfig[action]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">{config.message}</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button
            variant="destructive"
            onClick={handleAction}
            disabled={loading}
            className={action === 'restore' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {action === 'delete' && 'Xóa'}
            {action === 'restore' && 'Khôi phục'}
            {action === 'force' && 'Xóa vĩnh viễn'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [showDeleted, setShowDeleted] = useState(false)

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [actionType, setActionType] = useState('delete')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProductsAdminAPI(),
        getCategoriesAPI()
      ])
      if (productsRes.success) {
        setProducts(productsRes.data)
      }
      if (categoriesRes.status === 'success') {
        setCategories(categoriesRes.data)
      }
    } catch (error) {
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory === 'all' || product.categoryId === filterCategory
    const matchStatus = filterStatus === 'all' || product.status === filterStatus
    const matchType = filterType === 'all' || product.type === filterType
    const matchDeleted = showDeleted || !product._destroy

    return matchSearch && matchCategory && matchStatus && matchType && matchDeleted
  })

  const handleAddNew = () => {
    setSelectedProduct(null)
    setFormModalOpen(true)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormModalOpen(true)
  }

  const handleDelete = (product) => {
    setSelectedProduct(product)
    setActionType('delete')
    setActionModalOpen(true)
  }

  const handleRestore = (product) => {
    setSelectedProduct(product)
    setActionType('restore')
    setActionModalOpen(true)
  }

  const handleForceDelete = (product) => {
    setSelectedProduct(product)
    setActionType('force')
    setActionModalOpen(true)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const getTotalStock = (variants) => {
    return variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0
  }

  const getPriceRange = (variants) => {
    if (!variants?.length) return '-'
    const prices = variants.map(v => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-gray-500">Quản lý các sản phẩm của cửa hàng</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="flower">Hoa</SelectItem>
            <SelectItem value="accessory">Phụ kiện</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
            <SelectItem value="out-of-stock">Hết hàng</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showDeleted ? 'default' : 'outline'}
          onClick={() => setShowDeleted(!showDeleted)}
          className={showDeleted ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          <Filter className="w-4 h-4 mr-2" />
          {showDeleted ? 'Đã ẩn' : 'Hiển thị đã xóa'}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>Không tìm thấy sản phẩm nào</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={product._id} className={`hover:bg-gray-50 ${product._destroy ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-full h-full p-2 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{product.name}</span>
                        {product._destroy && (
                          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded">Đã xóa</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{TYPE_LABELS[product.type]}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {categories.find(c => c._id === product.categoryId)?.name || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {getPriceRange(product.variants)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={getTotalStock(product.variants) === 0 ? 'text-red-500' : ''}>
                        {getTotalStock(product.variants)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[product.status]}`}>
                        {STATUS_LABELS[product.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {product._destroy ? (
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleRestore(product)}>
                            <RotateCcw className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleForceDelete(product)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(product)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ProductFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        product={selectedProduct}
        categories={categories}
        onSuccess={fetchData}
      />

      <ActionConfirmModal
        open={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        product={selectedProduct}
        action={actionType}
        onConfirm={fetchData}
      />
    </div>
  )
}
