import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loadingContext } = useAuth();

  if (loadingContext) return <div>Cargando...</div>;

  if (!user || !user.roles.includes("ADMIN")) {
    return <Navigate to="/" replace />;
  }

  return children;
}