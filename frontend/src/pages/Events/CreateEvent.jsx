import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/events";
import { getVenuesByUser } from "../../services/venues";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Navigation/Footer/Footer";
import "./CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venues, setVenues] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    venueId: "",
    startDate: "",
    endDate: "",
    precio: "",
    categoria: "",
    linkEntradas: "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      getVenuesByUser(user.id)
        .then(setVenues)
        .catch(() => setVenues([]));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getTodayMin = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImgPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.venueId || !form.startDate || !form.endDate) {
      setError("Título, local y fechas son obligatorios");
      return;
    }
    if (new Date(form.startDate) < new Date()) {
      setError("La fecha de inicio no puede ser anterior a la fecha actual");
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setError("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }
    if (form.precio !== "" && (isNaN(parseFloat(form.precio)) || parseFloat(form.precio) < 0)) {
      setError("El precio debe ser un número positivo");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await createEvent(
        {
          title:        form.title,
          description:  form.description,
          venueId:      parseInt(form.venueId),
          startDate:    form.startDate,
          endDate:      form.endDate,
          precio:       form.precio       !== "" ? parseFloat(form.precio) : undefined,
          categoria:    form.categoria    || undefined,
          linkEntradas: form.linkEntradas || undefined,
        },
        imgFile
      );
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-page">
      <div className="event-container">
        <header className="event-header">
          <h1 className="event-title">Crear un evento</h1>
          <p className="event-desc">
            Completa la información para publicar tu evento en la plataforma.
          </p>
        </header>

        {error && <div className="msg error" role="alert" aria-live="assertive">{error}</div>}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="event-card">
            <h2 className="event-section-title">Información General</h2>

            <div className="field-group">
              <label>Título del evento *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Concierto de Jazz en vivo"
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Local *</label>
              <select
                name="venueId"
                value={form.venueId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Selecciona un local</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {v.address}
                  </option>
                ))}
              </select>
              {venues.length === 0 && (
                <p className="field-hint">
                  No tienes locales registrados.{" "}
                  <span
                    className="field-link"
                    onClick={() => navigate("/venues/create")}
                  >
                    Crear uno ahora
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="event-card">
            <h2 className="event-section-title">Fecha y Ubicación</h2>
            <div className="field-grid">
              <div className="field-group">
                <label>Inicio *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  min={getTodayMin()}
                  className="input-field"
                />
              </div>
              <div className="field-group">
                <label>Fin *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || getTodayMin()}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="event-card">
            <h2 className="event-section-title">Detalles Visuales</h2>

            <div className="field-group">
              <label>Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Cuéntale a la gente de qué trata el evento..."
                rows={4}
                className="textarea-field"
              />
            </div>

            <div className="field-group">
              <label>Imagen de portada</label>
              <div className="image-upload-zone">
                <div className="image-preview-box">
                  {imgPreview ? (
                    <>
                      <img src={imgPreview} alt="Preview" className="img-content" />
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => { setImgFile(null); setImgPreview(null); }}
                      >
                        ✕
                      </button>
                      <span className="image-badge">Principal</span>
                    </>
                  ) : (
                    <label className="upload-label">
                      <span className="upload-icon">+</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="event-card">
            <h2 className="event-section-title">Información adicional</h2>

            <div className="field-group">
              <label>Precio (€)</label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Ej: 15.00 — dejar vacío si es gratuito"
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Categoría</label>
              <input
                type="text"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                placeholder="Ej: Concierto, Exposición, Teatro, Fiesta..."
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Link de entradas</label>
              <input
                type="url"
                name="linkEntradas"
                value={form.linkEntradas}
                onChange={handleChange}
                placeholder="Ej: https://www.ticketmaster.es/..."
                className="input-field"
              />
            </div>
          </div>

          <div className="event-actions">
            <button
              type="button"
              className="btn-back-text"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Publicando..." : "Publicar Evento"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
