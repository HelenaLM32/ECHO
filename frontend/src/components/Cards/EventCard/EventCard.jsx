import styles from './EventCard.module.css';

function EventCard({ event, onOpen }) {
  const title = event.title || 'Evento';
  const coverImg = event.img;
  const precio = event.precio;
  const startDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;
  const initials = title.charAt(0).toUpperCase();

  return (
    <button
      className={`${styles.cardButton}`}
      onClick={() => onOpen && onOpen(event)}
      type="button"
    >
      <article className={styles.card}>
        <div className={styles.cover}>
          <div className={styles.priceTop}>
            {precio != null ? `${precio} €` : 'Gratis'}
          </div>
          {coverImg ? (
            <img src={coverImg} alt={title} className={styles.coverImg} />
          ) : (
            <div className={styles.coverFallback}>{initials}</div>
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <div>
              <h3 className={styles.title}>{title}</h3>
              {startDate && <p className={styles.date}>{startDate}</p>}
            </div>
          </div>
        </div>
      </article>
    </button>
  );
}

export default EventCard;