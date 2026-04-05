import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-container">
      <h1>Perfil</h1>
      <div className="profile-card">
        <p><strong>Usuario:</strong> {user.username}</p>
        <p><strong>Correo:</strong> {user.email}</p>
      </div>
    </div>
  );
}