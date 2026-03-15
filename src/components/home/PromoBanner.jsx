import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gift, ArrowRight } from 'lucide-react'

export default function PromoBanner() {
  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 shadow-xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full opacity-50" />
            <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-white rounded-full opacity-30" />
          </div>

          {/* Content */}
          <div className="relative px-6 py-10 md:px-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Icon & Text */}
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex w-20 h-20 bg-white/20 rounded-2xl items-center justify-center">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-white text-sm font-medium mb-3">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Khuyến mãi đặc biệt
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                  Giảm 20% Đơn Hàng Đầu Tiên
                </h2>
                <p className="text-blue-100 text-lg">
                  Đăng ký ngay để nhận ưu đãi dành riêng cho bạn
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors shadow-lg"
              >
                Đăng ký ngay
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                Xem sản phẩm
              </Link>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-24 h-24 bg-white/10 rounded-full flex items-center justify-center rotate-12">
            <span className="text-white font-bold text-lg">-20%</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
