import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const VAT_RATE = 0.15
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems]       = useState([])
  const [isOpen, setIsOpen]     = useState(false)
  // BUG-07: store which branch the cart items belong to
  const [cartBranchId, setCartBranchId] = useState(null)

  // BUG-07: addItem now accepts an optional branchId so CartDrawer can navigate
  // to the correct /branch/:id/checkout even when the URL has no branchId (e.g. homepage).
  const addItem = useCallback((product, quantity = 1, branchId = null) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { ...product, quantity }]
    })
    // Only set branchId on first item added; subsequent items from the same session keep it
    if (branchId !== null) setCartBranchId(branchId)
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== productId))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
      )
    }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCartBranchId(null) // BUG-07: reset branchId when cart is cleared
  }, [])
  const openCart  = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const subtotal   = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])
  const vatAmount  = useMemo(() => subtotal * VAT_RATE, [subtotal])
  const total      = useMemo(() => subtotal + vatAmount, [subtotal, vatAmount])
  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        cartBranchId,   // BUG-07: exposed so CartDrawer can navigate correctly
        subtotal,
        vatAmount,
        total,
        totalItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
