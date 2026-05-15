import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import OAuthButtons from "../../components/UI/OAuthButtons/OAuthButtons";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/logo-white.svg" : "/logo.svg";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUsers(true);
    setErrorUsers(null);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setErrorUsers(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-cont">
        <Link to="/" className="auth-logo-link">
          <img src={logoSrc} alt="Echo" className="auth-logo" />
        </Link>
        <h1>Bienvenido de nuevo</h1>

        <form onSubmit={handleSubmit} className="login-form">
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
            type="password"
            placeholder="Contraseña..."
            aria-label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loadingUsers}
          />

          <button className="btn-iniciar" type="submit" disabled={loadingUsers}>
            {loadingUsers ? "Verificando..." : "Iniciar sesión"}
          </button>

          <div className="oauth-separator">
            <span>o continúa con</span>
          </div>

          <OAuthButtons />

          <div className="div-linia"></div>

          <p className="register-text">
            ¿Aún no eres miembro?{" "}
            <span className="register-link" onClick={() => navigate("/register")}>
              Regístrate ahora
            </span>
          </p>
        </form>

        {errorUsers && <p className="error-text" role="alert" aria-live="assertive">{errorUsers}</p>}
      </div>

      <div className="login-cont2">
        <h1>E</h1>
        <h1>C</h1>
        <h1>H</h1>
        <h1>O</h1>
      </div>
    </div>
  );
}
