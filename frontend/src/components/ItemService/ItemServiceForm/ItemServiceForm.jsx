import { useState, useEffect } from 'react';
import ItemServiceProjectPicker from '../../ItemServiceProjectPicker/ItemServiceProjectPicker';
import { getCategories } from '../../../services/projects';
import './ItemServiceForm.css';

function ItemServiceForm({ initialData = {}, onSubmit, onCancel, saving = false }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    deliveryDuration: initialData.deliveryDuration || 1,
    categoryId: initialData.categoryId || '',
    price: initialData.price || '',
    coverImageUrl: initialData.coverImageUrl || '',
    coverImageFile: null,
    projectIds: initialData.projectIds || []
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'coverImageFile') {
      setFormData(prev => ({ ...prev, coverImageFile: files?.[0] || null }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectsChange = (projectIds) => {
    setFormData(prev => ({ ...prev, projectIds }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
          <label htmlFor="name">Nombre del servicio *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Diseño de logo profesional"
            required
          />
        </div>

      <div className="form-group">
        <label htmlFor="description">Descripcion</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe que incluye tu servicio..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="deliveryDuration">Tiempo de entrega (dias) *</label>
        <input
          type="number"
          id="deliveryDuration"
          name="deliveryDuration"
          value={formData.deliveryDuration}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoryId">Categoria *</label>
        {loadingCategories ? (
          <div>Cargando categorias...</div>
        ) : (
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoria</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="price">Precio ($) *</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          placeholder="0.00"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="coverImageFile">Imagen de portada</label>
        <input
          type="file"
          id="coverImageFile"
          name="coverImageFile"
          accept="image/*"
          onChange={handleChange}
        />
        {formData.coverImageUrl && !formData.coverImageFile && (
          <div className="image-preview">
            <p>Imagen actual:</p>
            <img src={formData.coverImageUrl} alt="Portada actual" />
          </div>
        )}
        {formData.coverImageFile && (
          <div className="image-preview">
            <p>Nueva imagen:</p>
            <img src={URL.createObjectURL(formData.coverImageFile)} alt="Nueva portada" />
          </div>
        )}
      </div>

      <ItemServiceProjectPicker
        selectedProjects={formData.projectIds}
        onSelectionChange={handleProjectsChange}
      />

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  </>
);
}

export default ItemServiceForm;
