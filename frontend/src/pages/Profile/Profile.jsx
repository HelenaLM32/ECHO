import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header-container">
        <img src="" alt="" />
      </div>
        <div className="profile-main-container-nav">nav</div>

      <div className="profile-main-container">
        <div className="profile-main-container-left">
          <div id="main-container-left-nameinfo">
            <p id="username">{user.username}</p>
            <p id="location">Ubicacion</p>
          </div>
          <div id="main-container-left-buttons">
             <div  className="btn-profile" id="btn-secondary-profile">
              Editar informacion del perfil
            </div>
            <div className="btn-profile" id="btn-primary-profile">
              Personalizar perfil
            </div>
          </div>
          <div id="main-container-left-workexperience">
            3
          </div>
        </div>
        <div className="profile-main-container-right">
          <div id="main-container-right-section">
            <div className="section-button-profile">Trabajos</div>
            <div className="section-button-profile">Valoraciones</div>
            <div className="section-button-profile">Productos</div>
            <div className="section-button-profile">Servicios</div>
            <div className="section-button-profile">Estadisticas</div>

          </div>
          <div id="main-container-right-proyects">
            2
          </div>
          <div id="main-container-right-section">
            <div className="second-section-button-profile">Calendario</div>
            <div className="second-section-button-profile">Compras</div>
          </div>
          <div id="main-container-right-subsection">
            4
          </div>
        </div>
      </div>
    </div>

    // <div className="profile-container">
    //   <h1>Perfil</h1>
    //   <div className="profile-card">
    //     <p><strong>Usuario:</strong> {user.username}</p>
    //     <p><strong>Correo:</strong> {user.email}</p>
    //   </div>
    // </div>
  );
}