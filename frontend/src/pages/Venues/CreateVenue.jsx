import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVenue } from "../../services/venues";
import Footer from "../../components/Footer/Footer";
import "../Events/CreateEvent.css";

export default function CreateVenue() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: "",
    telefono: "",
    email: "",
    sitioWeb: "",
    horario: "",
  });

  const [images, setImages] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...previews];
      newPreviews[index] = reader.result;
      setPreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
    const newPreviews = [...previews];
    newPreviews[index] = null;
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      setError("Nombre y dirección son obligatorios");
      return;
    }
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    if (formData.capacity)   data.append("capacity",  formData.capacity);
    if (formData.telefono)   data.append("telefono",  formData.telefono);
    if (formData.email)      data.append("email",     formData.email);
    if (formData.sitioWeb)   data.append("sitioWeb",  formData.sitioWeb);
    if (formData.horario)    data.append("horario",   formData.horario);
    images.forEach((img) => { if (img) data.append("images", img); });

    try {
      await createVenue(data);
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
          <h1 className="event-title">Anuncia tu local</h1>
          <p className="event-desc">
            Registra tu espacio para que otros puedan organizar eventos en él.
          </p>
        </header>

        {error && <div className="msg error">{error}</div>}

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
                placeholder="Ej: Sala Apolo"
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
                placeholder="Ej: Carrer de la Nou de la Rambla, 113"
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
                placeholder="Ej: 500"
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
              Añade hasta 3 fotos. La primera será la principal.
            </p>

            <div className="image-upload-zone">
              {previews.map((preview, index) => (
                <div key={index} className="image-preview-box">
                  {preview ? (
                    <>
                      <img src={preview} alt="preview" className="img-content" />
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
              {loading ? "Registrando..." : "Publicar Local"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
