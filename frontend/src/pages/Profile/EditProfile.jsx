import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfileByUserId, updateProfile } from "../../services/profile";
import "./EditProfile.css";

export default function EditProfile() {
  const { user, loadingContext } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    bio: "",
    location: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    experience: "",
  });

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
        });
      })
      .catch(() => {
        console.error("Error al obtener el perfil");
      })
      .finally(() => setLoading(false));
  }, [user, loadingContext]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      };

      await updateProfile(user.id, profileData);
      navigate("/profile");
    } catch (error) {
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
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

          <div className="edit-actions">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
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
        <p className="edit-section-title">REDES SOCIALES</p>
        <div className="social-row">
          <span className="social-label">LinkedIn</span>
          <input
            className="social-input"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="URL de tu LinkedIn"
          />
        </div>
        <div className="social-row">
          <span className="social-label">Twitter</span>
          <input
            className="social-input"
            name="twitter"
            value={form.twitter}
            onChange={handleChange}
            placeholder="URL de tu Twitter"
          />
        </div>
        <div className="social-row">
          <span className="social-label">Instagram</span>
          <input
            className="social-input"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="URL de tu Instagram"
          />
        </div>
      </div>
    </div>
  );
}
