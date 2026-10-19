import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Layouts
import PublicLayout  from './layouts/PublicLayout'
import AdminLayout   from './layouts/AdminLayout'

// Guards
import ProtectedRoute from './components/auth/ProtectedRoute'

// Public pages
import HomePage       from './pages/HomePage'
import BranchMenuPage from './pages/BranchMenuPage'
import CheckoutPage   from './pages/CheckoutPage'
import LoginPage      from './pages/LoginPage'

// Admin pages
import DashboardPage  from './pages/admin/DashboardPage'
import ProductsPage   from './pages/admin/ProductsPage'
import CategoriesPage from './pages/admin/CategoriesPage'
import BranchesPage   from './pages/admin/BranchesPage'
import UsersPage      from './pages/admin/UsersPage'
import OrdersPage     from './pages/admin/OrdersPage'
import LoginLogsPage  from './pages/admin/LoginLogsPage'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* ── Public ─────────────────────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/branch/:branchId"          element={<BranchMenuPage />} />
            <Route path="/branch/:branchId/checkout" element={<CheckoutPage />} />
          </Route>

          {/* ── Login ──────────────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Admin (protected) ──────────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index        element={<DashboardPage />} />
            <Route path="products"   element={<ProductsPage />} />
            <Route path="categories" element={
              <ProtectedRoute requireSuperAdmin>
                <CategoriesPage />
              </ProtectedRoute>
            } />
            <Route path="branches" element={
              <ProtectedRoute requireSuperAdmin>
                <BranchesPage />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute requireSuperAdmin>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="login-logs" element={
              <ProtectedRoute requireSuperAdmin>
                <LoginLogsPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* ── 404 ────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/branch/1" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
