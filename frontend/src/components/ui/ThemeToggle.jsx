import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

/**
 * Theme toggle button — shows a sun icon in dark mode, moon icon in light mode.
 * Clicking it switches between light and dark themes.
 * The choice is automatically persisted in localStorage by ThemeContext.
 */
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl bg-brand-card border border-brand-border
                  hover:border-primary-500 transition-all duration-200 ${className}`}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <Sun size={18} className="text-gold-400" aria-hidden="true" />
      ) : (
        <Moon size={18} className="text-primary-500" aria-hidden="true" />
      )}
    </button>
  )
}
