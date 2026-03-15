import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import banner1 from '~/assets/banner/banner1.jpg'
import banner2 from '~/assets/banner/banner2.jpg'
import banner3 from '~/assets/banner/banner3.jpg'

const defaultBanners = [
  {
    id: 1,
    title: 'Giao Hoa Tươi Tận Tay',
    subtitle: 'Giảm giá 20% cho đơn hàng đầu tiên',
    description: 'Khám phá bộ sưu tập hoa tươi đẹp nhất dành cho bạn',
    cta: 'Mua ngay',
    ctaLink: '/products',
    image: banner1,
    bgColor: 'from-blue-900/90 to-blue-800/70'
  },
  {
    id: 2,
    title: 'Bó Hoa Sinh Nhật Đặc Biệt',
    subtitle: 'Miễn phí giao hàng hôm nay',
    description: 'Chọn món quà hoàn hảo cho người thân yêu',
    cta: 'Xem ngay',
    ctaLink: '/products?category=birthday',
    image: banner2,
    bgColor: 'from-pink-900/90 to-purple-900/70'
  },
  {
    id: 3,
    title: 'Hoa Cưới - Kết Trao Yêu Thương',
    subtitle: 'Giảm 30% combo hoa cưới',
    description: 'Tôn vinh ngày trọng đại của bạn với những bó hoa đẹp nhất',
    cta: 'Tìm hiểu thêm',
    ctaLink: '/products?category=wedding',
    image: banner3,
    bgColor: 'from-rose-900/90 to-pink-900/70'
  }
]

export default function HeroSection({ banners = defaultBanners }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const activeBanner = banners[currentIndex] || defaultBanners[0]

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [banners.length, isAutoPlaying])

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrev = () => {
    goToSlide(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    goToSlide((currentIndex + 1) % banners.length)
  }

  return (
    <section
      className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image with Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBanner.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeBanner.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${activeBanner.bgColor}`} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBanner.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-4"
            >
              {activeBanner.subtitle}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-4"
            >
              {activeBanner.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-white/90 mb-8"
            >
              {activeBanner.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to={activeBanner.ctaLink}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                {activeBanner.cta}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-colors"
              >
                Xem tất cả
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/40 hover:bg-white/60'
              }`}
          />
        ))}
      </div>
    </section>
  )
}
