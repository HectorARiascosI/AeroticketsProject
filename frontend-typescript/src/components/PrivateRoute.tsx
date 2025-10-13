import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("vueler_token");
  return token ? children : <Navigate to="/login" replace />;
}