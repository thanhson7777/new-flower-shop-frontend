import { MapPin, Phone, Mail, Clock, Flower2, Heart, Truck, Award, Users } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-center items-center text-center">
          <div className="mb-6">
            <Flower2 className="w-16 h-16 text-white mx-auto" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Về Shop Hoa Tươi
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl">
            Mang vẻ đẹp của thiên nhiên đến ngôi nhà của bạn
          </p>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Chúng tôi yêu hoa,<br />
              <span className="text-blue-500">yêu cuộc sống</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              <strong>Shop Hoa Tươi</strong> là điểm đến lý tưởng cho những ai đam mê vẻ đẹp của hoa tươi.
              Chúng tôi chuyên cung cấp các loại hoa tươi chất lượng cao, được tuyển chọn kỹ lưỡng từ các vườn hoa uy tín.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Với sứ mệnh mang đến niềm vui và sự hài lòng cho khách hàng, chúng tôi không ngừng cải tiến
              và sáng tạo trong từng bó hoa, từng arrangement để tạo ra những tác phẩm nghệ thuật độc đáo.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-500" />
              </div>
              <span className="font-medium text-gray-700">Tận tâm với từng bó hoa</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=500&fit=crop"
              alt="Hoa tươi"
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=500&fit=crop"
              alt="Shop hoa"
              className="w-full h-64 object-cover rounded-2xl shadow-lg mt-8"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">5+</div>
              <div className="text-white/80">Năm kinh nghiệm</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flower2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/80">Loại hoa</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-white/80">Khách hàng</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">8000+</div>
              <div className="text-white/80">Đơn hàng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Tại sao chọn <span className="text-blue-500">Shop Hoa Tươi</span>?
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Chúng tôi cam kết mang đến cho bạn những bó hoa tươi đẹp nhất với dịch vụ tận tâm
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flower2 className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Hoa tươi 100%</h3>
            <p className="text-gray-600">
              Tất cả hoa đều được nhập mới mỗi ngày, đảm bảo độ tươi và thẩm mỹ cao nhất.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Giao hàng nhanh</h3>
            <p className="text-gray-600">
              Giao hàng tận nơi, đúng hẹn với đội ngũ giao vận chuyên nghiệp.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tận tâm phục vụ</h3>
            <p className="text-gray-600">
              Đội ngũ nhân viên nhiệt tình, luôn lắng nghe và hỗ trợ khách hàng 24/7.
            </p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Dịch vụ của <span className="text-blue-500">chúng tôi</span>
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Đa dạng dịch vụ để đáp ứng mọi nhu cầu của khách hàng
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Flower2 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Hoa cưới</h3>
              <p className="text-gray-600 text-sm">
                Hoa cầm cô dâu, trang trí tiệc cưới, hoa phụ dam
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Hoa sinh nhật</h3>
              <p className="text-gray-600 text-sm">
                Bó hoa tươi, hộp hoa, lẵng hoa sinh nhật đẹp
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Hoa khai trương</h3>
              <p className="text-gray-600 text-sm">
                Lẵng hoa khai trương, trang trí không gian
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Hoa tang lễ</h3>
              <p className="text-gray-600 text-sm">
                Vòng hoa, bó hoa tang lễ trang nhã
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Liên hệ <span className="text-blue-500">với chúng tôi</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Địa chỉ</h3>
            <p className="text-gray-600 text-sm">
              123 Đường Nguyễn Trãi,<br />Quận 1, TP. HCM
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Điện thoại</h3>
            <p className="text-gray-600 text-sm">
              0901 234 567<br />
              028 1234 5678
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Email</h3>
            <p className="text-gray-600 text-sm">
              contact@hoatuoi.com<br />
              info@hoatuoi.com
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Giờ mở cửa</h3>
            <p className="text-gray-600 text-sm">
              Thứ 2 - Chủ nhật<br />
              7:00 - 21:00
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng đặt hoa ngay?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Hãy để chúng tôi mang vẻ đẹp của hoa tươi đến với bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="px-8 py-3 bg-white text-blue-500 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Xem sản phẩm
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Liên hệ ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
