import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, UtensilsCrossed, Tag, GitBranch,
  Users, ShoppingBag, LogOut, Menu, X, ChevronRight, Shield
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ThemeToggle from '../components/ui/ThemeToggle'
import WowLogo from '../components/ui/WowLogo'

const superAdminLinks = [
  { to: '/admin',              label: 'Dashboard',      icon: LayoutDashboard, end: true },
  { to: '/admin/products',     label: 'Products',       icon: UtensilsCrossed },
  { to: '/admin/categories',   label: 'Categories',     icon: Tag },
  { to: '/admin/branches',     label: 'Branches',       icon: GitBranch },
  { to: '/admin/users',        label: 'Users',          icon: Users },
  { to: '/admin/orders',       label: 'Orders',         icon: ShoppingBag },
  { to: '/admin/login-logs',   label: 'Login History',  icon: Shield },
]

const adminLinks = [
  { to: '/admin',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products',  icon: UtensilsCrossed },
  { to: '/admin/orders',   label: 'Orders',    icon: ShoppingBag },
]

export default function AdminLayout() {
  const { user, logout, isSuperAdmin } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // BUG-05: state to control the logout confirmation dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const links = isSuperAdmin ? superAdminLinks : adminLinks

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo and Theme Toggle */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <WowLogo size="sm" className="rounded-lg shadow-xs" />
          <span className="font-black text-base text-white">
            WOW <span className="text-primary-500">BURGER</span>
          </span>
        </div>
        <ThemeToggle className="w-8 h-8 p-0 flex items-center justify-center bg-transparent border-0 hover:bg-brand-card hover:border-brand-border" />
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-brand-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
            <span className="text-primary-400 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <Badge variant={isSuperAdmin ? 'primary' : 'info'} className="mt-0.5">
              {isSuperAdmin ? 'Superadmin' : 'Admin'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-brand-card'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-brand-border space-y-1">
        {/* BUG-12: use user.branchId so branch admins see their own branch menu */}
        <NavLink
          to={user?.branchId ? `/branch/${user.branchId}` : '/branch/1'}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-brand-card transition-colors"
        >
          <ChevronRight size={18} />
          View Menu
        </NavLink>
        {/* BUG-05: open confirm dialog instead of logging out immediately */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-brand-darker">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <aside aria-label="Admin Navigation" className="hidden lg:flex w-60 flex-col bg-brand-dark border-r border-brand-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <aside aria-label="Admin Mobile Navigation" className="relative w-60 bg-brand-dark border-r border-brand-border flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-dark">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-brand-card focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            <WowLogo size="xs" className="rounded-md" />
            <span className="font-bold text-white text-sm">WOW BURGER Admin</span>
          </div>
          <div className="w-9" /> {/* spacer */}
        </div>

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto outline-none" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      {/* BUG-05: logout confirmation dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => { handleLogout(); setShowLogoutConfirm(false) }}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmLabel="Log Out"
        danger
      />
    </div>
  )
}
