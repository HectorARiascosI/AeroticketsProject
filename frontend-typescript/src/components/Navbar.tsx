import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import Button from './ui/Button'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-dark text-white px-5 py-3 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/flights" className="font-bold tracking-wider text-lg">
          AEROTICKETS
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link className={pathname.startsWith('/flights') ? 'text-primary' : 'hover:text-primary'} to="/flights">
                Vuelos
              </Link>
              <Link className={pathname.startsWith('/reservations') ? 'text-primary' : 'hover:text-primary'} to="/reservations">
                Mis Reservas
              </Link>
              <span className="text-sm text-gray-300">Hola, {user.username ?? user.email}</span>
              <Button variant="danger" onClick={onLogout}>Salir</Button>
            </>
          ) : (
            <>
              <Link className="hover:text-primary" to="/login">Ingresar</Link>
              <Link className="hover:text-primary" to="/register">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}