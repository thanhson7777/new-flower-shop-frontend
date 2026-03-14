import { publicAxiosInstance, authorizeAxiosInstance } from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'


export const registerUserAPI = async (data) => {
  const response = await publicAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await publicAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await publicAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}

export const loginUserAPI = async (data) => {
  const response = await publicAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
  return response.data
}

export const logoutUserAPI = async () => {
  const response = await publicAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
  return response.data
}

export const getDashboardAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/dashboard`)
  return response.data
}

export const getCategoriesAPI = async () => {
  const response = await publicAxiosInstance.get(`${API_ROOT}/v1/categories`)
  return response.data
}

export const getCategoryByIdAPI = async (id) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/categories/${id}`)
  return response.data
}

export const createCategoryAPI = async (data) => {
  const formData = new FormData()
  if (data.name) formData.append('name', data.name)
  if (data.description) formData.append('description', data.description)
  if (data.image) formData.append('image', data.image)

  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/categories`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const updateCategoryAPI = async (id, data) => {
  const formData = new FormData()
  if (data.name) formData.append('name', data.name)
  if (data.description) formData.append('description', data.description)
  if (data.image) formData.append('image', data.image)

  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const deleteCategoryAPI = async (id) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/categories/${id}`)
  return response.data
}

export const getProductsAdminAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/products/admin`)
  return response.data
}

export const getProductByIdAPI = async (id) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/products/${id}`)
  return response.data
}

export const getProductsAPI = async () => {
  const response = await publicAxiosInstance.get(`${API_ROOT}/v1/products`)
  return response.data
}

export const createProductAPI = async (data) => {
  const formData = new FormData()
  if (data.name) formData.append('name', data.name)
  if (data.categoryId) formData.append('categoryId', data.categoryId)
  if (data.type) formData.append('type', data.type)
  if (data.mainFlower) formData.append('mainFlower', data.mainFlower)
  if (data.referencePrice) formData.append('referencePrice', data.referencePrice)
  if (data.description) formData.append('description', data.description)
  if (data.status) formData.append('status', data.status)
  if (data.variants) formData.append('variants', JSON.stringify(data.variants))

  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('image', image)
    })
  }

  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/products/admin`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const updateProductAPI = async (id, data) => {
  const formData = new FormData()
  if (data.name) formData.append('name', data.name)
  if (data.categoryId) formData.append('categoryId', data.categoryId)
  if (data.type) formData.append('type', data.type)
  if (data.mainFlower) formData.append('mainFlower', data.mainFlower)
  if (data.referencePrice) formData.append('referencePrice', data.referencePrice)
  if (data.description) formData.append('description', data.description)
  if (data.status) formData.append('status', data.status)
  if (data.variants) formData.append('variants', JSON.stringify(data.variants))

  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('image', image)
    })
  }

  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const deleteProductAPI = async (id) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/products/${id}`)
  return response.data
}

export const restoreProductAPI = async (id) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/products/admin/${id}/restore`)
  return response.data
}

export const forceDeleteProductAPI = async (id) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/products/admin/${id}/force`)
  return response.data
}

// User APIs
export const getUsersAPI = async ({ page = 1, limit = 10, role = 'ALL', isActive = 'ALL' } = {}) => {
  const params = new URLSearchParams()
  params.append('page', page)
  params.append('limit', limit)
  if (role && role !== 'ALL') params.append('role', role)
  if (isActive && isActive !== 'ALL') params.append('isActive', isActive)

  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users?${params.toString()}`)
  return response.data
}

export const getUserByIdAPI = async (id) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users/${id}`)
  return response.data
}

export const updateUserStatusAPI = async (id, data) => {
  const response = await authorizeAxiosInstance.patch(`${API_ROOT}/v1/users/${id}/status`, data)
  return response.data
}

export const changePasswordAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/change-password`, data)
  return response.data
}

// Coupon APIs
export const getCouponsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/coupons`)
  return response.data
}

export const getValidCouponsAPI = async () => {
  const response = await publicAxiosInstance.get(`${API_ROOT}/v1/coupons/active`)
  return response.data
}

export const applyCouponAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/coupons/check`, data)
  return response.data
}

export const getCouponByIdAPI = async (id) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/coupons/${id}`)
  return response.data
}

export const createCouponAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/coupons`, data)
  return response.data
}

export const updateCouponAPI = async (id, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/coupons/${id}`, data)
  return response.data
}

