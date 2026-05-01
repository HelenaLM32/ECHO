import React from 'react'
import './ProjectCard.css'
import { BLOCK_TYPES, parseJsonSafe } from '../../pages/ItemProyect/store/useProjectStore'

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

function renderPreviewContent(project) {
  const blocks = parseJsonSafe(project.blocks) || []
  if (blocks.length === 0) return null
  const first = blocks[0]
  if (!first) return null
  switch (first.type) {
    case BLOCK_TYPES.TEXT:
      return <div className="pc-text" dangerouslySetInnerHTML={{ __html: (first.content || '').slice(0, 220) }} />
    case BLOCK_TYPES.IMAGE:
      return first.src ? <img src={first.src} alt="preview" className="pc-inner-image" /> : null
    case BLOCK_TYPES.GALLERY:
      return (first.images && first.images[0]) ? <img src={first.images[0]} alt="preview" className="pc-inner-image" /> : null
    case BLOCK_TYPES.VIDEO:
      return first.url ? <div className="pc-video-placeholder">Vídeo</div> : null
    case BLOCK_TYPES.AUDIO:
      return first.audioSrc ? <div className="pc-audio-placeholder">Audio</div> : null
    default:
      return null
  }
}

export default function ProjectCard({ project, onOpen }) {
  const cover = getCover(project)
  const title = project?.item?.title || `Proyecto #${project.id}`
  const creatorId = project?.item?.creatorId
  const profile = project?.profile
  const creatorName = profile?.publicName || profile?.username || 'Creator'
  const avatarUrl = profile?.avatarUrl
  const initials = creatorName.charAt(0).toUpperCase()
  const likes = project?.likes || 0
  const views = project?.views || 0

  return (
    <button type="button" className="project-card-wrapper project-card-button" onClick={() => onOpen(project.id)}>
      <article className="project-card">
        <div className="pc-cover">
          {renderPreviewContent(project) || (
            cover ? <img src={cover} alt={title} className="pc-cover-img" />
              : <div className="pc-cover-fallback">{title?.charAt(0)?.toUpperCase() || 'P'}</div>
          )}
        </div>
        <div className="pc-footer">
          <div className="pc-footer-left">
            {avatarUrl ? (
              <img src={avatarUrl} alt={creatorName} className="pc-creator-avatar" />
            ) : (
              <div className="pc-creator-avatar pc-creator-fallback">{initials}</div>
            )}
            <h3 className="pc-title">{title}</h3>
          </div>
          <div className="pc-stats">
            <span className="pc-stat">
              <span className="pc-stat-dot">❤️</span>
              {likes}
            </span>
            <span className="pc-stat">
              <span className="pc-stat-dot">👁️</span>
              {views}
            </span>
          </div>
        </div>
      </article>
    </button>
  )
}
