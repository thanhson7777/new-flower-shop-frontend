import { motion } from 'framer-motion'
import { Flower, Truck, Award, Heart, Clock, RefreshCw } from 'lucide-react'

const features = [
  {
    icon: Flower,
    title: 'Hoa Tươi 100%',
    description: 'Hoa được nhập mỗi ngày, đảm bảo độ tươi nguyên cho khách hàng'
  },
  {
    icon: Truck,
    title: 'Giao Hàng Nhanh',
    description: 'Giao hàng trong vòng 2-4 giờ nội thành, đúng hẹn mọi lúc'
  },
  {
    icon: Award,
    title: 'Chất Lượng Đảm Bảo',
    description: 'Hơn 5 năm kinh nghiệm trong ngành hoa tươi, được khách hàng tin tưởng'
  },
  {
    icon: Heart,
    title: 'Tặng Kèm Thiệp',
    description: 'Miễn phí thiệp chúc mừng theo yêu cầu của quý khách'
  },
  {
    icon: Clock,
    title: 'Hỗ Trợ 24/7',
    description: 'Đội ngũ tư vấn luôn sẵn sàng hỗ trợ mọi lúc, mọi nơi'
  },
  {
    icon: RefreshCw,
    title: 'Đổi Trả Miễn Phí',
    description: 'Đổi trả hoặc hoàn tiền nếu sản phẩm không đạt chuẩn'
  }
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 text-sm font-medium rounded-full mb-4"
          >
            Tại sao chọn chúng tôi
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4"
          >
            TVU Shop - Đẳng Cấp Hoa Tươi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto"
          >
            Chúng tôi cam kết mang đến cho bạn những bó hoa đẹp nhất, tươi nhất với dịch vụ chuyên nghiệp
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8"
        >
          {[
            { value: '5+', label: 'Năm kinh nghiệm' },
            { value: '10K+', label: 'Khách hàng' },
            { value: '50K+', label: 'Đơn hàng' },
            { value: '98%', label: 'Hài lòng' }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-4 lg:p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
