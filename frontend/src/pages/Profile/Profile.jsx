import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfileByUserId, updateProfile } from "../../services/profile";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const { userId } = useParams(); // Si hay userId en la URL = perfil ajeno

  // Si hay userId en la URL, ver ese perfil; si no, ver el propio
  const targetId = userId ? parseInt(userId) : user?.id;
  const isOwnProfile = !userId || parseInt(userId) === user?.id;

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    publicName: "",
    bio: "",
    location: "",
    avatarUrl: "",
    bannerUrl: "",
    linkedin: "",
    instagram: "",
    twitter: "",
  });

  useEffect(() => {
    if (!targetId) return;
    setLoading(true);
    getProfileByUserId(targetId)
      .then((data) => {
        setProfile(data);
        setForm({
          publicName: data.publicName || "",
          bio: data.bio || "",
          location: data.location || "",
          avatarUrl: data.avatarUrl || "",
          bannerUrl: data.bannerUrl || "",
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
        });
      })
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoading(false));
  }, [targetId]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await updateProfile(targetId, form);
      setProfile(updated);
      setEditing(false);
    } catch {
      setError("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="profile-container">
        <p>Cargando...</p>
      </div>
    );

  if (error && !profile)
    return (
      <div className="profile-container">
        <p className="profile-error">{error}</p>
      </div>
    );

  if (!profile) return null;

  return (
    <div className="profile-container">
      {/* Banner */}
      {profile.bannerUrl && (
        <div className="profile-banner">
          <img src={profile.bannerUrl} alt="Banner" />
        </div>
      )}

      {/* Avatar y nombre */}
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.username} />
          ) : (
            <span>{profile.username?.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="profile-info">
          <h1 className="profile-username">
            {profile.publicName || profile.username}
          </h1>
          {isOwnProfile && <p className="profile-email">{profile.email}</p>}
        </div>
      </div>

      {/* Contenido del perfil */}
      {!editing ? (
        <div className="profile-card">
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <div className="profile-meta">
            {profile.location && <span>📍 {profile.location}</span>}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                🔗 LinkedIn
              </a>
            )}
            {profile.instagram && (
              <a href={profile.instagram} target="_blank" rel="noreferrer">
                🔗 Instagram
              </a>
            )}
            {profile.twitter && (
              <a href={profile.twitter} target="_blank" rel="noreferrer">
                🔗 Twitter
              </a>
            )}
          </div>
          {isOwnProfile && (
            <button className="btn-edit" onClick={() => setEditing(true)}>
              Editar perfil
            </button>
          )}
        </div>
      ) : (
        // Formulario de edición
        <div className="profile-card profile-edit-form">
          <label>Nombre público</label>
          <input
            type="text"
            value={form.publicName}
            onChange={(e) => setForm({ ...form, publicName: e.target.value })}
            placeholder="Nombre que verán otros usuarios"
          />

          <label>Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Cuéntanos sobre ti..."
            maxLength={500}
          />

          <label>Ubicación</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Barcelona, España"
          />

          <label>URL de avatar</label>
          <input
            type="url"
            value={form.avatarUrl}
            onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
            placeholder="https://..."
          />

          <label>URL de banner</label>
          <input
            type="url"
            value={form.bannerUrl}
            onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
            placeholder="https://..."
          />

          <label>LinkedIn</label>
          <input
            type="url"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />

          <label>Instagram</label>
          <input
            type="url"
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            placeholder="https://instagram.com/..."
          />

          <label>Twitter</label>
          <input
            type="url"
            value={form.twitter}
            onChange={(e) => setForm({ ...form, twitter: e.target.value })}
            placeholder="https://twitter.com/..."
          />

          {error && <p className="profile-error">{error}</p>}

          <div className="profile-edit-actions">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button className="btn-cancel" onClick={() => setEditing(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}