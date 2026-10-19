import { useEffect, useState, useCallback } from 'react'
import { UtensilsCrossed, Tag, GitBranch, ShoppingBag, Users, TrendingUp, RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import branchService from '../../services/branchService'
import orderService from '../../services/orderService'
import authService from '../../services/authService'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import WowLogo from '../../components/ui/WowLogo'
import { formatPriceWithComma } from '../../utils/formatPrice'
import toast from 'react-hot-toast'

const STATUS_COLOR = {
  pending:   'warning',
  preparing: 'info',
  ready:     'primary',
  completed: 'success',
  cancelled: 'danger',
}

export default function DashboardPage() {
  const { user, isSuperAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    products: [],
    categories: [],
    branches: [],
    users: [],
    orders: [],
  })

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const [orders, products, categories, branches, users] = await Promise.all([
        isSuperAdmin ? orderService.getAll() : orderService.getByBranch(user?.branchId),
        isSuperAdmin ? productService.getAll() : productService.getByBranch(user?.branchId),
        isSuperAdmin ? categoryService.getAll() : categoryService.getByBranch(user?.branchId),
        branchService.getAll(),
        isSuperAdmin ? authService.getUsers() : Promise.resolve([]),
      ])

      setData({
        orders: orders || [],
        products: products || [],
        categories: categories || [],
        branches: branches || [],
        users: users || [],
      })
    } catch {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [isSuperAdmin, user?.branchId])

  useEffect(() => {
    document.title = 'WOW Burger — Admin Dashboard'
    fetchDashboardData()
  }, [fetchDashboardData])

  const recentOrders = data.orders.slice(0, 5)

  const stats = isSuperAdmin
    ? [
        { label: 'Total Products', value: data.products.length, icon: UtensilsCrossed, color: 'text-orange-400' },
        { label: 'Categories', value: data.categories.length, icon: Tag, color: 'text-blue-400' },
        { label: 'Branches', value: data.branches.length, icon: GitBranch, color: 'text-green-400' },
        { label: 'Users', value: data.users.length, icon: Users, color: 'text-purple-400' },
        { label: 'Total Orders', value: data.orders.length, icon: ShoppingBag, color: 'text-yellow-400' },
        {
          label: 'Revenue',
          value: formatPriceWithComma(
            data.orders
              .filter((o) => o.status !== 'cancelled')
              .reduce((s, o) => s + (Number(o.total) || 0), 0)
          ),
          icon: TrendingUp,
          color: 'text-primary-400',
          wide: true,
        },
      ]
    : [
        { label: 'Branch Products', value: data.products.length, icon: UtensilsCrossed, color: 'text-orange-400' },
        { label: 'Orders Today', value: data.orders.length, icon: ShoppingBag, color: 'text-yellow-400' },
      ]

  return (
    <div>
      {/* Welcome header with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5">
          <WowLogo size="md" className="rounded-xl shadow-xs" />
          <div>
            <h1 className="text-2xl font-black text-white">
              Welcome back, <span className="text-primary-500">{user?.name}</span> 👋
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {isSuperAdmin
                ? 'Full system overview & franchise management'
                : `Managing: ${data.branches.find((b) => b.id === user?.branchId)?.name || 'Your Branch'}`}
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchDashboardData} loading={loading}>
          <RefreshCw size={14} aria-hidden="true" /> Refresh
        </Button>
      </div>

      {loading && data.orders.length === 0 ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`bg-brand-card border border-brand-border rounded-xl p-4 ${
                  stat.wide ? 'col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{stat.label}</p>
                  <stat.icon size={18} className={stat.color} aria-hidden="true" />
                </div>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-border">
              <h2 className="font-bold text-white">Recent Orders</h2>
            </div>
            {recentOrders.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-500 text-sm">No orders yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-border">
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Order</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Customer</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Type</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Total</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-brand-border/50 hover:bg-brand-border/20 transition-colors"
                      >
                        <td className="px-5 py-3 text-primary-400 font-bold">#{order.id}</td>
                        <td className="px-5 py-3 text-white">{order.customerName}</td>
                        <td className="px-5 py-3">
                          <span className="text-gray-400 capitalize">{order.type}</span>
                          {order.tableNumber && (
                            <span className="text-gray-600 ml-1">(T{order.tableNumber})</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-white font-semibold">
                          {formatPriceWithComma(order.total)}
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={STATUS_COLOR[order.status] || 'default'} className="capitalize">
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
