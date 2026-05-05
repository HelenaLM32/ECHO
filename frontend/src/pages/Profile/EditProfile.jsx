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
    const toNullIfBlank = (value) => {
      if (value == null) return null;
      const trimmed = String(value).trim();
      return trimmed === "" ? null : trimmed;
    };

    const profileData = {
      publicName: `${form.nombre} ${form.apellidos}`.trim(),
      bio: toNullIfBlank(form.bio),
      location: toNullIfBlank(form.location),
      twitter: toNullIfBlank(form.twitter),
      instagram: toNullIfBlank(form.instagram),
      linkedin: toNullIfBlank(form.linkedin),
      experience: toNullIfBlank(form.experience),
      calendarUrl: toNullIfBlank(form.calendarUrl),
    };

    const lengthRules = [
      { key: "publicName", max: 100, label: "Nombre completo" },
      { key: "bio", max: 1000, label: "Bio" },
      { key: "location", max: 100, label: "Ubicación" },
      { key: "linkedin", max: 255, label: "LinkedIn" },
      { key: "instagram", max: 255, label: "Instagram" },
      { key: "twitter", max: 255, label: "Twitter" },
      { key: "experience", max: 255, label: "Experiencia" },
      { key: "calendarUrl", max: 500, label: "URL de calendario" },
    ];

    for (const rule of lengthRules) {
      const value = profileData[rule.key];
      if (value && value.length > rule.max) {
        alert(`${rule.label} supera el máximo de ${rule.max} caracteres.`);
        return;
      }
    }

    setSaving(true);
    try {
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
        setCredentialError("Mínimo 6 caracteres.");
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
    if (!window.confirm("¿Estás seguro de eliminar tu cuenta?")) return;
    if (!window.confirm("Acción irreversible. ¿Borrar todo?")) return;

    try {
      await deleteAccount(user.id);
      logout();
      navigate("/");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (loading) return <div className="edit-loading">Cargando configuración...</div>;

  return (
    <div className="edit-page">
      <div className="edit-topbar">
        <button className="btn-back" onClick={() => navigate("/profile")}>
          ← Volver al perfil
        </button>
      </div>

      <div className="edit-container">
        <section className="edit-card">
          <h2 className="edit-section-title">Información básica</h2>
          <div className="edit-grid">
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
              className="edit-textarea"
            />
          </div>
        </section>

        <section className="edit-card">
          <h2 className="edit-section-title">Experiencia</h2>
          <div className="edit-field full">
            <label>Resumen de experiencia laboral</label>
            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Ej: 5 años en desarrollo web..."
            />
          </div>
        </section>

        {/* SECCIÓN 3: CALENDARIO */}
        <section className="edit-card">
          <h2 className="edit-section-title">Calendario</h2>
          <p className="edit-section-desc">
            Vincula tu Google Calendar copiando la URL del <strong>src</strong> del iframe desde la configuración de tu calendario.
          </p>
          <div className="edit-field full">
            <label>URL de Google Calendar</label>
            <input
              name="calendarUrl"
              value={form.calendarUrl}
              onChange={handleChange}
              placeholder="https://calendar.google.com/calendar/embed?src=..."
            />
          </div>
          {form.calendarUrl && (
            <div className="calendar-preview">
              <iframe src={form.calendarUrl} title="Vista previa" className="edit-iframe-preview" />
            </div>
          )}
        </section>

        <section className="edit-card">
          <h2 className="edit-section-title">Redes Sociales</h2>
          <div className="social-rows">
            <div className="social-row">
              <span className="social-label">LinkedIn</span>
              <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="URL de tu LinkedIn" />
            </div>
            <div className="social-row">
              <span className="social-label">Twitter</span>
              <input name="twitter" value={form.twitter} onChange={handleChange} placeholder="URL de tu Twitter" />
            </div>
            <div className="social-row">
              <span className="social-label">Instagram</span>
              <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="URL de tu Instagram" />
            </div>
          </div>
          <div className="edit-actions">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar Información"}
            </button>
          </div>
        </section>

        <section className="edit-card">
          <h2 className="edit-section-title">Seguridad de la Cuenta</h2>
          <div className="edit-field full">
            <label>Contraseña actual</label>
            <input
              type="password"
              name="currentPassword"
              value={credentials.currentPassword}
              onChange={handleCredentialChange}
              placeholder="••••••••"
            />
          </div>
          <div className="edit-grid">
            <div className="edit-field">
              <label>Nueva contraseña</label>
              <input
                type="password"
                name="newPassword"
                value={credentials.newPassword}
                onChange={handleCredentialChange}
                placeholder="Mín. 6 caracteres"
              />
            </div>
            <div className="edit-field">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={credentials.confirmPassword}
                onChange={handleCredentialChange}
                placeholder="Repite la contraseña"
              />
            </div>
          </div>

          {credentialError && <div className="msg error">{credentialError}</div>}
          {credentialSuccess && <div className="msg success">{credentialSuccess}</div>}

          <div className="edit-actions">
            <button className="btn-save" onClick={handleSaveCredentials} disabled={savingCredentials}>
              {savingCredentials ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </div>
        </section>

        <section className="edit-card danger-zone">
          <h2 className="edit-section-title">Zona de Peligro</h2>
          <p className="edit-section-desc">
            Al eliminar tu cuenta, todos tus datos se perderán de forma permanente.
          </p>
          <div className="edit-actions">
            <button className="btn-save" onClick={handleDeleteAccount}>
              Eliminar mi cuenta permanentemente
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}