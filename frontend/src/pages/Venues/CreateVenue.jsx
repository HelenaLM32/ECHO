import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVenue } from "../../services/venues";
import "./CreateVenue.css";

export default function CreateVenue() {
  const navigate = useNavigate();
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
      if (img) {
        dataToSend.append("images", img);
      }
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
    <div className="create-venue-page">
      <div className="create-venue-container">
        <h1 className="create-venue-title">Anuncia tu local</h1>
        <p className="create-venue-subtitle">Cuéntanos sobre el espacio que ofreces</p>

        {error && <div className="create-venue-error">{error}</div>}

        <form onSubmit={handleSubmit} className="create-venue-form">
          <div className="form-group">
            <label>Nombre del local</label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Sala Moonlight"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="address"
              placeholder="Calle, Ciudad, CP"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Aforo máximo</label>
            <input
              type="number"
              name="capacity"
              placeholder="Ej: 150"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Imágenes del local (Máx. 3)</label>
            <div className="wallapop-grid">
              {previews.map((preview, index) => (
                <div key={index} className="image-box">
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </button>
                      {index === 0 && <span className="main-tag">Principal</span>}
                    </>
                  ) : (
                    <label className="upload-label">
                      <span className="plus">+</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, index)}
                        hidden
                      />
                    </label>
                  )}
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
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creando..." : "Publicar local"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}