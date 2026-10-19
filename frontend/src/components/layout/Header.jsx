import { Link, useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import WowLogo from '../ui/WowLogo'
import ConfirmDialog from '../ui/ConfirmDialog'
import ThemeToggle from '../ui/ThemeToggle'

export default function Header() {
  const { branchId }  = useParams()
  const navigate       = useNavigate()
  const { totalItems, openCart }  = useCart()
  const { user, logout }          = useAuth()
  const [menuOpen, setMenuOpen]   = useState(false)
  // BUG-05: state to control the logout confirmation dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // basePath for Menu link
  const basePath = branchId ? `/branch/${branchId}` : '/branch/1'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-brand-darker/98 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="WOW Burger home">
            <WowLogo size="sm" className="group-hover:scale-105 transition-transform duration-200 rounded-lg shadow-xs" />
            <div className="hidden sm:block leading-none">
              <span className="font-black text-xl tracking-wide text-white group-hover:text-gold-400 transition-colors">
                WOW
              </span>
              <span className="font-black text-xl tracking-wide text-primary-500 group-hover:text-primary-400 transition-colors ml-1.5">
                BURGER
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-1" role="navigation">
            <Link to={basePath}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-brand-card transition-colors">
              Menu
            </Link>
            <a href="#about"
              className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-brand-card transition-colors">
              About
            </a>
            {user ? (
              <>
                <Link to="/admin"
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-brand-card transition-colors">
                  Admin
                </Link>
                {/* BUG-05: open confirm dialog instead of logging out immediately */}
                <button onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-brand-card transition-colors">
                  <LogOut size={14} aria-hidden="true" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-brand-card transition-colors">
                <LogIn size={14} aria-hidden="true" />
                Login
              </Link>
            )}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-brand-card border border-brand-border text-gray-300 hover:text-white hover:border-primary-500 transition-all duration-200"
              aria-label={`Cart, ${totalItems} items`}
            >
              <ShoppingCart size={20} aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-primary-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-glow-red">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2.5 rounded-xl bg-brand-card border border-brand-border text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile nav ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-brand-border bg-brand-dark/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5 px-6 pt-4 pb-2 border-b border-brand-border/60">
            <WowLogo size="xs" className="rounded-md" />
            <span className="font-black text-sm tracking-wide text-white">
              WOW <span className="text-primary-500">BURGER</span>
            </span>
          </div>
          <nav className="flex flex-col px-4 py-3 gap-1">
            <Link to={basePath} onClick={() => setMenuOpen(false)}
              className="px-3 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-brand-card transition-colors">
              Menu
            </Link>
            <a href="#about" onClick={() => setMenuOpen(false)}
              className="px-3 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-brand-card transition-colors">
              About
            </a>
            {user ? (
              <>
                <Link to="/admin" onClick={() => setMenuOpen(false)}
                  className="px-3 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-brand-card transition-colors">
                  Admin
                </Link>
                {/* BUG-05: open confirm dialog; also close mobile menu */}
                <button onClick={() => { setMenuOpen(false); setShowLogoutConfirm(true) }}
                  className="text-left flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-brand-card transition-colors">
                <LogIn size={15} /> Login
              </Link>
            )}
          </nav>
        </div>
      )}

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
    </header>
  )
}
