import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="nav-bar">
      <div className="left">
        <Link to="/"><img className="logo" src="logo.svg" alt="" /></Link>
      </div>

      <div className="right">
        {/* luego lo cambiamos no se preocupen tigeres */}
        {user ? (
          <>
            <span>{user.username}</span>
            <button onClick={logout}>LOGOUT</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary">
              LOGIN
            </Link>
            <Link to="/register" className="btn btn-secondary">
              REGISTER
            </Link>
          </>
        )}
      </div>
    </div>
  );
}