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
    <>
      <nav className={`nav-bar ${isAuthPage ? "nav-absolute" : "nav-sticky"}`}>
        <div className="nav-left">
          <Link to="/" onClick={closeMobileMenu}>
            <img className="logo" src={logoSrc} alt="Echo" />
          </Link>
        </div>

      {/* Botón menú hamburguesa solo para invitados en móvil */}
        {!isAuthPage && !user && (
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

        {!isAuthPage && (
          <div className="nav-links">
            <Link to="/" className={`nav-item nav-link ${isExploreActive ? "active" : ""}`} onClick={closeMobileMenu}>
              <span className="nav-item-label">Explorar</span>
            </Link>
            <div className="nav-item nav-dropdown nav-resources-dropdown" role="button" aria-haspopup="true" aria-expanded="false" aria-label="Menú de recursos">
              <span className="nav-item-label">Recursos</span>
              <div className="nav-dropdown-menu" role="menu">
                <Link to="/introduccion" className="nav-dropdown-link" role="menuitem" onClick={closeMobileMenu}>Introducción</Link>
                <Link to="/sobre-nosotros" className="nav-dropdown-link" role="menuitem" onClick={closeMobileMenu}>Sobre nosotros</Link>
              </div>
            </div>
          </div>
        )}

        {!isAuthPage && (
          <div className="nav-right">
            <ThemeToggle />
            {user ? (
              <div
                className="nav-item nav-dropdown nav-user-dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded={mobileMenuOpen}
                aria-label={`Menú de usuario de ${user.username || 'usuario'}`}
                onClick={toggleMobileMenu}
              >
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

        {!isAuthPage && (
          <div className={`nav-mobile-menu ${mobileMenuOpen ? "active" : ""}`} role="menu" aria-label="Menú móvil principal">
            <Link to="/" className="nav-mobile-link" role="menuitem" onClick={closeMobileMenu}>Explorar</Link>
            <Link to="/introduccion" className="nav-mobile-link" role="menuitem" onClick={closeMobileMenu}>Introducción</Link>
            <Link to="/sobre-nosotros" className="nav-mobile-link" role="menuitem" onClick={closeMobileMenu}>
              <span>Sobre </span>
              <span className="nav-echo-highlight">echo</span>
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="nav-mobile-link" role="menuitem" onClick={closeMobileMenu}>Admin</Link>
                )}
                <Link to="/orders" className="nav-mobile-link" role="menuitem" onClick={closeMobileMenu}>Encargos</Link>
                <Link to="/profile" className="nav-mobile-link" role="menuitem" onClick={closeMobileMenu}>Perfil</Link>
                <button className="nav-mobile-link nav-mobile-logout" onClick={() => { logout(); closeMobileMenu(); }} role="menuitem">Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/register" className="nav-mobile-link nav-mobile-auth-link" role="menuitem" onClick={closeMobileMenu}>Registrarse</Link>
                <Link to="/login" className="nav-mobile-link nav-mobile-auth-link" role="menuitem" onClick={closeMobileMenu}>Iniciar sesión</Link>
              </>
            )}
          </div>
        )}
      </nav>
      {!isAuthPage && <div className="nav-mobile-spacer" aria-hidden="true"></div>}
    </>
  );
}