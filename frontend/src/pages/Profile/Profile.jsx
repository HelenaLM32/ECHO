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
      <h1>Perfil</h1>
      <div className="profile-card">
        <p><strong>Usuario:</strong> {user.username}</p>
        <p><strong>Correo:</strong> {user.email}</p>
      </div>
    </div>
  );
}