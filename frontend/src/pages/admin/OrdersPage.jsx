import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Clock, Search, X, GitBranch, Ban } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import orderService from '../../services/orderService'
import branchService from '../../services/branchService'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatPriceWithComma } from '../../utils/formatPrice'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled']

const STATUS_COLOR = {
  pending:   'warning',
  preparing: 'info',
  ready:     'primary',
  completed: 'success',
  cancelled: 'danger',
}

const STATUS_NEXT = {
  pending:   'preparing',
  preparing: 'ready',
  ready:     'completed',
}

export default function OrdersPage() {
  const { user, isSuperAdmin } = useAuth()
  const [orders, setOrders]    = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading]  = useState(true)
  const [filter, setFilter]    = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [search, setSearch]     = useState('')
  const [updating, setUpdating] = useState(null)
  const [cancelDialog, setCancelDialog] = useState({ open: false, order: null })

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const [orderData, branchData] = await Promise.all([
        isSuperAdmin
          ? orderService.getAll()
          : orderService.getByBranch(user?.branchId),
        branchService.getAll(),
      ])
      setOrders(orderData || [])
      setBranches(branchData || [])
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [isSuperAdmin, user?.branchId])

  useEffect(() => {
    document.title = 'WOW Burger — Orders'
    fetchOrders()
    const interval = setInterval(fetchOrders, 15000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  async function handleStatusUpdate(orderId, newStatus) {
    setUpdating(orderId)
    try {
      await orderService.updateStatus(orderId, newStatus)
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o))
      toast.success(`Order #${orderId} → ${newStatus}`)
    } catch {
      toast.error('Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = orders.filter((o) => {
    const matchesStatus = filter === 'all' || o.status === filter
    const matchesBranch = !isSuperAdmin || branchFilter === 'all' || o.branchId === Number(branchFilter)
    const q = search.trim().toLowerCase()
    const matchesSearch = !q ||
      String(o.id).toLowerCase().includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.phone && o.phone.toLowerCase().includes(q))
    return matchesStatus && matchesBranch && matchesSearch
  })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Orders</h1>
          <p className="text-surface-muted text-sm mt-0.5 flex items-center gap-1">
            <Clock size={13} /> Auto-refreshes every 15s
            {!isSuperAdmin && (
              <span className="ml-2 font-medium text-primary-400">
                • {branches.find((b) => b.id === user?.branchId)?.name || 'Your Branch'}
              </span>
            )}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchOrders} loading={loading}>
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer, or phone..."
            className="input-field pl-9 pr-9 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Branch Filter (Superadmin only) */}
        {isSuperAdmin && (
          <div className="flex items-center gap-2">
            <label htmlFor="order-branch-filter" className="text-xs font-semibold text-surface-muted uppercase whitespace-nowrap">
              Branch:
            </label>
            <select
              id="order-branch-filter"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="input-field text-sm py-1.5 px-3 min-w-[140px]"
              aria-label="Filter orders by branch"
            >
              <option value="all">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6" role="toolbar" aria-label="Order status filter">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
              filter === s
                ? 'bg-primary-500 text-white'
                : 'bg-brand-card border border-brand-border text-gray-400 hover:text-white'
            }`}
          >
            {s} {s !== 'all' && `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-brand-card border border-brand-border rounded-xl p-12 text-center text-surface-muted">
          <p className="font-semibold text-surface-primary text-base mb-1">No orders found</p>
          <p className="text-sm">
            {search
              ? `No orders matching "${search}"`
              : `No ${filter !== 'all' ? filter : ''} orders for this branch.`}
          </p>
          {(search || filter !== 'all' || branchFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setFilter('all'); setBranchFilter('all'); }}
              className="mt-4 text-xs font-semibold text-primary-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-brand-card border border-brand-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-primary-400 font-black text-lg">#{order.id}</span>
                    <Badge variant={STATUS_COLOR[order.status] || 'default'} className="capitalize">
                      {order.status}
                    </Badge>
                    <span className="text-xs text-surface-muted capitalize bg-brand-border px-2 py-0.5 rounded-full font-medium">
                      {order.type}
                    </span>
                    {/* Branch Badge */}
                    <span className="text-xs text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <GitBranch size={11} />
                      {branches.find((b) => b.id === order.branchId)?.name || `Branch #${order.branchId}`}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{order.customerName}</p>
                  <p className="text-gray-500 text-sm">{order.phone}</p>
                  {order.tableNumber && (
                    <p className="text-gray-400 text-sm">Table {order.tableNumber}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-primary-400 font-black text-lg">{formatPriceWithComma(order.total)}</p>
                  <p className="text-gray-600 text-xs">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-brand-border pt-3 mb-4">
                <ul className="space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-gray-400">{item.productName} <span className="text-gray-600">×{item.quantity}</span></span>
                      <span className="text-white">{formatPriceWithComma(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions: Progress and Safe Cancellation */}
              <div className="flex items-center gap-2 flex-wrap">
                {STATUS_NEXT[order.status] && (
                  <Button
                    size="sm"
                    loading={updating === order.id}
                    onClick={() => handleStatusUpdate(order.id, STATUS_NEXT[order.status])}
                    className="capitalize"
                  >
                    Mark as {STATUS_NEXT[order.status]}
                  </Button>
                )}
                {(order.status === 'pending' || order.status === 'preparing') && (
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={updating === order.id}
                    onClick={() => setCancelDialog({ open: true, order })}
                    className="flex items-center gap-1"
                  >
                    <Ban size={13} /> Cancel Order
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Order Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, order: null })}
        onConfirm={async () => {
          const o = cancelDialog.order
          setCancelDialog({ open: false, order: null })
          if (o) await handleStatusUpdate(o.id, 'cancelled')
        }}
        title="Cancel Order"
        message={`Are you sure you want to cancel order #${cancelDialog.order?.id} for "${cancelDialog.order?.customerName}"?`}
        confirmLabel="Cancel Order"
        danger
      />
    </div>
  )
}

