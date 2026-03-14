import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FlowerLogo from '~/assets/logo/logo.svg'

export default function AuthLayout({
  children,
  brandName = 'Tiệm Hoa Tươi',
  brandTagline = 'Lưu giữ hương sắc, gửi trọn yêu thương'
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 relative overflow-hidden">
      {/* Floating flower decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right decoration */}
        <motion.div
          initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
          animate={{ opacity: 0.15, rotate: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-8 -right-8 w-40 h-40"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full text-blue-300">
            <g fill="currentColor" opacity="0.6">
              <ellipse cx="32" cy="18" rx="6" ry="12" transform="rotate(0 32 32)" />
              <ellipse cx="32" cy="18" rx="6" ry="12" transform="rotate(45 32 32)" />
              <ellipse cx="32" cy="18" rx="6" ry="12" transform="rotate(90 32 32)" />
              <ellipse cx="32" cy="18" rx="6" ry="12" transform="rotate(135 32 32)" />
              <ellipse cx="32" cy="18" rx="6" ry="12" transform="rotate(180 32 32)" />
              <ellipse cx="32" cy="18" rx="6" ry="12" transform="rotate(225 32 32)" />
              <ellipse cx="32" cy="18" rx="6" ry="12" transform="rotate(270 32 32)" />
              <ellipse cx="32" cy="18" rx="6" ry="12" transform="rotate(315 32 32)" />
            </g>
            <circle cx="32" cy="32" r="8" fill="#FFD93D" />
          </svg>
        </motion.div>

        {/* Bottom left decoration */}
        <motion.div
          initial={{ opacity: 0, rotate: 20, scale: 0.8 }}
          animate={{ opacity: 0.12, rotate: 0, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-4 -left-4 w-32 h-32"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full text-indigo-300">
            <g fill="currentColor" opacity="0.5">
              <ellipse cx="32" cy="18" rx="5" ry="10" transform="rotate(0 32 32)" />
              <ellipse cx="32" cy="18" rx="5" ry="10" transform="rotate(45 32 32)" />
              <ellipse cx="32" cy="18" rx="5" ry="10" transform="rotate(90 32 32)" />
              <ellipse cx="32" cy="18" rx="5" ry="10" transform="rotate(135 32 32)" />
              <ellipse cx="32" cy="18" rx="5" ry="10" transform="rotate(180 32 32)" />
              <ellipse cx="32" cy="18" rx="5" ry="10" transform="rotate(225 32 32)" />
              <ellipse cx="32" cy="18" rx="5" ry="10" transform="rotate(270 32 32)" />
              <ellipse cx="32" cy="18" rx="5" ry="10" transform="rotate(315 32 32)" />
            </g>
            <circle cx="32" cy="32" r="6" fill="#FF9F1C" />
          </svg>
        </motion.div>

        {/* Center decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full text-blue-200">
            <g fill="currentColor" opacity="0.4">
              <ellipse cx="32" cy="16" rx="8" ry="14" transform="rotate(0 32 32)" />
              <ellipse cx="32" cy="16" rx="8" ry="14" transform="rotate(60 32 32)" />
              <ellipse cx="32" cy="16" rx="8" ry="14" transform="rotate(120 32 32)" />
              <ellipse cx="32" cy="16" rx="8" ry="14" transform="rotate(180 32 32)" />
              <ellipse cx="32" cy="16" rx="8" ry="14" transform="rotate(240 32 32)" />
              <ellipse cx="32" cy="16" rx="8" ry="14" transform="rotate(300 32 32)" />
            </g>
            <circle cx="32" cy="32" r="10" fill="#FFD93D" />
          </svg>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8"
          >
            {/* Flower Logo SVG */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <img
                src={FlowerLogo}
                alt="Flower Logo"
                className="w-20 h-20 mx-auto drop-shadow-lg"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-serif text-3xl font-semibold text-gray-800 mb-2"
            >
              {brandName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-500 text-sm"
            >
              {brandTagline}
            </motion.p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] p-8"
          >
            {children}
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-8 text-gray-400 text-xs"
          >
            © 2026 {brandName}. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
