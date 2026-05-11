import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, updateService } from '../../services/servicesApi';
import { uploadFile } from '../../services/uploads';
import ServiceForm from '../../components/ServiceForm/ServiceForm';
import './Services.css';

function ServiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const response = await getServiceById(id);
      if (!response.ok) {
        throw new Error('Error al cargar el servicio');
      }
      const data = await response.json();
      setService({
        ...data,
        projectIds: data.projects?.map(p => p.id) || []
      });
    } catch {
      alert('Error al cargar el servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      // Subir imagen primero si hay archivo nuevo
      let coverImageUrl = data.coverImageUrl || null;
      if (data.coverImageFile) {
        coverImageUrl = await uploadFile(data.coverImageFile, 'images');
      }
      
      // Preparar datos para enviar
      const dataToSend = {
        name: data.name,
        description: data.description,
        deliveryDuration: data.deliveryDuration,
        categoryId: data.categoryId,
        price: data.price,
        coverImageUrl: coverImageUrl,
        projectIds: data.projectIds
      };

      const response = await updateService(id, dataToSend, token);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar el servicio');
      }
      navigate('/profile');
    } catch (err) {
      alert(err.message || 'Error al actualizar el servicio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="service-form-page">
        <h1>Editar Servicio</h1>
        <div className="service-form-container">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-form-page">
      <h1>Editar Servicio</h1>
      <div className="service-form-container">
        <ServiceForm 
          initialData={service} 
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/profile')}
          saving={saving}
        />
      </div>
    </div>
  );
}

export default ServiceEdit;
