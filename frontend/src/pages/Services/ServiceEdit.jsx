import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceForm from '../../components/ServiceForm/ServiceForm';
import { useServices } from '../../hooks/useServices';
import './Services.css';

function ServiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editService, fetchServiceById } = useServices();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const data = await fetchServiceById(id);
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
    try {
      await editService(id, data);
      navigate('/profile');
    } catch {
      alert('Error al actualizar el servicio');
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
        <ServiceForm initialData={service} onSubmit={handleSubmit} onCancel={() => navigate('/profile')} />
      </div>
    </div>
  );
}

export default ServiceEdit;
