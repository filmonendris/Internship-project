import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser  = localStorage.getItem('wow_user')
      const storedToken = localStorage.getItem('wow_token')
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      }
    } catch {
      localStorage.removeItem('wow_user')
      localStorage.removeItem('wow_token')
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const { user: u, token: t } = await authService.login(email, password)
    setUser(u)
    setToken(t)
    localStorage.setItem('wow_user', JSON.stringify(u))
    localStorage.setItem('wow_token', t)
    return u
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setToken(null)
  }, [])

  const isSuperAdmin = user?.role === 'superadmin'
  const isAdmin      = user?.role === 'admin' || user?.role === 'superadmin'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isSuperAdmin, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
