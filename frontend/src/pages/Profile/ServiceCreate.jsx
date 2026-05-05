import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceForm from '../../components/services/ServiceForm';
import { useServices } from '../../hooks/useServices';

const ServiceCreate = () => {
  const navigate = useNavigate();
  const { addService } = useServices();

  const handleSubmit = async (data) => {
    try {
      await addService(data);
      navigate('/profile');
    } catch (error) {
      alert('Error creating service');
    }
  };

  return (
    <div>
      <h1>Create Service</h1>
      <ServiceForm onSubmit={handleSubmit} onCancel={() => navigate('/profile')} />
    </div>
  );
};

export default ServiceCreate;