import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ProjectCard.css'
import { BLOCK_TYPES, parseJsonSafe } from '../../pages/ItemProject/store/useProjectStore'

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

export default function ProjectCard({ project, onOpen, small = false }) {
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
    <button type="button" className={`pc-card-wrapper pc-card-button ${small ? 'pc-card--small' : ''}`} onClick={() => onOpen(project.id)}>
      <article className="pc-card">
        <div className="pc-cover">
          {price ? <div className="pc-price-top">{price.toFixed(2)}€</div> : <div className="pc-price-top">Gratis</div>}
          {cover ? <img src={cover} alt={title} className="pc-cover-img" /> : <div className="pc-cover-fallback">{title?.charAt(0)?.toUpperCase() || 'P'}</div>}
        </div>
        <div className="pc-footer">
          <div className="pc-footer-left">
            {avatarUrl ? (
              <img src={avatarUrl} alt={creatorName} className="pc-creator-avatar" />
            ) : (
              <div className="pc-creator-avatar pc-creator-fallback">{initials}</div>
            )}
            <div className="pc-meta">
              <h3 className="pc-title">{title}</h3>
              <p className="pc-author">
                por <span className="pc-author-link" onClick={handleCreatorClick}>{creatorName}</span>
              </p>
            </div>
          </div>
          <div className="pc-stats">
            <span className="pc-stat-item">
              <svg className="pc-stat-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16H0V6h4V0h6v4h6v12H4zM6 2v12h8v-1h-2v-2h2v-1h-2V8h2V6H8V2H6zM2 8v6h2V8H2z" fillRule="evenodd"/>
              </svg>
              {likes}
            </span>
            <span className="pc-stat-item">
              <svg className="pc-stat-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
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