export const deleteCouponAPI = async (id) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/coupons/${id}`)
  return response.data
}

// Order APIs
export const getOrdersAdminAPI = async ({ page = 1, limit = 10, status = 'ALL' } = {}) => {
  const params = new URLSearchParams()
  params.append('page', page)
  params.append('limit', limit)
  if (status && status !== 'ALL') params.append('status', status)

  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/orders/admin?${params.toString()}`)
  return response.data
}

export const getOrderByIdAPI = async (id) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/orders/${id}`)
  return response.data
}

export const updateOrderStatusAPI = async (id, status) => {
  const response = await authorizeAxiosInstance.patch(`${API_ROOT}/v1/orders/admin/${id}/status`, { status })
  return response.data
}

// Article APIs
export const getArticlesAPI = async () => {
  const response = await publicAxiosInstance.get(`${API_ROOT}/v1/articles`)
  return response.data
}

export const getArticleByIdAPI = async (id) => {
  const response = await publicAxiosInstance.get(`${API_ROOT}/v1/articles/${id}`)
  return response.data
}

export const getArticlesAdminAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/articles`)
  return response.data
}

export const createArticleAPI = async (data) => {
  // Nếu data đã là FormData, sử dụng trực tiếp
  let formData
  if (data instanceof FormData) {
    formData = data
  } else {
    formData = new FormData()
    if (data.name) formData.append('name', data.name)
    if (data.slug) formData.append('slug', data.slug)
    if (data.summary) formData.append('summary', data.summary)
    if (data.content) formData.append('content', data.content)
    if (data.status) formData.append('status', data.status)
    if (data.image) formData.append('image', data.image)
  }

  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/articles`, formData)
  return response.data
}

export const updateArticleAPI = async (id, data) => {
  // Nếu data đã là FormData, sử dụng trực tiếp
  let formData
  if (data instanceof FormData) {
    formData = data
  } else {
    formData = new FormData()
    if (data.name) formData.append('name', data.name)
    if (data.slug) formData.append('slug', data.slug)
    if (data.summary) formData.append('summary', data.summary)
    if (data.content) formData.append('content', data.content)
    if (data.status) formData.append('status', data.status)
    if (data.image) formData.append('image', data.image)
  }

  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/articles/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const deleteArticleAPI = async (id) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/articles/${id}`)
  return response.data
}

// Contact APIs
export const createContactAPI = async (data) => {
  const response = await publicAxiosInstance.post(`${API_ROOT}/v1/contacts/public`, data)
  return response.data
}

export const getContactsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/contacts`)
  return response.data
}

export const updateContactAPI = async (id, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/contacts/${id}`, data)
  return response.data
}

export const deleteContactAPI = async (id) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/contacts/${id}`)
  return response.data
}

// Review APIs
export const getReviewsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/reviews/admin`)
  return response.data
}

export const getPublicReviewsAPI = async (limit = 6) => {
  const response = await publicAxiosInstance.get(`${API_ROOT}/v1/reviews/public?limit=${limit}`)
  return response.data
}

export const getReviewByIdAPI = async (id) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/reviews/admin/${id}`)
  return response.data
}

export const updateReviewAPI = async (id, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/reviews/admin/${id}`, data)
  return response.data
}

export const deleteReviewAPI = async (id) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/reviews/admin/${id}`)
  return response.data
}

// Cart APIs
export const getCartAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/cart`)
  return response.data
}

export const addToCartAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/cart/add`, data)
  return response.data
}

export const updateCartAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/cart/update`, data)
  return response.data
}

export const removeFromCartAPI = async (data) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/cart/remove`, { data })
  return response.data
}

export const syncCartAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/cart/sync`, data)
  return response.data
}

export const createOrderAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/orders`, data)
  return response.data
}

export const getMyOrdersAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/orders/me`)
  return response.data
}

export const cancelOrderAPI = async (orderId) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/orders/${orderId}/cancel`)
  return response.data
}

export const getProvincesAPI = async () => {
  const response = await publicAxiosInstance.get(`${API_ROOT}/v1/locations/provinces`)
  return response.data
}

export const getDistrictsAPI = async (provinceCode) => {
  const response = await publicAxiosInstance.get(`${API_ROOT}/v1/locations/districts/${provinceCode}`)
  return response.data
}

export const getWardsAPI = async (districtCode) => {
  const response = await publicAxiosInstance.get(`${API_ROOT}/v1/locations/wards/${districtCode}`)
  return response.data
}
