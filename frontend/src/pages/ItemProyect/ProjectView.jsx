import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProjectById } from '../../services/projects'
import './ProjectEditor.css'
import useProjectStore, { BLOCK_TYPES, toEmbedUrl, parseJsonSafe } from './store/useProjectStore'

function RenderBlock({ block }) {
  if (!block) return null
  switch (block.type) {
    case BLOCK_TYPES.TEXT:
      return <div className="previewTextContent" dir="ltr" dangerouslySetInnerHTML={{ __html: block.content }} />
    case BLOCK_TYPES.IMAGE:
      return (
        <div className="previewImageWrapper">
          {block.src && <img src={block.src} alt="" className="previewImageContent" />}
          {block.audio && <audio src={block.audio} controls className="previewAudioPlayer" />}
        </div>
      )
    case BLOCK_TYPES.GALLERY:
      return (
        <div className="previewGalleryGrid" style={{ gridTemplateColumns: `repeat(${block.columns || 3}, 1fr)`, gap: `${block.gap ?? 8}px` }}>
          {Array.isArray(block.images) && block.images.map((src, i) => (
            <img key={i} src={src} alt="" className="previewGalleryImage" style={{ aspectRatio: block.aspect === 'square' ? '1' : block.aspect === 'landscape' ? '16/9' : block.aspect === 'portrait' ? '3/4' : 'auto' }} />
          ))}
        </div>
      )
    case BLOCK_TYPES.VIDEO:
      if (block.isLocal && block.url) return <video src={block.url} controls className="previewVideo" />
      if (block.url) return (
        <div className="previewVideoWrapper">
          <iframe src={toEmbedUrl(block.url)} title="video" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
        </div>
      )
      return null
    case BLOCK_TYPES.AUDIO:
      return block.audioSrc ? <audio src={block.audioSrc} controls className="previewAudioPlayer" /> : null
    default:
      return null
  }
}

export default function ProjectView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getProjectById(id)
      .then((p) => { if (mounted) setProject(p) })
      .catch((e) => { if (mounted) setError(e.message || String(e)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  if (loading) return <div style={{ padding: 20 }}>Cargando proyecto...</div>
  if (error || !project) return <div style={{ padding: 20 }}>{error || 'Proyecto no encontrado'}</div>

  const blocks = parseJsonSafe(project.blocks) || []
  const background = parseJsonSafe(project.background) || (project.background || { mode: 'color', value: '#fff' })
  const blockGap = project.blockGap ?? 0

  const bgStyle = background.mode === 'image' ? { backgroundImage: `url(${background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: background.value }

  function handleOverlayClick() {
    // Prefer returning to the profile of the project creator if available, otherwise go back in history
    const creatorId = project?.item?.creatorId
    if (creatorId) navigate(`/profile/${creatorId}`)
    else navigate(-1)
  }

  return (
    <div className="previewOverlay" onClick={handleOverlayClick} style={{ position: 'relative', padding: 24 }}>
      <div className="previewWindow" style={{ ...bgStyle, width: '100%', maxWidth: 980, margin: '0 auto', borderRadius: 12 }} onClick={(e) => e.stopPropagation()}>
        <div className="previewContentList" style={{ gap: `${blockGap}px`, padding: 20 }}>
          {blocks.length === 0 && <p className="previewEmptyMessage">No hay contenido para previsualizar.</p>}
          {blocks.map((b) => (
            <div key={b.id} className="previewContentItem"><RenderBlock block={b} /></div>
          ))}
        </div>
      </div>
    </div>
  )
}
