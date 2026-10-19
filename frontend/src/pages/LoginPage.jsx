import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, LogIn, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import WowLogo from '../components/ui/WowLogo'
import ThemeToggle from '../components/ui/ThemeToggle'

const REMEMBER_EMAIL_KEY = 'wow_admin_remembered_email'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm]             = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors]         = useState({})
  const [showPwd, setShowPwd]       = useState(false)
  const [loading, setLoading]       = useState(false)
  const [apiError, setApiError]     = useState('')

  // Restore remembered email on initial load
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY)
      if (savedEmail) {
        setForm((f) => ({ ...f, email: savedEmail }))
        setRememberMe(true)
      }
    } catch {
      // Storage access blocked or unavailable
    }
  }, [])

  function validate() {
    const e = {}
    if (!form.email.trim()) {
      e.email = 'Please enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Please enter a valid email address'
    }

    if (!form.password) {
      e.password = 'Please enter your password'
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters'
    }
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      const user = await login(form.email.trim(), form.password)

      // Handle "Remember me" option securely (persists email only, never passwords)
      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_EMAIL_KEY, form.email.trim())
        } else {
          localStorage.removeItem(REMEMBER_EMAIL_KEY)
        }
      } catch {
        // Ignore localStorage quota errors
      }

      navigate(user.role === 'superadmin' || user.role === 'admin' ? '/admin' : '/branch/1')
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Invalid email or password. Please verify your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-brand-darker transition-colors duration-200 relative px-4 py-8 sm:px-6">
      {/* Top bar with Theme Toggle */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg p-1.5"
          aria-label="WOW Burger Storefront"
        >
          <WowLogo size="sm" />
          <span className="font-black text-gray-900 dark:text-white tracking-tight">
            WOW <span className="text-primary-500">BURGER</span>
          </span>
        </Link>
        <ThemeToggle className="shadow-xs" />
      </div>

      {/* Main Centered Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-white dark:bg-brand-card border border-gray-200/90 dark:border-brand-border rounded-2xl shadow-sm sm:shadow-lg sm:shadow-black/5 overflow-hidden transition-colors duration-200">
          {/* Subtle brand red top border accent */}
          <div className="h-1 bg-primary-500 w-full" />

          <div className="p-6 sm:p-8">
            {/* Header: Official Logo & Portal Title */}
            <div className="flex flex-col items-center text-center mb-6">
              <WowLogo size="lg" className="rounded-2xl shadow-md mb-3.5 hover:scale-105 transition-transform duration-200" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Admin Portal
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Sign in to manage branches, menus, and orders
              </p>
            </div>

            {/* Authentication Error Feedback */}
            {apiError && (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-start gap-3 p-3.5 mb-5 rounded-xl border border-red-200 bg-red-50 text-red-800 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300 text-sm"
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" aria-hidden="true" />
                <div className="flex-1 font-medium leading-snug">{apiError}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Address Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Email address <span className="text-primary-500" aria-hidden="true">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, email: e.target.value }))
                    if (errors.email) setErrors((er) => ({ ...er, email: '' }))
                    if (apiError) setApiError('')
                  }}
                  placeholder="admin@wowburger.com"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={loading}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-brand-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors duration-200 ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 dark:border-brand-border'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle size={13} className="flex-shrink-0" aria-hidden="true" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Password <span className="text-primary-500" aria-hidden="true">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, password: e.target.value }))
                      if (errors.password) setErrors((er) => ({ ...er, password: '' }))
                      if (apiError) setApiError('')
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    disabled={loading}
                    className={`w-full pl-3.5 pr-11 py-2.5 text-sm rounded-xl border bg-white dark:bg-brand-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors duration-200 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 dark:border-brand-border'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    disabled={loading}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle size={13} className="flex-shrink-0" aria-hidden="true" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Options: Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 accent-primary-500 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Remember my email
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                  className="w-full h-11 text-sm font-semibold rounded-xl shadow-sm"
                >
                  <LogIn size={18} aria-hidden="true" />
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Back to Menu Secondary Navigation Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md px-2 py-1"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Menu</span>
          </Link>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-2">
        WOW Burger &copy; {new Date().getFullYear()} Management System. All rights reserved.
      </div>
    </div>
  )
}
