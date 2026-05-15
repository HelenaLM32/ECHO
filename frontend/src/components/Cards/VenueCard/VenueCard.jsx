import styles from '../ProjectCard/ProjectCard.module.css';

function VenueCard({ venue }) {
  const name = venue.name || 'Local';
  const address = venue.address || '';
  const capacity = venue.capacity;
  const coverImg = venue.img1 || venue.img2 || venue.img3;
  const initials = name.charAt(0).toUpperCase();

  return (
    <div className={`${styles.cardWrapper} ${styles.cardButton} ${styles.small}`}>
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
              {address && <p className={styles.author}>{address}</p>}
            </div>
          </div>
          {capacity != null && (
            <div className={styles.stats}>
              <span className={styles.statItem}>{capacity} cap.</span>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default VenueCard;
