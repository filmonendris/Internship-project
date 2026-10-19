import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Search, X, Info, MapPin } from 'lucide-react'
import WowLogo from '../components/ui/WowLogo'
import CategoryTabs from '../components/menu/CategoryTabs'
import ProductCard from '../components/menu/ProductCard'
import ProductModal from '../components/menu/ProductModal'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import EmptyState from '../components/ui/EmptyState'
import branchService from '../services/branchService'
import categoryService from '../services/categoryService'
import productService from '../services/productService'

export default function BranchMenuPage() {
  const { branchId }                      = useParams()
  const [searchParams, setSearchParams]   = useSearchParams()

  const [branch, setBranch]               = useState(null)
  const [categories, setCategories]       = useState([])
  const [products, setProducts]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [search, setSearch]               = useState('')

  // Active category from URL query param
  const activeCategoryId = searchParams.get('category')
    ? Number(searchParams.get('category'))
    : null

  function setActiveCategory(id) {
    if (id === null) {
      searchParams.delete('category')
    } else {
      searchParams.set('category', id)
    }
    setSearchParams(searchParams)
  }

  // BUG-04: fetchData defined inside useEffect to satisfy exhaustive-deps rule.
  // Previously it was defined outside and omitted from the dep array, causing a lint warning.
  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const [b, cats, prods] = await Promise.all([
          branchService.getById(branchId),
          categoryService.getByBranch(branchId),
          productService.getByBranch(branchId),
        ])
        if (cancelled) return
        setBranch(b)
        // Filter out the "All" pseudo-category from mock (handled in UI via "All" tab)
        setCategories(cats.filter((c) => c.name !== 'All'))
        setProducts(prods)
      } catch (err) {
        if (!cancelled) setError('Failed to load the menu. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    document.title = `WOW Burger — Branch ${branchId} Menu`
    return () => { cancelled = true }
  }, [branchId])

  // Filter products by category + search
  const filtered = useMemo(() => {
    // BUG-10: removed `|| true` which was neutralising the isAvailable filter entirely.
    // Products that are unavailable still appear in the grid but show the "Unavailable" overlay;
    // the Add button is already disabled for them. This matches the original intent.
    let list = products
    if (activeCategoryId) {
      list = list.filter((p) => p.categoryId === activeCategoryId)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [products, activeCategoryId, search])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Branch header */}
      <div className="mb-6">
        {/* Hero banner */}
        <div className="relative rounded-2xl overflow-hidden mb-6 bg-brand-card border border-brand-border">
          {/* Red-to-dark gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/70 to-brand-darker" />
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-primary-500" />

          <div className="relative px-5 py-6 sm:px-8 sm:py-8 flex items-center gap-4">
            <WowLogo size="xl" className="flex-shrink-0 drop-shadow-2xl rounded-2xl shadow-lg" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                WOW <span className="text-gold-400">BURGER</span>
              </h1>
              <p className="text-sm text-white/70 mt-1 font-medium">Digital Menu</p>
              {branch && (
                <p className="text-xs text-white/60 mt-2 flex items-center gap-1.5">
                  <MapPin size={11} className="text-gold-400" />
                  {branch.name}
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1" />
                  <span className="text-green-400">Open</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* VAT notice */}
        <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs px-3 py-1.5 rounded-full font-semibold">
          <Info size={12} aria-hidden="true" />
          All prices exclude 15% VAT
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search menu items..."
          className="input-field pl-9 pr-9"
          aria-label="Search menu"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="mb-6">
        <CategoryTabs
          categories={categories}
          activeId={activeCategoryId}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {search
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`
            : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
        </p>
        {(search || activeCategoryId) && (
          <button
            onClick={() => { setSearch(''); setActiveCategory(null) }}
            className="text-xs text-primary-500 hover:text-primary-400 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title={
            search
              ? 'No items found'
              : activeCategoryId
              ? 'No items in this category'
              : 'Menu coming soon'
          }
          description={
            search
              ? `No menu items match "${search}". Try a different search term.`
              : activeCategoryId
              ? 'This category currently has no available items.'
              : 'The menu for this branch is being prepared. Please visit us in person or call the branch directly.'
          }
          action={
            (search || activeCategoryId) && (
              <button
                onClick={() => { setSearch(''); setActiveCategory(null) }}
                className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
              >
                View all items
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={setSelectedProduct}
              branchId={branchId}  // BUG-07: pass branchId so cart tracks which branch
            />
          ))}
        </div>
      )}

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          branchId={branchId}  // BUG-07: pass branchId so cart tracks which branch
        />
      )}
    </div>
  )
}
