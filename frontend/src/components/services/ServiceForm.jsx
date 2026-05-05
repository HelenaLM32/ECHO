import React, { useState, useEffect } from 'react';
import ServiceProjectPicker from './ServiceProjectPicker';
import { getCategories } from '../../services/projects';
import './ServiceForm.css';

const ServiceForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    deliveryDuration: initialData.deliveryDuration || 1,
    category: initialData.category || '',
    price: initialData.price || '',
    coverImageUrl: initialData.coverImageUrl || '',
    projectIds: initialData.projectIds || []
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectsChange = (projectIds) => {
    setFormData(prev => ({ ...prev, projectIds }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure projectIds is sent as array of numbers
    const submitData = {
      ...formData,
      deliveryDuration: Number(formData.deliveryDuration),
      projectIds: formData.projectIds.map(id => Number(id))
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="service-form">
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="deliveryDuration">Delivery days *</label>
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
        <label htmlFor="category">Category *</label>
        {loadingCategories ? (
          <div>Loading categories...</div>
        ) : (
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="price">Price *</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="coverImageUrl">Cover Image URL</label>
        <input
          type="url"
          id="coverImageUrl"
          name="coverImageUrl"
          value={formData.coverImageUrl}
          onChange={handleChange}
        />
      </div>

      <ServiceProjectPicker
        selectedProjects={formData.projectIds}
        onSelectionChange={handleProjectsChange}
      />

      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default ServiceForm;