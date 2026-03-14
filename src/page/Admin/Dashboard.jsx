import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock
} from 'lucide-react'
import { getDashboardAPI } from '~/apis'
import { Link } from 'react-router-dom'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
  }
  return labels[status] || status
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardAPI()
        if (response.success) {
          setDashboardData(response.data)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600">
        Lỗi: {error}
      </div>
    )
  }

  const stats = [
    {
      title: 'Tổng đơn hàng',
      value: dashboardData?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(dashboardData?.totalRevenue || 0),
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Sản phẩm',
      value: dashboardData?.totalProducts || 0,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Người dùng',
      value: dashboardData?.totalUsers || 0,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
        <p className="text-gray-500 mt-1">Chào mừng đến với trang quản trị</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} opacity-10`}>
                <stat.icon className={`w-8 h-8 ${stat.textColor} opacity-50`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order stats & Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái đơn hàng</h2>
          <div className="space-y-3">
            {dashboardData?.orderStatusStats?.map((status) => (
              <div key={status._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status._id)}`}>
                    {getStatusLabel(status._id)}
                  </span>
                </div>
                <span className="font-semibold text-gray-800">{status.count}</span>
              </div>
            ))}
            {!dashboardData?.orderStatusStats?.length && (
              <p className="text-gray-400 text-sm">Chưa có đơn hàng nào</p>
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
            <Link
              to="/admin/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Mã đơn</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Khách hàng</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Tổng tiền</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Trạng thái</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.recentOrders?.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <span className="text-sm font-medium text-gray-800">#{order.orderCode}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{order.userId?.displayName || 'Khách'}</p>
                        <p className="text-xs text-gray-400">{order.userId?.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
                {!dashboardData?.recentOrders?.length && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400">
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revenue chart placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Doanh thu theo thời gian</h2>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>6 tháng gần nhất</option>
            <option>3 tháng gần nhất</option>
            <option>1 tháng gần nhất</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          {dashboardData?.revenueOverTime?.length > 0 ? (
            <div className="w-full px-4">
              <div className="flex items-end justify-between h-48 gap-2">
                {dashboardData.revenueOverTime.map((item, index) => {
                  const maxRevenue = Math.max(...dashboardData.revenueOverTime.map(r => r.totalRevenue))
                  const height = maxRevenue > 0 ? (item.totalRevenue / maxRevenue) * 100 : 0
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg min-h-[4px]"
                        title={formatCurrency(item.totalRevenue)}
                      />
                      <span className="text-xs text-gray-400">
                        {new Date(item.date).getMonth() + 1}/{new Date(item.date).getFullYear().toString().slice(-2)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">Chưa có dữ liệu doanh thu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
