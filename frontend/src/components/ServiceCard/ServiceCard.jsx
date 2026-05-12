import React from 'react'
import '../ProjectCard/ProjectCard.css'

export default function ServiceCard({ service, onOpen, small = false }) {
  const cover = service?.coverImageUrl
  const title = service?.name || `Servicio #${service.id}`
  const creator = service?.creator
  const creatorName = creator?.publicName || creator?.username || 'Creator'
  const avatarUrl = creator?.avatarUrl
  const initials = creatorName.charAt(0).toUpperCase()
  const price = service?.price || 0

  return (
    <button type="button" className={`pc-card-wrapper pc-card-button ${small ? 'pc-card--small' : ''}`} onClick={() => onOpen(service.id)}>
      <article className="pc-card">
        <div className="pc-cover">
          {price > 0 ? <div className="pc-price-top">{price.toFixed(2)}€</div> : <div className="pc-price-top">Gratis</div>}
          {cover ? <img src={cover} alt={title} className="pc-cover-img" /> : <div className="pc-cover-fallback">{title?.charAt(0)?.toUpperCase() || 'S'}</div>}
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
              <p className="pc-author">por {creatorName}</p>
            </div>
          </div>

        </div>
      </article>
    </button>
  )
}
