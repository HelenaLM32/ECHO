import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loadingContext } = useAuth();

  if (loadingContext) return <div>Cargando...</div>;

  if (!user || !user.roles || user.roles.length === 0) {
    return <Navigate to="/" replace />;
  }

  const isAdmin = user.roles.includes("ADMIN");

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}