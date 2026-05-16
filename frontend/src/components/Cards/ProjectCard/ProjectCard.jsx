import { useNavigate } from 'react-router-dom'
import styles from './ProjectCard.module.css'
import { BLOCK_TYPES, parseJsonSafe } from '../../../store/useProjectStore'

function getCover(project) {
  const blocks = parseJsonSafe(project.blocks) || []
  for (const b of blocks) {
    if (!b) continue
    if (b.type === BLOCK_TYPES.IMAGE && b.src) return b.src
    if (b.type === BLOCK_TYPES.GALLERY && Array.isArray(b.images) && b.images.length) return b.images[0]
  }
  const background = parseJsonSafe(project.background)
  if (background && background.mode === 'image' && background.value) return background.value
  return null
}

export default function ProjectCard({ project, onOpen, small = false, isLiked = false }) {
  const navigate = useNavigate()
  const cover = getCover(project)
  const title = project?.item?.title || `Proyecto #${project.id}`
  const creatorId = project?.item?.creatorId
  const profile = project?.profile
  const creatorName = profile?.publicName || profile?.username || 'Creator'
  const avatarUrl = profile?.avatarUrl
  const initials = creatorName.charAt(0).toUpperCase()
  const likes = project?.likes || 0
  const views = project?.views || 0
  const price = project?.item?.basePrice

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
      onClick={() => onOpen(project.id)}
    >
      <article className={styles.card}>
        <div className={styles.cover}>
          {price ? (
            <div className={styles.priceTop}>{price.toFixed(2)}€</div>
          ) : (
            <div className={styles.priceTop}>Gratis</div>
          )}
          {cover ? (
            <img src={cover} alt={title} className={styles.coverImg} />
          ) : (
            <div className={styles.coverFallback}>{title?.charAt(0)?.toUpperCase() || 'P'}</div>
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
          <div className={styles.stats}>
            <span className={`${styles.statItem} ${isLiked ? styles.liked : ''}`}>
              <svg className={`${styles.statIcon} ${isLiked ? styles.likedIcon : ''}`} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4 16H0V6h4V0h6v4h6v12H4zM6 2v12h8v-1h-2v-2h2v-1h-2V8h2V6H8V2H6zM2 8v6h2V8H2z" fillRule="evenodd"/>
              </svg>
              {likes}
            </span>
            <span className={styles.statItem}>
              <svg className={styles.statIcon} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M0 16h16V0H0v16zm2-4V2h12v10H2zm2-2h2V8H4v2zm6 0h2V8h-2v2z" fillRule="evenodd"/>
              </svg>
              {views}
            </span>
          </div>
        </div>
      </article>
    </button>
  )
}
