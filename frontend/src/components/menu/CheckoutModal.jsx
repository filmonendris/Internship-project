import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import { useCart } from '../../context/CartContext'
import { orderService } from '../../services/orderService'
import { formatPrice } from '../../utils/formatPrice'
import toast from 'react-hot-toast'

const INITIAL_FORM = {
  customerName: '',
  phone: '',
  type: 'dine-in',
  tableNumber: '',
}

const CheckoutModal = ({ isOpen, onClose }) => {
  const { branchId } = useParams()
  const { items, totals, clearCart } = useCart()
  const [form, setForm]       = useState(INITIAL_FORM)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const validate = () => {
    const errs = {}
    if (!form.customerName.trim()) errs.customerName = 'Name is required'
    if (!form.phone.trim())        errs.phone        = 'Phone number is required'
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim()))
      errs.phone = 'Enter a valid phone number'
    if (form.type === 'dine-in' && !form.tableNumber.trim())
      errs.tableNumber = 'Table number is required for dine-in'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const orderData = {
        branchId: Number(branchId) || 1,
        branchName: `Branch ${branchId || 1}`,
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        type: form.type,
        tableNumber: form.type === 'dine-in' ? form.tableNumber.trim() : null,
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        subtotal:  totals.subtotal,
        vatAmount: totals.vatAmount,
        total:     totals.total,
      }

      const order = await orderService.create(orderData)
      setSuccess(order)
      clearCart()
    } catch (err) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setForm(INITIAL_FORM)
    setErrors({})
    setSuccess(null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={success ? undefined : 'Place Your Order'}
      size="md"
    >
      {success ? (
        /* ── Success state ── */
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Order Placed!</h3>
          <p className="text-brand-muted text-sm mb-1">
            Thank you, <span className="text-white">{success.customerName}</span>!
          </p>
          <p className="text-brand-muted text-sm mb-6">
            Your order #{success.id} has been received.{' '}
            {success.type === 'dine-in'
              ? `Table ${success.tableNumber} will be served shortly.`
              : 'Your takeaway is being prepared.'}
          </p>
          <div className="bg-brand-darker rounded-xl p-4 w-full text-left mb-6 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Total paid</span>
              <span className="text-brand-red font-bold">{formatPrice(success.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Order type</span>
              <span className="text-white capitalize">{success.type}</span>
            </div>
          </div>
          <button onClick={handleClose} className="btn-primary px-8 py-2.5">
            Back to Menu
          </button>
        </div>
      ) : (
        /* ── Form ── */
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
          {/* Customer name */}
          <div>
            <label className="label" htmlFor="customerName">Your Name</label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              value={form.customerName}
              onChange={handleChange}
              placeholder="e.g. Abel Tesfaye"
              className={`input-field ${errors.customerName ? 'border-red-500' : ''}`}
              autoComplete="name"
            />
            {errors.customerName && (
              <p className="mt-1 text-xs text-red-400">{errors.customerName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="label" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+251 911 000 000"
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Order type */}
          <div>
            <label className="label">Order Type</label>
            <div className="grid grid-cols-2 gap-3">
              {['dine-in', 'takeaway'].map((t) => (
                <label
                  key={t}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                    form.type === t
                      ? 'border-brand-red bg-brand-red/10 text-white'
                      : 'border-brand-border bg-brand-darker text-brand-muted hover:border-brand-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={form.type === t}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Table number (dine-in only) */}
          {form.type === 'dine-in' && (
            <div>
              <label className="label" htmlFor="tableNumber">Table Number</label>
              <input
                id="tableNumber"
                name="tableNumber"
                type="text"
                value={form.tableNumber}
                onChange={handleChange}
                placeholder="e.g. 5"
                className={`input-field ${errors.tableNumber ? 'border-red-500' : ''}`}
              />
              {errors.tableNumber && (
                <p className="mt-1 text-xs text-red-400">{errors.tableNumber}</p>
              )}
            </div>
          )}

          {/* Order summary */}
          <div className="bg-brand-darker rounded-xl p-4 space-y-1.5">
            <p className="text-sm font-medium text-white mb-2">Order Summary</p>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-xs text-brand-muted">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-brand-border text-white">
              <span>Total (incl. 15% VAT)</span>
              <span className="text-brand-red">{formatPrice(totals.total)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Placing Order...
              </>
            ) : (
              `Confirm Order — ${formatPrice(totals.total)}`
            )}
          </button>
        </form>
      )}
    </Modal>
  )
}

export default CheckoutModal
