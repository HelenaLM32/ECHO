import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceForm from '../../components/services/ServiceForm';
import { useServices } from '../../hooks/useServices';

const ServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editService, fetchServiceById } = useServices();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      try {
        const data = await fetchServiceById(id);
        // Transform projects to projectIds for the form
        const transformedData = {
          ...data,
          projectIds: data.projects ? data.projects.map(p => p.id) : []
        };
        setService(transformedData);
      } catch (error) {
        alert('Error loading service');
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await editService(id, data);
      navigate('/profile');
    } catch (error) {
      alert('Error updating service');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Service</h1>
      <ServiceForm
        initialData={service}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/profile')}
      />
    </div>
  );
};

export default ServiceEdit;