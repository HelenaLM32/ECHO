import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import OAuthButtons from "../../components/UI/OAuthButtons/OAuthButtons";

import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/logo-white.svg" : "/logo.svg";

  const validatePassword = (pwd) => {
  if (pwd.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(pwd)) return "La contraseña debe contener al menos 1 letra mayúscula.";
  if (!/[0-9]/.test(pwd)) return "La contraseña debe contener al menos 1 número.";
  return null;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
  if (passwordError) {
    setErrorUsers(passwordError);
    return;
  }

    setLoadingUsers(true);
    setErrorUsers(null);

    try {
      await register(email, username, password);
      navigate("/");
    } catch (err) {
      const msg = err.message?.toLowerCase() || "";
    if (msg.includes("password") || msg.includes("contraseña")) {
      setErrorUsers("La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 número.");
    } else {
      setErrorUsers(err.message);
    }
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

          <button className="btn-register" type="submit" disabled={loadingUsers}>
            {loadingUsers ? "Creando cuenta..." : "Registrarse"}
          </button>

          <div className="oauth-separator">
                      <span>o continúa con</span>
                    </div>
          
                    <OAuthButtons />
          
                    <div className="div-linia"></div>

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
