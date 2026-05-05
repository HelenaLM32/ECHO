import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProjectsByUserId } from '../../services/projects';
import './ServiceProjectPicker.css';

const ServiceProjectPicker = ({ selectedProjects, onSelectionChange, maxSelection = 6 }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProjectsByUserId(user.id);
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.id]);

  const handleSelect = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      onSelectionChange(selectedProjects.filter(id => id !== projectId));
    } else if (selectedProjects.length < maxSelection) {
      onSelectionChange([...selectedProjects, projectId]);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="service-project-picker">
      <h3>Select Projects (max {maxSelection})</h3>
      {selectedProjects.length >= maxSelection && (
        <p className="warning">Maximum projects selected.</p>
      )}
      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="no-projects">No tienes proyectos disponibles para seleccionar.</div>
        ) : projects.map(project => {
          const title = project.title || project.item?.title || 'Proyecto sin título';
          const description = project.description || project.item?.description || 'Sin descripción disponible';
          return (
            <div
              key={project.id}
              className={`project-card ${selectedProjects.includes(project.id) ? 'selected' : ''}`}
              onClick={() => handleSelect(project.id)}
            >
              <h4>{title}</h4>
              <p>{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceProjectPicker;