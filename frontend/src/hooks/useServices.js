import { useState, useEffect } from 'react';
import { createService, updateService, deleteService, getMyServices, getServiceById } from '../services/servicesApi.js';
import { fetchWithToken } from '../services/config.js';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem('token');

  const fetchMyServices = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getMyServices(token);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        setError('Error fetching services');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('subDir', 'images');
    
    const response = await fetchWithToken('/uploads', {
      method: 'POST',
      body: uploadData,
    });
    
    if (!response.ok) {
      throw new Error('Error subiendo imagen');
    }
    
    return await response.text();
  };

  const addService = async (serviceData) => {
    setLoading(true);
    try {
      // Si hay un archivo de imagen, subirlo primero
      let coverImageUrl = serviceData.coverImageUrl || null;
      if (serviceData.coverImageFile) {
        coverImageUrl = await uploadImage(serviceData.coverImageFile);
      }
      
      // Preparar datos para enviar (sin el archivo)
      const dataToSend = {
        name: serviceData.name,
        description: serviceData.description,
        deliveryDuration: serviceData.deliveryDuration,
        categoryId: serviceData.categoryId,
        price: serviceData.price,
        coverImageUrl: coverImageUrl,
        projectIds: serviceData.projectIds
      };

      const response = await createService(dataToSend, token);
      
      if (response.ok) {
        const newService = await response.json();
        setServices(prev => [...prev, newService]);
        return newService;
      }
      const errorText = await response.text();
      throw new Error(errorText || 'Error creating service');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editService = async (id, serviceData) => {
    setLoading(true);
    try {
      // Si hay un archivo de imagen nuevo, subirlo primero
      let coverImageUrl = serviceData.coverImageUrl || null;
      if (serviceData.coverImageFile) {
        coverImageUrl = await uploadImage(serviceData.coverImageFile);
      }
      
      // Preparar datos para enviar (sin el archivo)
      const dataToSend = {
        name: serviceData.name,
        description: serviceData.description,
        deliveryDuration: serviceData.deliveryDuration,
        categoryId: serviceData.categoryId,
        price: serviceData.price,
        coverImageUrl: coverImageUrl,
        projectIds: serviceData.projectIds
      };

      const response = await updateService(id, dataToSend, token);
      if (response.ok) {
        const updatedService = await response.json();
        setServices(prev => prev.map(s => s.id === id ? updatedService : s));
        return updatedService;
      }
      const errorText = await response.text();
      throw new Error(errorText || 'Error updating service');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeService = async (id) => {
    setLoading(true);
    try {
      const response = await deleteService(id, token);
      if (response.ok) {
        setServices(prev => prev.filter(s => s.id !== id));
        return true;
      }
      const errorText = await response.text();
      throw new Error(errorText || 'Error deleting service');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceById = async (id) => {
    setLoading(true);
    try {
      const response = await getServiceById(id);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        setError('Error fetching service');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, [token]);

  return {
    services,
    loading,
    error,
    addService,
    editService,
    removeService,
    fetchServiceById,
    refetch: fetchMyServices
  };
};