import { useEffect, useState } from 'react'
import HeroSection from '~/components/home/HeroSection'
import CategoryList from '~/components/home/CategoryList'
import ProductGrid from '~/components/home/ProductGrid'
import PromoBanner from '~/components/home/PromoBanner'
import WhyChooseUs from '~/components/home/WhyChooseUs'
import ArticleList from '~/components/home/ArticleList'
import Newsletter from '~/components/home/Newsletter'

export default function Home() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching banners from API
    // In production, you would call an API like getBannersAPI()
    const fetchBanners = async () => {
      try {
        setLoading(true)
        // Simulated delay
        await new Promise(resolve => setTimeout(resolve, 500))
        // If no banners from API, HeroSection will use defaultBanners
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner Slider */}
      <HeroSection banners={banners.length > 0 ? banners : undefined} />

      {/* Categories */}
      <CategoryList />

      {/* New Products */}
      <ProductGrid
        type="new"
        title="Sản Phẩm Mới"
        limit={8}
      />

      {/* Promo Banner */}
      <PromoBanner />

      {/* Best Sellers */}
      <ProductGrid
        type="bestseller"
        title="Sản Phẩm Bán Chạy"
        limit={8}
      />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Articles / Blog */}
      <ArticleList />

      {/* Newsletter */}
      <Newsletter />
    </div>
  )
}
