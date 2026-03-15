import { Link } from 'react-router-dom'
import { Flower, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react'

const footerLinks = {
  shop: [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sản phẩm', path: '/products' },
    { label: 'Giới thiệu', path: '/about' },
    { label: 'Liên hệ', path: '/contact' },
  ],
  support: [
    { label: 'Chính sách đổi trả', path: '/return-policy' },
    { label: 'Chính sách bảo mật', path: '/privacy-policy' },
    { label: 'Điều khoản dịch vụ', path: '/terms-of-service' },
    { label: 'Hướng dẫn mua hàng', path: '/how-to-buy' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'Youtube' },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <Flower className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold">TVU Shop</h2>
                <p className="text-xs text-blue-400">Hoa tươi mỗi ngày</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Chúng tôi cung cấp những bó hoa tươi nhất, đẹp nhất cho mọi dịp đặc biệt của bạn.
              Giao hàng nhanh chóng, chất lượng đảm bảo.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Hỗ trợ</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  Đường 3/2, Phường 5<br />
                  Quận Ninh Kiều, TP. Cần Thơ
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="tel:0123456789" className="hover:text-blue-400 transition-colors">
                  0123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:tvushop@example.com" className="hover:text-blue-400 transition-colors">
                  tvushop@example.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TVU Shop. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>Thiết kế với</span>
              <span className="text-blue-500">♥</span>
              <span>bởi Thanh Vũ</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
