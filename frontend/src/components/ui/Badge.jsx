export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:  'bg-gray-100 text-gray-700 dark:bg-brand-border dark:text-gray-300',
    success:  'bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
    warning:  'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
    danger:   'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
    primary:  'bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-500/20 dark:text-primary-400 dark:border-primary-500/30',
    info:     'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
  }
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
