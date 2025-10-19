import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  children: JSX.Element;
  roles?: string[]; // opcional
};

export default function ProtectedRoute({ children, roles }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (roles && roles.length > 0 && user.role && !roles.includes(user.role)) {
    return <Navigate to="/flights" replace />;
  }
  return children;
}