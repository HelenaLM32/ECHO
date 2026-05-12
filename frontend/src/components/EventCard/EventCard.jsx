import './EventCard.css';

function EventCard({ event }) {
  const title = event.title || 'Evento';
  const coverImg = event.img;
  const precio = event.precio;
  const startDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;
  const initials = title.charAt(0).toUpperCase();

  return (
    <div className="ec-card-wrapper">
      <article className="ec-card">
        <div className="ec-cover">
          {coverImg ? (
            <img src={coverImg} alt={title} className="ec-cover-img" />
          ) : (
            <div className="ec-cover-fallback">{initials}</div>
          )}
        </div>
        <div className="ec-footer">
          <div className="ec-meta">
            <h3 className="ec-title">{title}</h3>
            {startDate && <p className="ec-date">{startDate}</p>}
          </div>
          <div className="ec-price">
            {precio != null ? `${precio} €` : 'Gratuito'}
          </div>
        </div>
      </article>
    </div>
  );
}

export default EventCard;
