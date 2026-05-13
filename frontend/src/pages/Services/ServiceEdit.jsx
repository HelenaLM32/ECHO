import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceById, updateService } from "../../services/servicesApi";
import { getCategories } from "../../services/projects";
import { uploadFile } from "../../services/uploads";
import ServiceProjectPicker from "../../components/ServiceProjectPicker/ServiceProjectPicker";
import Footer from "../../components/Footer/Footer";
import { getAuthToken } from "../../services/session";
import "./Services.css";

export default function ServiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getAuthToken();

  const [form, setForm] = useState({
    name: "",
    description: "",
    deliveryDuration: "1",
    categoryId: "",
    price: "",
    projectIds: [],
  });

  const [categories, setCategories] = useState([]);
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingService, setLoadingService] = useState(true);

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch {
        // Error silenciado
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Cargar datos del servicio existente
  useEffect(() => {
    const loadService = async () => {
      try {
        const response = await getServiceById(id);
        if (!response.ok) {
          throw new Error("Error al cargar el servicio");
        }
        const data = await response.json();

        setForm({
          name: data.name || "",
          description: data.description || "",
          deliveryDuration: String(data.deliveryDuration || "1"),
          categoryId: String(data.categoryId || ""),
          price: data.price ? String(data.price) : "",
          projectIds: data.projects?.map((p) => p.id) || [],
        });

        if (data.coverImageUrl) {
          setExistingImageUrl(data.coverImageUrl);
          setImgPreview(data.coverImageUrl);
        }
      } catch {
        setError("Error al cargar el servicio");
      } finally {
        setLoadingService(false);
      }
    };
    loadService();
  }, [id]);

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
    setForm((prev) => ({ ...prev, projectIds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.categoryId) {
      setError("Nombre y categoria son obligatorios");
      return;
    }

    // Precio es opcional, pero si se introduce debe ser válido
    let priceValue = null;
    if (form.price && form.price.trim() !== "") {
      const parsedPrice = parseFloat(form.price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        setError("El precio debe ser un numero valido mayor o igual a 0");
        return;
      }
      priceValue = parsedPrice;
    }

    setLoading(true);
    setError("");

    try {
      // Subir imagen primero si hay archivo nuevo
      let coverImageUrl = existingImageUrl;
      if (imgFile) {
        coverImageUrl = await uploadFile(imgFile, "images");
      }

      // Preparar datos para enviar
      const submitData = {
        name: form.name,
        description: form.description,
        deliveryDuration: parseInt(form.deliveryDuration) || 1,
        categoryId: parseInt(form.categoryId),
        price: priceValue,
        projectIds: form.projectIds.map((id) => Number(id)),
        coverImageUrl: coverImageUrl,
      };

      const response = await updateService(id, submitData, token);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar el servicio");
      }

      navigate("/profile");
    } catch (err) {
      setError(err.message || "Error al actualizar el servicio");
    } finally {
      setLoading(false);
    }
  };

  if (loadingService) {
    return (
      <div className="service-page">
        <div className="service-container">
          <p>Cargando servicio...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="service-page">
      <div className="service-container">
        <header className="service-header">
          <h1 className="service-title">Editar servicio</h1>
          <p className="service-desc">
            Modifica la informacion de tu servicio.
          </p>
        </header>

        {error && <div className="msg error">{error}</div>}

        <form onSubmit={handleSubmit} className="service-form">
          <div className="service-card">
            <h2 className="service-section-title">Informacion General</h2>

            <div className="field-group">
              <label>Nombre del servicio *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Diseno de logo profesional"
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Categoria *</label>
              {loadingCategories ? (
                <div className="field-hint">Cargando categorias...</div>
              ) : (
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Selecciona una categoria</option>
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
                <label>Precio ($)</label>
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
                      <img
                        src={imgPreview}
                        alt="Preview"
                        className="img-content"
                      />
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => {
                          setImgFile(null);
                          setImgPreview(null);
                          setExistingImageUrl(null);
                        }}
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
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
