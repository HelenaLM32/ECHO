import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../services/events";
import { getVenuesByUser } from "../../services/venues";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer/Footer";
import "./CreateEvent.css";

export default function EditEvent() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user } = useAuth();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  const [existingImg, setExistingImg] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getVenuesByUser(user.id)
        .then(setVenues)
        .catch(() => setVenues([]));
    }
  }, [user]);

  useEffect(() => {
    setFetchLoading(true);
    getEventById(eventId)
      .then((event) => {
        const toLocalInput = (isoString) => {
          if (!isoString) return "";
          return isoString.slice(0, 16);
        };
        setForm({
          title:        event.title        || "",
          description:  event.description  || "",
          venueId:      event.venueId      ? String(event.venueId) : "",
          startDate:    toLocalInput(event.startDate),
          endDate:      toLocalInput(event.endDate),
          precio:       event.precio       != null ? String(event.precio) : "",
          categoria:    event.categoria    || "",
          linkEntradas: event.linkEntradas || "",
        });
        if (event.img) {
          setExistingImg(event.img);
          setImgPreview(event.img);
        }
      })
      .catch(() => setError("No se pudo cargar el evento"))
      .finally(() => setFetchLoading(false));
  }, [eventId]);

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

  const removeImage = () => {
    setImgFile(null);
    setImgPreview(null);
    setExistingImg(null);
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
  setSuccess("");

  const imageWasRemoved = existingImg === null && imgFile === null;

  try {
    await updateEvent(
      eventId,
      {
        title:        form.title,
        description:  form.description,  
        venueId:      parseInt(form.venueId),
        startDate:    form.startDate,
        endDate:      form.endDate,
        precio:       form.precio !== "" ? parseFloat(form.precio) : null,
        categoria:    form.categoria    || undefined,
        linkEntradas: form.linkEntradas || undefined,
      },
      imgFile,
      imageWasRemoved 
    );
    setSuccess("Evento actualizado correctamente");
    setTimeout(() => navigate("/profile"), 1200);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (fetchLoading) return <div className="profile-page-loading">Cargando evento...</div>;

  return (
    <div className="event-page">
      <div className="event-container">
        <header className="event-header">
          <h1 className="event-title">Editar evento</h1>
          <p className="event-desc">Modifica los detalles de tu evento.</p>
        </header>

        {error   && <div className="msg error">{error}</div>}
        {success && <div className="msg success">{success}</div>}

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
              <div className="image-upload-zone" style={{ display: "block" }}>
                <div className="image-preview-box">
                  {imgPreview ? (
                    <>
                      <img src={imgPreview} alt="Preview" className="img-content" />
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={removeImage}
                      >
                        ✕
                      </button>
                      <span className="image-badge">
                        {imgFile ? "Nueva imagen" : "Imagen actual"}
                      </span>
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
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
