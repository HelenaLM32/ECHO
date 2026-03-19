import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";


const USERS_API = "http://localhost:8082/api/users";


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
  const res = await fetch(`${USERS_API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });


  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al iniciar sesión");
  }


  const data = await res.json();


  localStorage.setItem("user", JSON.stringify(data));


  return data;
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
} catch (err) {}
};


return ( <div className="login-container"> <div className="login-cont"> <h1>Bienvenido de nuevo</h1>


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


      <button
        className="btn-iniciar"
        type="submit"
        disabled={loadingUsers}
      >
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
        <span
          className="register-link"
          onClick={() => navigate("/register")}
        >
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


export default Login;