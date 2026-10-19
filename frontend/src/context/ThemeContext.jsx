import { createContext, useContext, useState, useEffect, useCallback } from 'react'

/**
 * ThemeContext — manages light/dark theme.
 *
 * Behaviour:
 *  1. On first visit (no localStorage key), reads the operating system's
 *     preferred color scheme via `prefers-color-scheme`.
 *  2. When the user toggles the theme, the choice is saved to localStorage
 *     under the key `wow_theme` ('light' or 'dark').
 *  3. The `dark` class is toggled on the <html> element to activate the
 *     CSS variable palette defined in index.css.
 */

const STORAGE_KEY = 'wow_theme'
const ThemeContext = createContext(null)

function getInitialTheme() {
  // 1. Check localStorage for a saved preference
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage may be unavailable (e.g. incognito in some browsers)
  }

  // 2. Fall back to OS preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // 3. Default to dark (matches the existing project design)
  return 'dark'
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const initial = getInitialTheme()
    applyTheme(initial) // Apply synchronously during first render to avoid flash
    return initial
  })

  // Listen for OS theme changes (only when user has no saved preference)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return

    function handleChange(e) {
      // Only follow OS changes if the user hasn't explicitly set a preference
      try {
        if (localStorage.getItem(STORAGE_KEY)) return
      } catch { /* ignore */ }
      const newTheme = e.matches ? 'dark' : 'light'
      setThemeState(newTheme)
      applyTheme(newTheme)
    }

    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch { /* ignore */ }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const isDark = theme === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
