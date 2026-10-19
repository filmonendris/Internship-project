import Spinner from './Spinner'

export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false,
  className = '', type = 'button', onClick, ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-darker'

  const variants = {
    primary:   'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm hover:shadow-glow-red focus:ring-primary-500',
    gold:      'bg-gold-500 hover:bg-gold-600 text-black shadow-sm hover:shadow-glow-gold focus:ring-gold-500',
    secondary: 'bg-brand-card hover:bg-brand-muted text-white border border-brand-border hover:border-gray-500 focus:ring-primary-500',
    danger:    'bg-red-700 hover:bg-red-800 text-white focus:ring-red-600',
    ghost:     'bg-transparent hover:bg-brand-card text-gray-400 hover:text-white focus:ring-primary-500',
    outline:   'bg-transparent border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white focus:ring-primary-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-disabled={disabled || loading ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
