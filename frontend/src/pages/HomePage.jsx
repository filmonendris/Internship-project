import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, MapPin, Clock, Phone } from 'lucide-react'
import Button from '../components/ui/Button'
import ProductCard from '../components/menu/ProductCard'
import ProductModal from '../components/menu/ProductModal'
import LocationsMap from '../components/locations/LocationsMap'
import productService from '../services/productService'
import branchService from '../services/branchService'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    document.title = 'WOW Burger — Welcome'

    // Fetch some featured products (e.g., Wow Special Burger, Pizza, Wrap)
    productService.getAll()
      .then(allProducts => {
        if (!Array.isArray(allProducts)) return
        // Pick top items if available, or fall back to first available items
        const featured = allProducts.filter(p => [1, 11, 22, 39].includes(p.id))
        setFeaturedProducts(featured.length >= 2 ? featured : allProducts.slice(0, 4))
      })
      .catch(err => {
        console.error('Failed to load products for homepage:', err)
      })

    // Fetch branches
    branchService.getAll()
      .then(b => {
        if (Array.isArray(b)) setBranches(b)
      })
      .catch(err => {
        console.error('Failed to load branches for homepage:', err)
      })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative w-full h-[600px] sm:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="Delicious Wow Burger"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for readability in both themes */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            The Best Burgers in <span className="text-primary-500">Addis Ababa</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium">
            Experience the ultimate taste of our signature burgers, freshly baked pizzas, and crispy chicken wraps. Fast, fresh, and WOW!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/branch/1">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Order Now <ChevronRight size={20} />
              </Button>
            </Link>
            <a href="#locations">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
                Find a Branch
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Featured Menu ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black section-title mb-4">WOW Favorites</h2>
          <p className="text-surface-muted max-w-2xl mx-auto">
            Discover our most loved items. Made fresh to order with premium ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onView={setSelectedProduct}
              branchId={1}
            />
          ))}
        </div>
      </section>

      {/* ── Branches / Locations ── */}
      <section id="locations" className="py-20 bg-brand-card border-y border-brand-border">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black section-title mb-4">Our Locations</h2>
            <p className="text-surface-muted max-w-2xl mx-auto">
              Visit us at one of our branches across Addis Ababa or order online for quick pickup.
            </p>
          </div>

          <LocationsMap />
        </div>
      </section>

      {/* Product Modal for Featured Items */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          branchId={1}
        />
      )}
    </div>
  )
}
