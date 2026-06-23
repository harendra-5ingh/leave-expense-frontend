import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LeaveRequests from './pages/LeaveRequests.jsx'
import ExpenseClaims from './pages/ExpenseClaims.jsx'
import TeamRequests from './pages/TeamRequests.jsx'
import Users from './pages/Users.jsx'

function AppRoutes() {
  const { auth } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={auth ? <Navigate to="/dashboard" replace /> : <AuthPage />}
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaves" element={<LeaveRequests />} />
        <Route path="/expenses" element={<ExpenseClaims />} />
        <Route
          path="/team-leaves"
          element={
            <ProtectedRoute roles={['MANAGER', 'ADMIN']}>
              <TeamRequests type="leave" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team-expenses"
          element={
            <ProtectedRoute roles={['MANAGER', 'ADMIN']}>
              <TeamRequests type="expense" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Users />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={auth ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}
