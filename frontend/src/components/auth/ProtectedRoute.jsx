import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../ui/Spinner'

/**
 * Wraps routes that require authentication.
 * - If loading: show spinner
 * - If not logged in: redirect to /login
 * - If logged in but wrong role: redirect to /branch/1
 */
export default function ProtectedRoute({ children, requireSuperAdmin = false }) {
  const { user, loading } = useAuth()
  const location          = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-darker">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireSuperAdmin && user.role !== 'superadmin') {
    return <Navigate to="/admin" replace />
  }

  return children
}
