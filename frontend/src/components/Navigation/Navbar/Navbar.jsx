import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import ThemeToggle from "../../UI/ThemeToggle/ThemeToggle";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isExploreActive = location.pathname === "/" || location.pathname.startsWith("/category/");
  const isAdmin = user?.roles?.includes("ADMIN");
  const logoSrc = theme === "dark" ? "/logo-white.svg" : "/logo.svg";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`nav-bar ${isAuthPage ? "nav-absolute" : "nav-sticky"}`}>
      <div className="nav-left">
        <Link to="/" onClick={closeMobileMenu}>
          <img className="logo" src={logoSrc} alt="Echo" />
        </Link>
      </div>

      {/* Botón menú hamburguesa para móvil */}
      {!isAuthPage && (
        <button 
          className={`nav-mobile-toggle ${mobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* botones desplegables visuales (sin funcionalidad aun) */}
      {!isAuthPage && (
        <div className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          <Link to="/" className={`nav-item nav-link ${isExploreActive ? "active" : ""}`} onClick={closeMobileMenu}>
            <span className="nav-item-label">Explorar</span>
          </Link>
          <div className="nav-item nav-dropdown nav-resources-dropdown" role="button" aria-haspopup="true" aria-expanded="false" aria-label="Menú de recursos">
            <span className="nav-item-label">Recursos</span>
            <div className="nav-dropdown-menu" role="menu">
              <Link to="/introduccion" className="nav-dropdown-link" role="menuitem" onClick={closeMobileMenu}>Introduccion</Link>
              <Link to="/sobre-nosotros" className="nav-dropdown-link" role="menuitem" onClick={closeMobileMenu}>Sobre nosotros</Link>
            </div>
          </div>
        </div>
      )}

      {!isAuthPage && (
        <div className="nav-right">
          <ThemeToggle />
          {user ? (
            <div className="nav-item nav-dropdown nav-user-dropdown" role="button" aria-haspopup="true" aria-expanded="false" aria-label={`Menú de usuario de ${user.username || 'usuario'}`}>
              <div className="nav-user-avatar">
                {user.avatarUrl
                  ? <img src={user.avatarUrl} alt={user.username} className="nav-avatar-img" />
                  : <div className="nav-avatar-initials" aria-label={`Avatar de ${user.username || 'usuario'}`}>{(user.username || "U").charAt(0).toUpperCase()}</div>
                }
              </div>
              <div className="nav-dropdown-menu nav-user-menu" role="menu">
                {isAdmin && (
                  <Link to="/admin" className="nav-dropdown-link" role="menuitem">Admin</Link>
                )}
                <Link to="/orders" className="nav-dropdown-link" role="menuitem">Encargos</Link>
                <Link to="/profile" className="nav-dropdown-link" role="menuitem">Perfil</Link>
                <button className="nav-dropdown-link nav-logout-btn" onClick={logout} role="menuitem">Cerrar sesión</button>
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