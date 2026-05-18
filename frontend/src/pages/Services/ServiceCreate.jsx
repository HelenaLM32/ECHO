import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createService } from "../../services/services";
import { getCategories } from "../../services/projects";
import { uploadFile } from "../../services/uploads";
import ServiceProjectPicker from "../../components/ItemService/ServiceProjectPicker/ServiceProjectPicker";
import Footer from "../../components/Navigation/Footer/Footer";

import "./Services.css";

export default function ServiceCreate() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    deliveryDuration: "1",
    categoryId: "",
    price: "",
    projectIds: []
  });
  
  const [categories, setCategories] = useState([]);
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (e) {
        console.error('Error loading categories:', e)
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImgPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProjectsChange = (projectIds) => {
    setForm(prev => ({ ...prev, projectIds }));
  };

  // Comprueba que los campos obligatorios esten rellenos
  const validateForm = () => {
    if (!form.name || !form.categoryId) {
      setError("Nombre y categoria son obligatorios");
      return false;
    }
    return true;
  };

  // Parsea el precio y valida que sea un numero correcto
  const parsePriceValue = () => {
    if (!form.price || form.price.trim() === '') {
      return null;
    }
    const parsedPrice = parseFloat(form.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("El precio debe ser un número válido mayor o igual a 0");
      return null;
    }
    return parsedPrice;
  };

  // Sube la imagen de portada si hay alguna seleccionada
  const uploadCoverImage = async () => {
    if (!imgFile) return null;
    try {
      return await uploadFile(imgFile, 'images');
    } catch (e) {
      throw new Error("Error al subir la imagen");
    }
  };

  // Construye el objeto con todos los datos del servicio
  const buildSubmitData = (priceValue, coverImageUrl) => ({
    name: form.name,
    description: form.description,
    deliveryDuration: parseInt(form.deliveryDuration) || 1,
    categoryId: parseInt(form.categoryId),
    price: priceValue,
    projectIds: form.projectIds.map(id => Number(id)),
    coverImageUrl: coverImageUrl
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const priceValue = parsePriceValue();
    if (priceValue === null && form.price) return;

    setLoading(true);
    setError("");
    
    try {
      const coverImageUrl = await uploadCoverImage();
      const submitData = buildSubmitData(priceValue, coverImageUrl);
      
      await createService(submitData);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Error al crear el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-page">
      <div className="service-container">
        <header className="service-header">
          <h1 className="service-title">Crear un servicio</h1>
          <p className="service-desc">
            Completa la información para publicar tu servicio en la plataforma.
          </p>
        </header>

        {error && <div className="msg error" role="alert" aria-live="assertive">{error}</div>}

        <form onSubmit={handleSubmit} className="service-form">
          <div className="service-card">
            <h2 className="service-section-title">Información General</h2>

            <div className="field-group">
              <label>Nombre del servicio *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Diseño de logo profesional"
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Categoría *</label>
              {loadingCategories ? (
                <div className="field-hint">Cargando categorías...</div>
              ) : (
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="service-card">
            <h2 className="service-section-title">Detalles del Servicio</h2>
            
            <div className="field-grid">
              <div className="field-group">
                <label>Tiempo de entrega (dias) *</label>
                <input
                  type="number"
                  name="deliveryDuration"
                  value={form.deliveryDuration}
                  onChange={handleChange}
                  min="1"
                  className="input-field"
                />
              </div>

              <div className="field-group">
                <label>Precio ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="input-field"
                />
              </div>
            </div>

            <div className="field-group">
              <label>Descripcion</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe que incluye tu servicio..."
                rows={4}
                className="textarea-field"
              />
            </div>
          </div>

          <div className="service-card">
            <h2 className="service-section-title">Imagen de Portada</h2>

            <div className="field-group">
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

          <div className="service-card">
            <h2 className="service-section-title">Proyectos Relacionados</h2>
            <ServiceProjectPicker
              selectedProjects={form.projectIds}
              onSelectionChange={handleProjectsChange}
            />
          </div>

          <div className="service-actions">
            <button
              type="button"
              className="btn-back-text"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Publicando..." : "Publicar Servicio"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
