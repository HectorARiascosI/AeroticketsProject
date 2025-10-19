import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="p-10 text-center">Cargando...</div>

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}