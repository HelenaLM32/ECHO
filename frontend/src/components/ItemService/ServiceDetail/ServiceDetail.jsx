import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { getProfileByUserId } from '../../../services/profile';
import { getProjectById } from '../../../services/projects';
import ProjectCardWithLike from '../../Cards/ProjectCard/ProjectCardWithLike';
import ProjectView from '../../../pages/ItemProject/ProjectView';
import OrderModal from '../../Modals/OrderModal/OrderModal';
import { useAuth } from '../../../context/AuthContext';
import './ServiceDetail.css';

const parsePrice = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

function ServiceDetail({ service, onClose }) {
  const navigate = useNavigate()
  const { user } = useAuth();
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [fullServiceProjects, setFullServiceProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleOpenProject = (projectId) => {
    setSelectedProjectId(projectId);
  };

  useEffect(() => {
    const loadCreatorData = async () => {
      try {
        if (service?.creatorId) {
          const profile = await getProfileByUserId(service.creatorId);
          setCreatorProfile(profile);
        }

        if (service?.projects?.length > 0) {
          const fullProjects = [];
          for (const projectSummary of service.projects) {
            try {
              const fullProject = await getProjectById(projectSummary.id);
              fullProjects.push(fullProject);
            } catch {
            }
          }
          setFullServiceProjects(fullProjects);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadCreatorData();
  }, [service?.creatorId, service?.projects]);

  if (!service) return null;

  const price = parsePrice(service.price ?? service.basePrice);
  const canOrder = user && user.id !== service.creatorId;

  return (
    <>
      <div className="service-detail-overlay" onClick={onClose}>
        <button className="service-detail-close" onClick={onClose} aria-label="Cerrar">
        <svg className="service-detail-close-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fillRule="evenodd"/>
        </svg>
      </button>
        <div className="service-detail-window" onClick={(e) => e.stopPropagation()}>

        <div className="service-detail-content">
          <div className="service-detail-image-section">
            {service.coverImageUrl ? (
              <img src={service.coverImageUrl} alt={service.name} className="service-detail-image" />
            ) : (
              <div className="service-detail-image-fallback">
                {service.name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
            )}

          </div>

          <div className="service-detail-info">
            <div className="service-detail-header">
              <h1 className="service-detail-title">{service.name || 'Sin título'}</h1>
              <div className="service-detail-meta">
                {service.category && <span className="service-detail-category">{service.category}</span>}
                {service.deliveryDuration != null && (
                  <span className="service-detail-delivery-badge">{service.deliveryDuration} días</span>
                )}
                {price > 0 && (
                  <span className="service-detail-price-badge">${price.toFixed(2)}</span>
                )}
              </div>
            </div>

            {service.description && (
              <p className="service-detail-description">{service.description}</p>
            )}

            {canOrder && (
              <button
                className="service-detail-order-btn"
                onClick={() => setShowOrderModal(true)}
              >
                Encargar servicio
              </button>
            )}

            {creatorProfile && (
              <div className="service-detail-creator">
                <h2>Creador</h2>
                <div className="service-detail-creator-card">
                  {creatorProfile.avatarUrl ? (
                    <img src={creatorProfile.avatarUrl} alt={creatorProfile.username} className="service-detail-creator-avatar" />
                  ) : (
                    <div className="service-detail-creator-avatar-fallback">
                      {creatorProfile.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="service-detail-creator-info">
                    <h3 onClick={() => navigate(`/profile/${service.creatorId}`)} style={{ cursor: 'pointer' }}>{creatorProfile.publicName || creatorProfile.username}</h3>
                    <p className="service-detail-creator-username" onClick={() => navigate(`/profile/${service.creatorId}`)} style={{ cursor: 'pointer' }}>@{creatorProfile.username}</p>
                    {creatorProfile.bio && (
                      <p className="service-detail-creator-bio">{creatorProfile.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {fullServiceProjects.length > 0 && (
              <div className="service-detail-projects">
                <h2>Proyectos asociados</h2>
                <div className="service-detail-projects-grid">
                  {fullServiceProjects.map((project) => (
                    <ProjectCardWithLike key={project.id} project={project} onOpen={handleOpenProject} small />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {showOrderModal && (
        <OrderModal
          itemId={service.itemId}
          itemTitle={service.name || 'Servicio'}
          basePrice={price > 0 ? price : null}
          onClose={() => setShowOrderModal(false)}
        />
      )}
      
      {selectedProjectId && (
        <ProjectView projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      )}
    </>
  );
}

export default ServiceDetail;
