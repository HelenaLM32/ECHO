import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";



  return (


    <nav className={`nav-bar ${isAuthPage ? "nav-absolute" : "nav-sticky"}`}>
      <div className="nav-left">
        <Link to="/"><img className="logo" src="logo.svg" alt="" /></Link>
      </div>

      {/* botones desplegables visuales (sin funcionalidad aun) */}
      {!isAuthPage && (
        <div className="nav-links">
          <div className="nav-item">
            <span className="nav-item-label">Explorar</span>
          </div>
          <div className="nav-item">
            <span className="nav-item-label">Recursos</span>
          </div>
          <div className="nav-item">
            <span className="nav-item-label">Contratar</span>
          </div>
        </div>
      )}

      {!isAuthPage && (
        <div className="nav-right">
          {user ? (
            <>
              <Link to="/orders" className="btn btn-secondary">Mis encargos</Link>
              <Link to="/profile" className="btn btn-secondary">Perfil</Link>
              <div className="btn btn-primary" onClick={logout}>Logout</div>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-secondary">Registrarse</Link>
              <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}