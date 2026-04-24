import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfileByUserId, updateProfile, updateCredentials, deleteAccount } from "../../services/profile";
import "./EditProfile.css";
import Footer from "../../components/Footer/Footer";

export default function EditProfile() {
  const { user, loadingContext, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    bio: "",
    location: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    experience: "",
    calendarUrl: "",
  });

  const [credentials, setCredentials] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [credentialError, setCredentialError] = useState("");
  const [credentialSuccess, setCredentialSuccess] = useState("");

  useEffect(() => {
    if (loadingContext || !user?.id) return;

    getProfileByUserId(user.id)
      .then((data) => {
        const parts = (data.publicName || "").split(" ");
        setForm({
          nombre: parts[0] || "",
          apellidos: parts.slice(1).join(" ") || "",
          bio: data.bio || "",
          location: data.location || "",
          twitter: data.twitter || "",
          instagram: data.instagram || "",
          linkedin: data.linkedin || "",
          experience: data.experience || "",
          calendarUrl: data.calendarUrl || "",
        });
        setCredentials((prev) => ({ ...prev, username: data.username || "" }));
      })
      .catch(() => console.error("Error al obtener el perfil"))
      .finally(() => setLoading(false));
  }, [user, loadingContext]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCredentialChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setCredentialError("");
    setCredentialSuccess("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const profileData = {
        publicName: `${form.nombre} ${form.apellidos}`.trim(),
        bio: form.bio,
        location: form.location,
        twitter: form.twitter,
        instagram: form.instagram,
        linkedin: form.linkedin,
        experience: form.experience,
        calendarUrl: form.calendarUrl,
      };
      await updateProfile(user.id, profileData);
      navigate("/profile");
    } catch (error) {
      alert("Error al guardar los cambios: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCredentials = async () => {
    setCredentialError("");
    setCredentialSuccess("");

    const isChangingPassword = credentials.newPassword || credentials.confirmPassword;
    const isChangingUsername = credentials.username && credentials.username !== user?.username;

    if (!isChangingUsername && !isChangingPassword) {
      setCredentialError("No hay cambios que guardar.");
      return;
    }

    if (isChangingPassword) {
      if (!credentials.currentPassword) {
        setCredentialError("Debes introducir tu contraseña actual.");
        return;
      }
      if (credentials.newPassword !== credentials.confirmPassword) {
        setCredentialError("Las contraseñas nuevas no coinciden.");
        return;
      }
      if (credentials.newPassword.length < 6) {
        setCredentialError("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }

    setSavingCredentials(true);
    try {
      const payload = {};
      if (isChangingUsername) payload.username = credentials.username;
      if (isChangingPassword) {
        payload.currentPassword = credentials.currentPassword;
        payload.newPassword = credentials.newPassword;
      }

      await updateCredentials(user.id, payload);

      setCredentialSuccess("Cambios guardados correctamente.");
      setCredentials((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setCredentialError(error.message);
    } finally {
      setSavingCredentials(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.",
    );
    if (!confirmed) return;

    const reconfirmed = window.confirm(
      "Última advertencia: se borrarán todos tus datos, pedidos y perfil.",
    );
    if (!reconfirmed) return;

    try {
      await deleteAccount(user.id);
      logout();
      navigate("/");
    } catch (error) {
      alert("Error al eliminar la cuenta: " + error.message);
    }
  };

  if (loading) return <div className="edit-page">Cargando...</div>;

  return (
    <div className="edit-page">
      <div className="edit-topbar">
        <button className="btn-back" onClick={() => navigate("/profile")}>
          Volver al perfil
        </button>
      </div>

      <div className="edit-card">
        <div className="edit-card-right" style={{ flex: 1 }}>
          <p className="edit-section-title">Información básica</p>

          <div className="edit-row">
            <div className="edit-field">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} />
            </div>
            <div className="edit-field">
              <label>Apellidos</label>
              <input name="apellidos" value={form.apellidos} onChange={handleChange} />
            </div>
          </div>

          <div className="edit-field full">
            <label>Ubicación (Ciudad, País)</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>

          <div className="edit-field full">
            <label>Bio / Descripción corta</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="3"
              style={{ width: "100%", borderRadius: "8px", padding: "10px", border: "1px solid #ddd" }}
            />
          </div>
        </div>
      </div>

      <div className="edit-card column">
        <p className="edit-section-title">EXPERIENCIA</p>
        <div className="edit-field full">
          <label>Resumen de experiencia laboral</label>
          <input
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Ej: 5 años en desarrollo web..."
          />
        </div>
      </div>

      <div className="edit-card column">
        <p className="edit-section-title">CALENDARIO</p>
        <p className="edit-section-desc">
          Vincula tu Google Calendar para que tus clientes puedan ver tu
          disponibilidad. Para obtener la URL: abre Google Calendar → Configuración
          del calendario → "Integrar calendario" → copia la URL del iframe (el src
          entre comillas).
        </p>
        <div className="edit-field full">
          <label>URL pública de Google Calendar (src del embed)</label>
          <input
            name="calendarUrl"
            value={form.calendarUrl}
            onChange={handleChange}
            placeholder="https://calendar.google.com/calendar/embed?src=..."
          />
        </div>
        {form.calendarUrl && (
          <div style={{ marginTop: "12px", borderRadius: "8px", overflow: "hidden" }}>
            <iframe
              src={form.calendarUrl}
              style={{
                border: "none",
                width: "100%",
                height: "300px",
                borderRadius: "8px",
              }}
              title="Vista previa del calendario"
            />
          </div>
        )}
      </div>

      <div className="edit-card column">
        <p className="edit-section-title">REDES SOCIALES</p>
        <div className="social-row">
          <span className="social-label">LinkedIn</span>
          <input className="social-input" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="URL de tu LinkedIn" />
        </div>
        <div className="social-row">
          <span className="social-label">Twitter</span>
          <input className="social-input" name="twitter" value={form.twitter} onChange={handleChange} placeholder="URL de tu Twitter" />
        </div>
        <div className="social-row">
          <span className="social-label">Instagram</span>
          <input className="social-input" name="instagram" value={form.instagram} onChange={handleChange} placeholder="URL de tu Instagram" />
        </div>

        <div className="edit-actions">
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      <div className="edit-card column">
        <p className="edit-section-title">CUENTA</p>
        <p className="edit-section-desc">
          Cambia tu contraseña.
        </p>

       

        <div className="credentials-divider" />

        <div className="edit-row">
          <div className="edit-field">
            <label>Contraseña actual</label>
            <input
              type="password"
              name="currentPassword"
              value={credentials.currentPassword}
              onChange={handleCredentialChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
        </div>

        <div className="edit-row">
          <div className="edit-field">
            <label>Nueva contraseña</label>
            <input
              type="password"
              name="newPassword"
              value={credentials.newPassword}
              onChange={handleCredentialChange}
              placeholder="Mín. 6 caracteres"
              autoComplete="new-password"
            />
          </div>
          <div className="edit-field">
            <label>Confirmar nueva contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={handleCredentialChange}
              placeholder="Repite la contraseña"
              autoComplete="new-password"
            />
          </div>
        </div>

        {credentialError && (
          <p className="credentials-msg credentials-msg--error">{credentialError}</p>
        )}
        {credentialSuccess && (
          <p className="credentials-msg credentials-msg--success">{credentialSuccess}</p>
        )}

        <div className="edit-actions">
          <button className="btn-save" onClick={handleSaveCredentials} disabled={savingCredentials}>
            {savingCredentials ? "Guardando..." : "Actualizar cuenta"}
          </button>
        </div>

        <div
          className="edit-card column"
          
        >
          <p className="edit-section-title">
            ZONA DE PELIGRO
          </p>
          <p className="edit-section-desc">
            Una vez elimines tu cuenta, no podrás recuperarla. Se borrarán todos tus
            datos permanentemente.
          </p>
          <div className="edit-actions">
            <button
              className="btn-save"
              onClick={handleDeleteAccount}
            >
              Eliminar mi cuenta
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
