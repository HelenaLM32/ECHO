import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

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
        <h1>Bienvenido de nuevo</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loadingUsers}
          />

          <input
            type="password"
            placeholder="Contraseña..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loadingUsers}
          />

          <button className="btn-iniciar" type="submit" disabled={loadingUsers}>
            {loadingUsers ? "Verificando..." : "Iniciar sesión"}
          </button>

          <div className="div-linia"></div>

          <div className="div-circulos">
            <div className="circulo"></div>
            <div className="circulo"></div>
            <div className="circulo"></div>
          </div>

          <p className="register-text">
            ¿Aún no eres miembro?{" "}
            <span className="register-link" onClick={() => navigate("/register")}>
              Regístrate ahora
            </span>
          </p>
        </form>

        {loadingUsers && <p className="status-text">Cargando...</p>}
        {errorUsers && <p className="error-text">{errorUsers}</p>}
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