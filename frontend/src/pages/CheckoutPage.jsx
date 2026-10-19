import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ShoppingBag, CheckCircle, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPriceWithComma } from '../utils/formatPrice'
import orderService from '../services/orderService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

const ORDER_TYPE = { DINE_IN: 'dine-in', TAKEAWAY: 'takeaway' }

export default function CheckoutPage() {
  const { branchId }       = useParams()
  const navigate           = useNavigate()
  const { items, subtotal, vatAmount, total, clearCart } = useCart()

  const [orderType, setOrderType] = useState(ORDER_TYPE.DINE_IN)
  const [form, setForm]           = useState({ customerName: '', phone: '', tableNumber: '' })
  const [errors, setErrors]       = useState({})
  const [loading, setLoading]     = useState(false)
  const [confirmed, setConfirmed] = useState(null)

  // Redirect if cart is empty
  if (items.length === 0 && !confirmed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some items before checking out.</p>
        <Button onClick={() => navigate(`/branch/${branchId}`)}>
          <ArrowLeft size={16} /> Back to Menu
        </Button>
      </div>
    )
  }

  function validate() {
    const e = {}
    if (!form.customerName.trim()) e.customerName = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number'
    if (orderType === ORDER_TYPE.DINE_IN && !form.tableNumber.trim()) {
      e.tableNumber = 'Table number is required for dine-in'
    }
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const orderData = {
        branchId: Number(branchId),
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        type: orderType,
        tableNumber: orderType === ORDER_TYPE.DINE_IN ? form.tableNumber.trim() : null,
        items: items.map((i) => ({
          productId:   i.id,
          productName: i.name,
          price:       i.price,
          quantity:    i.quantity,
        })),
        subtotal,
        vatAmount,
        total,
      }
      const order = await orderService.placeOrder(orderData)
      setConfirmed(order)
      clearCart()
    } catch (err) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Order confirmed screen ──────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center" role="status" aria-live="polite">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-400" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Order Placed!</h2>
        <p className="text-gray-400 mb-1">
          Thank you, <span className="text-white font-semibold">{confirmed.customerName}</span>!
        </p>
        <p className="text-gray-400 mb-6">
          Your order <span className="text-primary-400 font-bold">#{confirmed.id}</span> is{' '}
          <span className="text-yellow-400 font-semibold">pending</span>.
        </p>

        <div className="bg-brand-card border border-brand-border rounded-xl p-4 text-left mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Order type</span>
            <span className="text-white capitalize font-medium">{confirmed.type}</span>
          </div>
          {confirmed.tableNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Table</span>
              <span className="text-white font-medium">{confirmed.tableNumber}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold border-t border-brand-border pt-2">
            <span className="text-gray-300">Total</span>
            <span className="text-primary-400">{formatPriceWithComma(confirmed.total)}</span>
          </div>
        </div>

        <Button onClick={() => navigate(`/branch/${branchId}`)} className="w-full">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Menu
        </Button>
      </div>
    )
  }

  // ── Checkout form ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-1"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to cart
      </button>

      <h1 className="text-2xl font-black text-white mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Order type selector */}
        <fieldset>
          <legend className="text-sm font-medium text-surface-secondary mb-3">
            Order Type <span className="text-primary-500 select-none" aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </legend>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Order Type">
            {[ORDER_TYPE.DINE_IN, ORDER_TYPE.TAKEAWAY].map((type) => (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={orderType === type}
                onClick={() => setOrderType(type)}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  orderType === type
                    ? 'border-primary-500 bg-primary-500/15 text-primary-400'
                    : 'border-brand-border bg-brand-card text-gray-400 hover:border-gray-500'
                }`}
              >
                {type === ORDER_TYPE.DINE_IN ? '🍽 Dine In' : '🥡 Takeaway'}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Customer info */}
        <div className="space-y-4">
          <Input
            id="customerName"
            label="Your Name"
            required
            placeholder="e.g. Abebe Bekele"
            value={form.customerName}
            onChange={(e) => { setForm((f) => ({ ...f, customerName: e.target.value })); setErrors((er) => ({ ...er, customerName: '' })) }}
            error={errors.customerName}
          />
          <Input
            id="phone"
            label="Phone Number"
            required
            type="tel"
            placeholder="e.g. +251 911 000 000"
            value={form.phone}
            onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value })); setErrors((er) => ({ ...er, phone: '' })) }}
            error={errors.phone}
          />
          {orderType === ORDER_TYPE.DINE_IN && (
            <Input
              id="tableNumber"
              label="Table Number"
              required
              placeholder="e.g. 5"
              value={form.tableNumber}
              onChange={(e) => { setForm((f) => ({ ...f, tableNumber: e.target.value })); setErrors((er) => ({ ...er, tableNumber: '' })) }}
              error={errors.tableNumber}
            />
          )}
        </div>

        {/* Order summary */}
        <div className="bg-brand-card border border-brand-border rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Order Summary</h3>
          <ul className="space-y-2 mb-4">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-400 truncate mr-2">
                  {item.name} <span className="text-gray-600">×{item.quantity}</span>
                </span>
                <span className="text-white flex-shrink-0">{formatPriceWithComma(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-brand-border pt-3 space-y-1">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal</span><span className="text-white">{formatPriceWithComma(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>VAT (15%)</span><span className="text-white">{formatPriceWithComma(vatAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-white border-t border-brand-border pt-2">
              <span>Total</span>
              <span className="text-primary-400 text-lg">{formatPriceWithComma(total)}</span>
            </div>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Place Order
        </Button>
      </form>
    </div>
  )
}
