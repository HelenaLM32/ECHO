import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./DetailModal.css";
import VenueEventReviews from "../../VenueEventReviews/VenueEventReviews";

export default function DetailModal({ type, data, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!data) return null;
  const isVenue = type === "venue";

  const creatorId     = isVenue ? data.managerId          : data.creatorId;
  const creatorName   = isVenue ? data.managerPublicName  : data.creatorPublicName;
  const creatorAvatar = isVenue ? data.managerAvatarUrl   : data.creatorAvatarUrl;
  const creatorLabel  = isVenue ? "Gestionado por" : "Organizado por";

  const handleCreatorClick = () => {
    if (creatorId) {
      onClose();
      navigate(`/profile/${creatorId}`);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          <svg className="modal-close-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fillRule="evenodd"/>
          </svg>
        </button>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {(isVenue ? data.img1 : data.img) && (
          <div className="modal-image-wrapper">
            <img
              src={isVenue ? data.img1 : data.img}
              alt={data.name || data.title}
              className="modal-img"
            />
            <div className="modal-img-bar" />
          </div>
        )}

        <div className="modal-body">
          <h2 id="modal-title" className="modal-title">{isVenue ? data.name : data.title}</h2>

          {creatorId && (
            <div className="modal-creator" onClick={handleCreatorClick}>
              {creatorAvatar ? (
                <img src={creatorAvatar} alt={creatorName} className="modal-creator-avatar" />
              ) : (
                <div className="modal-creator-avatar placeholder">
                  {(creatorName || "?")[0].toUpperCase()}
                </div>
              )}
              <div className="modal-creator-info">
                <span className="modal-creator-label">{creatorLabel}</span>
                <span className="modal-creator-name">{creatorName || `Usuario #${creatorId}`}</span>
              </div>
            </div>
          )}

          <div className="modal-divider" />

          <div className="modal-fields-container">
            {isVenue ? (
              <>
                <p className="modal-field">
                  <span>Dirección</span>
                  <span>{data.address}</span>
                </p>
                {data.capacity && (
                  <p className="modal-field">
                    <span>Aforo</span>
                    <span>{data.capacity} personas</span>
                  </p>
                )}
                {data.telefono && (
                  <p className="modal-field">
                    <span>Teléfono</span>
                    <a href={`tel:${data.telefono}`}>{data.telefono}</a>
                  </p>
                )}
                {data.email && (
                  <p className="modal-field">
                    <span>Email</span>
                    <a href={`mailto:${data.email}`}>{data.email}</a>
                  </p>
                )}
                {data.horario && (
                  <p className="modal-field">
                    <span>Horario</span>
                    <span>{data.horario}</span>
                  </p>
                )}
                {(data.img2 || data.img3) && (
                  <div className="modal-gallery">
                    {data.img2 && <img src={data.img2} alt="foto 2" />}
                    {data.img3 && <img src={data.img3} alt="foto 3" />}
                  </div>
                )}
              </>
            ) : (
              <>
                {data.categoria && (
                  <p className="modal-field">
                    <span>Categoría</span>
                    <span>{data.categoria}</span>
                  </p>
                )}
                {(data.venueName || data.venueId) && (
  <p className="modal-field">
    <span>Local</span>
    <span>
      {data.venueName || `Local #${data.venueId}`}
      {data.venueAddress && ` · ${data.venueAddress}`}
    </span>
  </p>
)}
                <p className="modal-field">
                  <span>Fecha</span>
                  <span>
                    {data.startDate ? new Date(data.startDate).toLocaleString("es-ES") : "—"}
                    {" → "}
                    {data.endDate ? new Date(data.endDate).toLocaleString("es-ES") : "—"}
                  </span>
                </p>
                <p className="modal-field">
                  <span>Precio</span>
                  <span className={data.precio != null ? "modal-price" : "price-free"}>
                    {data.precio != null && data.precio > 0 ? `${data.precio} €` : "Gratuito"}
                  </span>
                </p>
                {data.description && (
                  <p className="modal-description">{data.description}</p>
                )}
                {data.linkEntradas && (
                  <a href={data.linkEntradas} target="_blank" rel="noreferrer" className="modal-ticket-btn">
                    Comprar entradas
                  </a>
                )}
              </>
            )}
          </div>

          <div className="modal-reviews-section">
            <VenueEventReviews
              targetId={data.id}
              targetType={isVenue ? "VENUE" : "EVENT"}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}