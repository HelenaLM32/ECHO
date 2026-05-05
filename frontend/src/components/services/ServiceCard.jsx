import React from 'react';
import './ServiceCard.css'; // Asumir que creas este CSS

const ServiceCard = ({ service, onEdit, onDelete }) => {
  return (
    <div className="service-card">
      {service.coverImageUrl && (
        <img src={service.coverImageUrl} alt={service.name} className="service-cover" />
      )}
      <div className="service-info">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <p>Category: {service.category}</p>
        <p>Price: ${service.price}</p>
        <p>Delivery: {service.deliveryDuration} días</p>
        <div className="service-projects">
          {service.projects && service.projects.map(project => (
            <span key={project.id} className="project-tag">{project.title}</span>
          ))}
        </div>
      </div>
      <div className="service-actions">
        <button onClick={() => onEdit(service.id)}>Edit</button>
        <button onClick={() => onDelete(service.id)}>Delete</button>
      </div>
    </div>
  );
};

export default ServiceCard;