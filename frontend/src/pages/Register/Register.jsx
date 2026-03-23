import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

//esto fuera de aqui, nada de apis
const USERS_API = "http://localhost:8082/api/users";


function Register() {
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loadingUsers, setLoadingUsers] = useState(false);
const [errorUsers, setErrorUsers] = useState(null);


const navigate = useNavigate();


const registerUser = async (email, username, password) => {
setLoadingUsers(true);
setErrorUsers(null);




try {
  const res = await fetch(`${USERS_API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      username,
      password,
    }),
  });


  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al registrar");
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
await registerUser(email, username, password);
navigate("/");
} catch (err) {}
};


return ( <div className="register-container"> <div className="register-cont"> <h1>Crea una cuenta</h1>




    <form className="register-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Correo electrónico..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loadingUsers}
      />


      <input
        type="text"
        placeholder="Nombre de usuario..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
        className="btn-register"
        type="submit"
        disabled={loadingUsers}
      >
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
        <span
          className="register-link"
          onClick={() => navigate("/login")}
        >
          Inicia sesión ahora
        </span>
      </p>
    </form>


    {loadingUsers && <p className="status-text">Cargando...</p>}
    {errorUsers && <p className="error-text">{errorUsers}</p>}
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


export default Register;