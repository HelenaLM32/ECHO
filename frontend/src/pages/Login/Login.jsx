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
  const [showPassword, setShowPassword] = useState(false);

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

          <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Contraseña..."
    aria-label="Contraseña"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    disabled={loadingUsers}
  />
  <button 
    onClick={() => setShowPassword(!showPassword)} 
    type="button"
    className="toggle-password-btn"
  >
   <svg fill="#B8B4B0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path d="M0 8c0-4.418 3.59-8 8-8 4.418 0 8 3.59 8 8 0 4.418-3.59 8-8 8-4.418 0-8-3.59-8-8zm2 0c0 3.307 2.686 6 6 6 3.307 0 6-2.686 6-6 0-3.307-2.686-6-6-6-3.307 0-6 2.686-6 6zm2 0c0-2.21 1.795-4 4-4 2.21 0 4 1.795 4 4 0 2.21-1.795 4-4 4-2.21 0-4-1.795-4-4zm2 0c0 1.112.895 2 2 2 1.112 0 2-.895 2-2 0-1.112-.895-2-2-2-1.112 0-2 .895-2 2z" fillRule="evenodd"></path>
  </g>
</svg>
  </button>
</div>

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
