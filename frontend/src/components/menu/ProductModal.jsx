import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Plus, Minus, X } from 'lucide-react'
import { formatPrice, calculateVAT } from '../../utils/formatPrice'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'

// BUG-07: accepts branchId prop and forwards it to addItem
export default function ProductModal({ product, onClose, branchId = null }) {
  const { addItem } = useCart()
  const { isDark } = useTheme()
  const [qty, setQty] = useState(1)
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  // Escape key handler, scroll lock, and focus management
  useEffect(() => {
    if (!product) return

    previousFocusRef.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length > 0) focusables[0].focus()
      }
    }, 50)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
        if (focusables.length === 0) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [product, onClose])

  const PLACEHOLDER = isDark 
    ? 'https://placehold.co/600x400/1a1a1a/52525b?text=No+Image' 
    : 'https://placehold.co/600x400/f4f4f5/a1a1aa?text=No+Image'

  if (!product) return null

  const unitVAT  = calculateVAT(product.price)
  const totalNet = product.price * qty
  const totalVAT = unitVAT * qty
  const grandTotal = totalNet + totalVAT

  function handleAdd() {
    addItem(product, qty, branchId) // BUG-07: pass branchId
    toast.success(`${product.name} added to cart!`)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full sm:max-w-lg bg-brand-card border border-brand-border rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col outline-none"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close dialog"
        >
          <X size={16} aria-hidden="true" />
        </button>

        {/* Image */}
        <div className="relative h-52 sm:h-64 bg-brand-darker overflow-hidden flex-shrink-0">
          <img
            src={product.image || PLACEHOLDER}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-card to-transparent" />

          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
              <span className="text-sm font-bold text-white bg-red-700 px-4 py-2 rounded-full">
                Currently Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          <h2 id="product-modal-title" className="text-xl font-black text-white mb-1">{product.name}</h2>

          {product.description && (
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">{product.description}</p>
          )}

          {/* Price breakdown */}
          <div className="bg-brand-darker rounded-2xl p-4 mb-4 border border-brand-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Base price</span>
              <span className="text-white font-semibold">{formatPrice(product.price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">VAT (15%)</span>
              <span className="text-white font-semibold">{formatPrice(unitVAT)}</span>
            </div>
            <div className="border-t border-brand-border pt-2 flex justify-between font-black">
              <span className="text-gray-200">Incl. VAT</span>
              <span className="text-gold-400 text-lg">{formatPrice(product.price + unitVAT)}</span>
            </div>
          </div>

          {/* Quantity */}
          {product.isAvailable && (
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-gray-300">Quantity</span>
              <div className="flex items-center gap-3 bg-brand-darker rounded-xl p-1 border border-brand-border">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-brand-muted flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label={`Decrease quantity of ${product.name}`}
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span className="text-white font-black text-lg w-6 text-center" aria-label={`Current quantity: ${qty}`}>{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-brand-muted flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label={`Increase quantity of ${product.name}`}
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Add to cart */}
          {product.isAvailable ? (
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2
                         bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                         text-white font-black py-3.5 rounded-2xl transition-colors
                         shadow-glow-red text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ShoppingCart size={18} aria-hidden="true" />
              Add to Cart — {formatPrice(grandTotal)}
            </button>
          ) : (
            <div className="w-full text-center py-3.5 rounded-2xl bg-brand-muted text-gray-500 font-bold">
              Item Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
