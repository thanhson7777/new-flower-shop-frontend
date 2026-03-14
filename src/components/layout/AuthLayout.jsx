import { cn } from '~/lib/utils'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Flower2 } from 'lucide-react'

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  bannerImageUrl = "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1200&auto=format&fit=crop"
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50/30 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 0.08, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute top-1/3 -right-20 w-96 h-96 bg-gradient-to-br from-teal-300 to-teal-400 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          className="absolute -bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative min-h-screen">
        {/* Ambient light effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute -bottom-24 left-12 h-[380px] w-[380px] rounded-full bg-teal-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex w-full max-w-5xl overflow-hidden rounded-3xl border border-blue-100/50 bg-white/80 shadow-xl backdrop-blur-xl"
          >
            {/* Left side - Banner */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative hidden w-1/2 overflow-hidden lg:block"
              style={{ backgroundImage: `url('${bannerImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {/* Overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-teal-500/10" />

              {/* Decorative overlay pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />

              <div className="relative flex h-full flex-col items-center justify-center px-8 py-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center text-white select-none"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center justify-center gap-3 mb-6"
                  >
                    <Flower2 className="w-12 h-12 text-blue-300" />
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-4 font-serif text-4xl font-semibold tracking-wide text-white/95 drop-shadow-lg"
                  >
                    Tiệm Hoa Tươi
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-base font-light tracking-wide text-white/80"
                  >
                    Lưu giữ hương sắc, gửi trọn yêu thương
                  </motion.p>
                </motion.div>

                {/* Decorative line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />
              </div>
            </motion.div>

            {/* Right side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2 sm:px-10 md:px-14"
            >
              <div className="w-full max-w-md">
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                  <Flower2 className="w-8 h-8 text-blue-600" />
                  <span className="font-serif text-xl font-semibold text-gray-800">Tiệm Hoa Tươi</span>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-8 text-center lg:text-left"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={cn('font-serif text-2xl font-semibold text-gray-800', !subtitle && 'mb-0')}
                  >
                    {title}
                  </motion.h2>
                  {subtitle && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="mt-2 text-sm text-gray-500"
                    >
                      {subtitle}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {children}
                </motion.div>

                {footer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-6"
                  >
                    {footer}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
