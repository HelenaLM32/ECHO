import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVenueById, updateVenue } from "../../services/venues";
import Footer from "../../components/Footer/Footer";
import "../Events/CreateEvent.css";

export default function EditVenue() {
  const navigate = useNavigate();
  const { venueId } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: "",
    telefono: "",
    email: "",
    sitioWeb: "",
    horario: "",
  });

  const [existingImages, setExistingImages] = useState([null, null, null]);
  const [newImages, setNewImages] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);

  useEffect(() => {
    setFetchLoading(true);
    getVenueById(venueId)
      .then((venue) => {
        setFormData({
          name:      venue.name      || "",
          address:   venue.address   || "",
          capacity:  venue.capacity  || "",
          telefono:  venue.telefono  || "",
          email:     venue.email     || "",
          sitioWeb:  venue.sitioWeb  || "",
          horario:   venue.horario   || "",
        });
        const imgs = [venue.img1 || null, venue.img2 || null, venue.img3 || null];
        setExistingImages(imgs);
        setPreviews(imgs);
      })
      .catch(() => setError("No se pudo cargar el local"))
      .finally(() => setFetchLoading(false));
  }, [venueId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...newImages];
    updated[index] = file;
    setNewImages(updated);
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedPreviews = [...previews];
      updatedPreviews[index] = reader.result;
      setPreviews(updatedPreviews);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    const updatedNew = [...newImages];
    updatedNew[index] = null;
    setNewImages(updatedNew);
    const updatedExisting = [...existingImages];
    updatedExisting[index] = null;
    setExistingImages(updatedExisting);
    const updatedPreviews = [...previews];
    updatedPreviews[index] = null;
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      setError("Nombre y dirección son obligatorios");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("name",    formData.name);
    data.append("address", formData.address);
    if (formData.capacity) data.append("capacity", formData.capacity);
    data.append("telefono", formData.telefono);
    data.append("email",    formData.email);
    data.append("sitioWeb", formData.sitioWeb);
    data.append("horario",  formData.horario);
    newImages.forEach((img) => { if (img) data.append("images", img); });

    try {
      await updateVenue(venueId, data);
      setSuccess("Local actualizado correctamente");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="profile-page-loading">Cargando local...</div>;

  return (
    <div className="event-page">
      <div className="event-container">
        <header className="event-header">
          <h1 className="event-title">Editar local</h1>
          <p className="event-desc">Modifica los datos de tu espacio.</p>
        </header>

        {error   && <div className="msg error">{error}</div>}
        {success && <div className="msg success">{success}</div>}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="event-card">
            <h2 className="event-section-title">Detalles del espacio</h2>

            <div className="field-group">
              <label>Nombre del local *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Dirección *</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Aforo</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className="input-field"
              />
            </div>
          </div>

          <div className="event-card">
            <h2 className="event-section-title">Información de contacto</h2>

            <div className="field-group">
              <label>Teléfono de contacto</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: +34 93 123 45 67"
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Email de contacto</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: info@salaapolo.com"
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Sitio web</label>
              <input
                type="url"
                name="sitioWeb"
                value={formData.sitioWeb}
                onChange={handleChange}
                placeholder="Ej: https://www.salaapolo.com"
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Horario de atención</label>
              <input
                type="text"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                placeholder="Ej: Lunes a Viernes 10:00 - 22:00"
                className="input-field"
              />
            </div>
          </div>

          <div className="event-card">
            <h2 className="event-section-title">Galería</h2>
            <p className="field-hint">
              Haz clic en una imagen para reemplazarla. La primera es la principal.
            </p>

            <div className="image-upload-zone">
              {previews.map((preview, index) => (
                <div key={index} className="image-preview-box">
                  {preview ? (
                    <>
                      <img src={preview} alt={`foto ${index + 1}`} className="img-content" />
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </button>
                      {index === 0 && (
                        <span className="image-badge">Principal</span>
                      )}
                    </>
                  ) : (
                    <label className="upload-label">
                      <span className="upload-icon">+</span>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleImageChange(e, index)}
                      />
                    </label>
                  )}
                </div>
              ))}
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
