import { ShoppingCart, Eye } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'

// BUG-07: accepts branchId prop and forwards it to addItem so the cart tracks which branch
export default function ProductCard({ product, onView, branchId = null }) {
  const { addItem } = useCart()
  const { isDark } = useTheme()
  const PLACEHOLDER = isDark 
    ? 'https://placehold.co/400x300/1a1a1a/52525b?text=No+Image' 
    : 'https://placehold.co/400x300/f4f4f5/a1a1aa?text=No+Image'

  function handleAdd(e) {
    e.stopPropagation()
    addItem(product, 1, branchId) // BUG-07: pass branchId
    toast.success(`${product.name} added!`, { duration: 1500 })
  }

  return (
    <div
      className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden group cursor-pointer
                 hover:border-primary-500/60 hover:shadow-lg hover:shadow-primary-500/10
                 focus:outline-none focus:ring-2 focus:ring-primary-500
                 transition-all duration-200 flex flex-col"
      onClick={() => onView(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onView(product)
        }
      }}
      aria-label={`View details for ${product.name}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-brand-darker aspect-[4/3]">
        <img
          src={product.image || PLACEHOLDER}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
        />

        {/* Unavailable overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-xs font-bold text-white bg-red-700 px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}

        {/* Quick view */}
        <button
          onClick={(e) => { e.stopPropagation(); onView(product) }}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white
                     opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye size={13} aria-hidden="true" />
        </button>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2
                       group-hover:text-gold-400 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1 leading-relaxed">
          {product.description || 'Tap to view details'}
        </p>

        {/* Price + Add */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-gold-400 font-black text-sm">{formatPrice(product.price)}</span>
            <p className="text-xs text-gray-600 leading-none mt-0.5">excl. VAT</p>
          </div>
          <button
            onClick={handleAdd}
            disabled={!product.isAvailable}
            className="flex items-center gap-1 bg-primary-500 hover:bg-primary-600
                       disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-xs font-bold px-2.5 py-1.5 rounded-lg
                       transition-colors shadow-sm hover:shadow-glow-red
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={12} aria-hidden="true" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
