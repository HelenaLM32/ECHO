import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVenue } from "../../services/venues";
import { useAuth } from "../../context/AuthContext";
import "./CreateVenue.css";

export default function CreateVenue() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: "",
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
    setLoading(true);
    setError("");

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("address", formData.address);
    dataToSend.append("capacity", formData.capacity);

    images.forEach((img) => {
      if (img) dataToSend.append("images", img);
    });

    try {
      await createVenue(dataToSend);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="venue-page">
      <div className="venue-wrapper">
        <header className="venue-header">
          <h1 className="venue-heading">Anuncia tu local</h1>
          <p className="venue-description">
            Registra tu espacio para que otros puedan organizar eventos en él.
          </p>
        </header>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="card">
            <h2 className="card-title">Detalles del espacio</h2>

            <div className="form-group">
              <label className="form-label">Nombre del local *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dirección *</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Aforo</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Galería</h2>
            <p className="helper-text">
              Añade hasta 3 fotos. La primera será la principal.
            </p>

            <div className="upload-grid">
              {previews.map((preview, index) => (
                <div key={index} className="upload-item">
                  <div className="upload-box">
                    {preview ? (
                      <div className="preview">
                        <img src={preview} alt="venue preview" />
                        <button
                          type="button"
                          className="preview-remove"
                          onClick={() => removeImage(index)}
                        >
                          ✕
                        </button>
                        {index === 0 && (
                          <span className="preview-badge">
                            principal
                          </span>
                        )}
                      </div>
                    ) : (
                      <label className="upload-placeholder">
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
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}