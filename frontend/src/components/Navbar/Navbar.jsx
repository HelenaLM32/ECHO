import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isExploreActive = location.pathname === "/" || location.pathname.startsWith("/category/");
  const isAdmin = user?.roles?.includes("ADMIN");
  const logoSrc = theme === "dark" ? "/logo-white.svg" : "/logo.svg";



  return (


    <nav className={`nav-bar ${isAuthPage ? "nav-absolute" : "nav-sticky"}`}>
      <div className="nav-left">
        <Link to="/"><img className="logo" src={logoSrc} alt="Echo" /></Link>
      </div>

      {/* botones desplegables visuales (sin funcionalidad aun) */}
      {!isAuthPage && (
        <div className="nav-links">
          <Link to="/" className={`nav-item nav-link ${isExploreActive ? "active" : ""}`}>
            <span className="nav-item-label">Explorar</span>
          </Link>
          <div className="nav-item nav-dropdown">
            <span className="nav-item-label">Recursos</span>
            <div className="nav-dropdown-menu">
              <Link to="/introduccion" className="nav-dropdown-link">Introduccion</Link>
              <Link to="/sobre-nosotros" className="nav-dropdown-link">Sobre nosotros</Link>
            </div>
          </div>
        </div>
      )}

      {!isAuthPage && (
        <div className="nav-right">
          <ThemeToggle />
          {user ? (
            <div className="nav-item nav-dropdown nav-user-dropdown">
              <div className="nav-user-avatar">
                {user.avatarUrl
                  ? <img src={user.avatarUrl} alt={user.username} className="nav-avatar-img" />
                  : <div className="nav-avatar-initials">{(user.username || "U").charAt(0).toUpperCase()}</div>
                }
              </div>
              <div className="nav-dropdown-menu nav-user-menu">
                {isAdmin && (
                  <Link to="/admin" className="nav-dropdown-link">Admin</Link>
                )}
                <Link to="/orders" className="nav-dropdown-link">Encargos</Link>
                <Link to="/profile" className="nav-dropdown-link">Perfil</Link>
                <button className="nav-dropdown-link nav-logout-btn" onClick={logout}>Cerrar sesión</button>
              </div>
            </div>
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