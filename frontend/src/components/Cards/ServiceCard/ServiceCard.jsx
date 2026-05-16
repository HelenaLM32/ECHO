import { useNavigate } from 'react-router-dom'
import styles from './ServiceCard.module.css'

export default function ServiceCard({ service, onOpen, small = false }) {
  const navigate = useNavigate()
  const cover = service?.coverImageUrl
  const title = service?.name || `Servicio #${service.id}`
  const creator = service?.creator
  const creatorId = creator?.id
  const creatorName = creator?.publicName || creator?.username || 'Creator'
  const avatarUrl = creator?.avatarUrl
  const initials = creatorName.charAt(0).toUpperCase()
  const price = service?.price || 0

  const handleCreatorClick = (e) => {
    e.stopPropagation()
    if (creatorId) {
      navigate(`/profile/${creatorId}`)
    }
  }

  return (
    <button 
      type="button" 
      className={`${styles.cardWrapper} ${styles.cardButton} ${small ? styles.small : ''}`} 
      onClick={() => onOpen(service.id)}
    >
      <article className={styles.card}>
        <div className={styles.cover}>
          {price > 0 ? (
            <div className={styles.priceTop}>{price.toFixed(2)}€</div>
          ) : (
            <div className={styles.priceTop}>Gratis</div>
          )}
          {cover ? (
            <img src={cover} alt={title} className={styles.coverImg} />
          ) : (
            <div className={styles.coverFallback}>{title?.charAt(0)?.toUpperCase() || 'S'}</div>
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={creatorName} className={styles.creatorAvatar} />
            ) : (
              <div className={`${styles.creatorAvatar} ${styles.creatorFallback}`}>{initials}</div>
            )}
            <div>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.author}>
                por <span className={styles.authorLink} onClick={handleCreatorClick}>{creatorName}</span>
              </p>
            </div>
          </div>
        </div>
      </article>
    </button>
  )
}
