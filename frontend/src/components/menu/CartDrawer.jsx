import { useEffect, useRef } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import { formatPrice, formatPriceWithComma } from '../../utils/formatPrice'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer() {
  // BUG-07: cartBranchId comes from CartContext (set when item is added), not useParams.
  // This prevents /branch/undefined/checkout when the cart is opened outside a branch route.
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, vatAmount, total, totalItems, clearCart, cartBranchId } = useCart()
  const { isDark } = useTheme()
  const navigate  = useNavigate()
  const drawerRef = useRef(null)
  const previousFocusRef = useRef(null)

  // Close on Escape, lock scroll, and manage focus
  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const timer = setTimeout(() => {
      if (drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length > 0) focusables[0].focus()
      }
    }, 50)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeCart()
        return
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll(
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
  }, [isOpen, closeCart])
  
  const PLACEHOLDER = isDark 
    ? 'https://placehold.co/64x64/1a1a1a/52525b?text=No+Img'
    : 'https://placehold.co/64x64/f4f4f5/a1a1aa?text=No+Img'

  function handleCheckout() {
    closeCart()
    // BUG-07: use cartBranchId from context; fall back to 1 only as last resort
    navigate(`/branch/${cartBranchId || 1}/checkout`)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className="relative w-full max-w-md bg-brand-dark border-l border-brand-border flex flex-col h-full shadow-2xl outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary-500" aria-hidden="true" />
            <h2 id="cart-drawer-title" className="font-bold text-white text-lg">Your Order</h2>
            {totalItems > 0 && (
              <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full" aria-label={`${totalItems} total items`}>
                {totalItems}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Clear all items from cart"
              >
                Clear all
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-brand-card transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close cart"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-brand-card border border-brand-border flex items-center justify-center mb-3">
                <ShoppingBag size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-400 font-medium">Your cart is empty</p>
              <p className="text-gray-600 text-sm mt-1">Add items from the menu to get started</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 bg-brand-card rounded-xl p-3 border border-brand-border">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-brand-darker flex-shrink-0">
                    <img
                      src={item.image || PLACEHOLDER}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white line-clamp-2 leading-tight">{item.name}</p>
                    <p className="text-primary-400 text-sm font-bold mt-1">{formatPrice(item.price)}</p>

                    {/* Qty controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-brand-border text-gray-400 hover:text-white hover:border-primary-500 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={11} aria-hidden="true" />
                        </button>
                        <span className="text-white text-sm font-bold w-4 text-center" aria-label={`Current quantity: ${item.quantity}`}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-brand-border text-gray-400 hover:text-white hover:border-primary-500 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={11} aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-gray-600 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="border-t border-brand-border px-5 py-4 flex-shrink-0 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPriceWithComma(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>VAT (15%)</span>
                <span className="text-white">{formatPriceWithComma(vatAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-white border-t border-brand-border pt-1.5">
                <span>Total</span>
                <span className="text-primary-400 text-lg">{formatPriceWithComma(total)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
