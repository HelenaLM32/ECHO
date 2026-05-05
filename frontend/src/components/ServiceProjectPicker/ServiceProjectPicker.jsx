import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProjectsByUserId } from '../../services/projects';
import { BLOCK_TYPES, parseJsonSafe } from '../../pages/ItemProyect/store/useProjectStore';
import './ServiceProjectPicker.css';

function getCover(project) {
  const blocks = parseJsonSafe(project.blocks) || [];
  for (const b of blocks) {
    if (!b) continue;
    if (b.type === BLOCK_TYPES.IMAGE && b.src) return b.src;
    if (b.type === BLOCK_TYPES.GALLERY && Array.isArray(b.images) && b.images.length) return b.images[0];
  }
  const background = parseJsonSafe(project.background);
  if (background && background.mode === 'image' && background.value) return background.value;
  return null;
}

function ServiceProjectPicker({ selectedProjects, onSelectionChange, maxSelection = 6 }) {
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
      } catch {
        console.error('Error cargando proyectos');
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

  if (loading) return <div className="spp-loading">Cargando proyectos...</div>;

  return (
    <div className="spp-wrapper">
      <div className="spp-header">
        <h3 className="spp-title">Selecciona proyectos relacionados</h3>
        <span className="spp-counter">{selectedProjects.length}/{maxSelection}</span>
      </div>
      
      {selectedProjects.length >= maxSelection && (
        <p className="spp-warning">Has alcanzado el maximo de proyectos seleccionados.</p>
      )}
      
      {projects.length === 0 ? (
        <div className="spp-empty">No tienes proyectos disponibles para seleccionar.</div>
      ) : (
        <div className="spp-grid">
          {projects.map(project => {
            const title = project.title || project.item?.title || 'Proyecto sin titulo';
            const cover = getCover(project);
            const isSelected = selectedProjects.includes(project.id);
            
            // Obtener datos del perfil del proyecto o del usuario
            const profile = project.profile;
            const creatorName = profile?.publicName || profile?.username || user?.username || 'Yo';
            const avatarUrl = profile?.avatarUrl || user?.avatarUrl;
            const initials = creatorName.charAt(0).toUpperCase();
            
            return (
              <div
                key={project.id}
                className={`spp-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(project.id)}
              >
                <div className="spp-card-cover">
                  {cover ? (
                    <img src={cover} alt={title} className="spp-cover-img" />
                  ) : (
                    <div className="spp-cover-fallback">{title.charAt(0).toUpperCase()}</div>
                  )}
                  {isSelected && (
                    <div className="spp-selected-badge">
                      <span>✓</span>
                    </div>
                  )}
                </div>
                <div className="spp-card-footer">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={creatorName} className="spp-avatar" />
                  ) : (
                    <div className="spp-avatar spp-avatar-fallback">{initials}</div>
                  )}
                  <div className="spp-meta">
                    <h4 className="spp-card-title">{title}</h4>
                    <p className="spp-card-author">por {creatorName}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ServiceProjectPicker;
