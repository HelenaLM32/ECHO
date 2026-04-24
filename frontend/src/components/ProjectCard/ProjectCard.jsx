import React from 'react'
import { Link } from 'react-router-dom'
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

export default function ProjectCard({ project }) {
  const cover = getCover(project)
  const title = project?.item?.title || `Proyecto #${project.id}`

  return (
    <Link to={`/project/${project.id}`} className="project-card-wrapper" style={{ textDecoration: 'none' }}>
      <article className="project-card-preview">
        <div className="pc-cover">
          {/* Try rendering first block preview (text/image/gallery/video) */}
          {renderPreviewContent(project) || (
            cover ? <img src={cover} alt={title} className="pc-cover-img" />
            : <div className="pc-cover-fallback">{title?.charAt(0)?.toUpperCase() || 'P'}</div>
          )}
        </div>
      </article>
      <h3 className="pc-title pc-title-below">{title}</h3>
    </Link>
  )
}
