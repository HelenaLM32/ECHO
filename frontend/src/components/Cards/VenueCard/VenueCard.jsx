import styles from './VenueCard.module.css';

function VenueCard({ venue, onOpen }) {
  const name = venue.name || 'Local';
  const address = venue.address || '';
  const capacity = venue.capacity;
  const coverImg = venue.img1 || venue.img2 || venue.img3;
  const initials = name.charAt(0).toUpperCase();

  return (
    <button
      className={styles.cardButton}
      onClick={() => onOpen && onOpen(venue)}
      type="button"
    >
      <article className={styles.card}>
        <div className={styles.cover}>
          {coverImg ? (
            <img src={coverImg} alt={name} className={styles.coverImg} />
          ) : (
            <div className={styles.coverFallback}>{initials}</div>
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <div>
              <h3 className={styles.title}>{name}</h3>
              {address && <p className={styles.address}>{address}</p>}
            </div>
          </div>
          {capacity != null && (
            <span className={styles.capacity}>{capacity} cap.</span>
          )}
        </div>
      </article>
    </button>
  );
}

export default VenueCard;