import { useState } from 'react';
import './ServiceCard.css';
import ServiceDetail from '../ServiceDetail/ServiceDetail';

const parsePrice = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

function ServiceCard({ service, profile, onEdit, onDelete, small = true }) {
  const [showDetail, setShowDetail] = useState(false);

  const creatorName = profile?.publicName || profile?.username || 'Creador';
  const avatarUrl = profile?.avatarUrl;
  const initials = creatorName.charAt(0).toUpperCase();
  const title = service.name || 'Sin titulo';
  const price = parsePrice(service.price ?? service.basePrice);
  const deliveryDays = service.deliveryDuration || 1;

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit?.(service.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.(service.id);
  };

  const canEdit = typeof onEdit === 'function';
  const canDelete = typeof onDelete === 'function';

  return (
    <>
      <div
        className={`sc-card-wrapper ${small ? 'sc-card--small' : ''}`}
        onClick={() => setShowDetail(true)}
      >
        <article className="sc-card">
          <div className="sc-cover">
            {service.coverImageUrl ? (
              <img src={service.coverImageUrl} alt={title} className="sc-cover-img" />
            ) : (
              <div className="sc-cover-fallback">{title.charAt(0).toUpperCase()}</div>
            )}
            {(canEdit || canDelete) && (
              <div className="sc-actions">
                {canEdit && (
                  <button className="sc-action-btn sc-edit-btn" onClick={handleEdit} title="Editar">✎</button>
                )}
                {canDelete && (
                  <button className="sc-action-btn sc-delete-btn" onClick={handleDelete} title="Eliminar">🗑</button>
                )}
              </div>
            )}
          </div>

          <div className="sc-footer">
            <div className="sc-footer-left">
              {avatarUrl ? (
                <img src={avatarUrl} alt={creatorName} className="sc-creator-avatar" />
              ) : (
                <div className="sc-creator-avatar sc-creator-fallback">{initials}</div>
              )}
              <div className="sc-meta">
                <h3 className="sc-title">{title}</h3>
                <p className="sc-author">por {creatorName}</p>
              </div>
            </div>
            <div className="sc-stats">
              <span className="sc-price">${price.toFixed(0)}</span>
              <span className="sc-delivery">{deliveryDays}d</span>
            </div>
          </div>
        </article>
      </div>

      {showDetail && <ServiceDetail service={service} onClose={() => setShowDetail(false)} />}
    </>
  );
}

export default ServiceCard;
