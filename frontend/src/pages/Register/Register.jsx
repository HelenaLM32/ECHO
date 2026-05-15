import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/logo-white.svg" : "/logo.svg";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUsers(true);
    setErrorUsers(null);

    try {
      await register(email, username, password);
      navigate("/");
    } catch (err) {
      setErrorUsers(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-cont">
        <Link to="/" className="auth-logo-link">
          <img src={logoSrc} alt="Echo" className="auth-logo" />
        </Link>
        <h1>Crea una cuenta</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico..."
            aria-label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loadingUsers}
          />

          <input
            type="text"
            placeholder="Nombre de usuario..."
            aria-label="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loadingUsers}
          />

          <input
            type="password"
            placeholder="Contraseña..."
            aria-label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loadingUsers}
          />

          <button className="btn-register" type="submit" disabled={loadingUsers}>
            {loadingUsers ? "Creando cuenta..." : "Registrarse"}
          </button>

          <div className="register-line"></div>

          <div className="register-circles">
            <div className="register-circle"></div>
            <div className="register-circle"></div>
            <div className="register-circle"></div>
          </div>

          <p className="register-text">
            ¿Ya eres miembro?{" "}
            <span className="register-link" onClick={() => navigate("/login")}>
              Inicia sesión ahora
            </span>
          </p>
        </form>

        {loadingUsers && <p className="status-text">Cargando...</p>}
        {errorUsers && <p className="error-text" role="alert" aria-live="assertive">{errorUsers}</p>}
      </div>

      <div className="register-cont2">
        <h1>E</h1>
        <h1>C</h1>
        <h1>H</h1>
        <h1>O</h1>
      </div>
    </div>
  );
}
