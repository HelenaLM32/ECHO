import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loadingContext } = useAuth();

  if (loadingContext) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}