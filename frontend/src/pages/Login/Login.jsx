import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const USERS_API = "https://example.com/api/users"; // PONER NUESTRA API

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const navigate = useNavigate();

  const loginUsers = async (email, password) => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const res = await fetch(USERS_API);
      if (!res.ok) throw new Error("Error de servidor");
      const data = await res.json();

      const found = data.find(
        (c) => c.email.toLowerCase() === email.toLowerCase()
      );

      if (!found) throw new Error("Email no encontrado");
      if (found.password !== password) throw new Error("Contraseña incorrecta");

      
      localStorage.setItem("user", JSON.stringify(found));

      return found;
    } catch (err) {
      setErrorUsers(err.message);
      throw err;
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUsers(email, password);
      navigate("/"); 
    } catch {
      
    }
  };

  return (
    <>
    <div className="login-container">
    <div className="login-cont">
      
        <h2>Bienvenido de nuevo</h2>
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
          <button type="submit" disabled={loadingUsers}>
            {loadingUsers ? "Verificando..." : "Entrar"}
          </button>
          <button
            type="button"
            className="register-btn"
            onClick={() => navigate("/register")}
            disabled={loadingUsers}
          >
            Aún no eres miembro? Regístrate ahora
          </button>
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
    </>
  );
}

export default Login;