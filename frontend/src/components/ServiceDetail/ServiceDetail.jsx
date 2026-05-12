import { useState, useEffect } from 'react';
import { getProfileByUserId } from '../../services/profile';
import { getProjectById } from '../../services/projects';
import ProjectCard from '../ProjectCard/ProjectCard';
import ProjectView from '../../pages/ItemProyect/ProjectView';
import './ServiceDetail.css';

const parsePrice = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

function ServiceDetail({ service, onClose }) {
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [fullServiceProjects, setFullServiceProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

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
              // Silently skip failed project loads
            }
          }
          setFullServiceProjects(fullProjects);
        }
      } catch {
        // Silently handle errors
      } finally {
        setLoading(false);
      }
    };

    loadCreatorData();
  }, [service?.creatorId, service?.projects]);

  // Poll for updated projects every 30 seconds to refresh views/likes in real-time
  useEffect(() => {
    if (!service?.projects?.length) return;

    const pollProjects = async () => {
      try {
        const fullProjects = [];
        for (const projectSummary of service.projects) {
          try {
            const fullProject = await getProjectById(projectSummary.id);
            fullProjects.push(fullProject);
          } catch {
            // Silently skip failed project loads
          }
        }
        setFullServiceProjects((prev) => {
          const updatedMap = new Map(fullProjects.map((p) => [p.id, p]));
          return prev.map((p) => updatedMap.get(p.id) || p);
        });
      } catch { }
    };

    const interval = setInterval(pollProjects, 30000);
    return () => clearInterval(interval);
  }, [service?.projects]);

  if (!service) return null;

  const price = parsePrice(service.price ?? service.basePrice);

  const handleOpenProject = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleCloseProject = () => {
    setSelectedProjectId(null);
  };

  return (<>
    <div className="service-detail-overlay" onClick={onClose}>
      <div className="service-detail-window" onClick={(e) => e.stopPropagation()}>
        <button className="service-detail-close" onClick={onClose}>✕</button>

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
                    <h3>{creatorProfile.publicName || creatorProfile.username}</h3>
                    <p className="service-detail-creator-username">@{creatorProfile.username}</p>
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
                    <ProjectCard key={project.id} project={project} onOpen={handleOpenProject} small />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    {selectedProjectId && (
      <ProjectView projectId={selectedProjectId} onClose={handleCloseProject} />
    )}
  </>);
}

export default ServiceDetail;
