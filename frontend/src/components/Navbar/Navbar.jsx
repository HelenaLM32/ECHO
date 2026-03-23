import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className={`nav-bar ${isAuthPage ? "nav-bar-auth" : ""}`}>
      <div className="nav-left">
        <Link to="/"><img className="logo" src="logo.svg" alt="" /></Link>
      </div>

      {!isAuthPage && (
        <div className="nav-right">
          {user ? (
            <>
              <span>{user.username}</span>
              <button onClick={logout}>LOGOUT</button>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-secondary">
                Registrarse
              </Link>
              <Link to="/login" className="btn btn-primary">
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}