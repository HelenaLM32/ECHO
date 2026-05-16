import useProjectStore, { BLOCK_TYPES } from '../../../store/useProjectStore'
import { AudioPlayer } from '../Project/Blocks'
import './PreviewDialog.css'

/**
 * Convierte URLs de video a formato embed
 * @param {string} raw - URL del video
 * @returns {string} URL en formato embed
 */
function toEmbedUrl(raw) {
  try {
    const url = new URL(raw)
    if (url.hostname.includes('youtube.com') && url.searchParams.get('v'))
      return `https://www.youtube.com/embed/${url.searchParams.get('v')}`
    if (url.hostname === 'youtu.be')
      return `https://www.youtube.com/embed${url.pathname}`
    if (url.hostname.includes('vimeo.com')) {
      const id = url.pathname.replace('/', '')
      return `https://player.vimeo.com/video/${id}`
    }
  } catch { 
    /* no-op */ 
  }
  return raw
}

/**
 * Diálogo de vista previa del proyecto
 * @param {Object} props
 * @param {Function} props.onClose - Callback para cerrar el diálogo
 */
function PreviewDialog({ onClose }) {
  const blocks = useProjectStore((s) => s.blocks)
  const background = useProjectStore((s) => s.background)
  const blockGap = useProjectStore((s) => s.blockGap)

  const bgStyle =
    background.mode === 'image'
      ? { '--preview-bg-image': `url(${background.value})` }
      : { '--preview-bg-color': background.value }

  function renderBlock(block) {
    switch (block.type) {
      case BLOCK_TYPES.TEXT:
        return <div className="previewTextContent" dir="ltr" dangerouslySetInnerHTML={{ __html: block.content }} />
      case BLOCK_TYPES.IMAGE:
        return (
          <div className="previewImageWrapper">
            {block.src && <img src={block.src} alt="" className="previewImageContent" />}
          </div>
        )
      case BLOCK_TYPES.GALLERY:
        return (
          <div className="previewGalleryGrid" style={{
            '--preview-columns': block.columns || 3,
            '--preview-gap': `${block.gap ?? 8}px`,
          }}>
            {block.images.map((src, i) => (
              <img key={i} src={src} alt="" className="previewGalleryImage"
                style={{ '--preview-aspect': block.aspect === 'square' ? '1' : block.aspect === 'landscape' ? '16/9' : 'auto' }} />
            ))}
          </div>
        )
      case BLOCK_TYPES.VIDEO:
        if (block.url) {
          const direct = /\.(mp4|webm)(\?|$)/i.test(block.url) || block.url.includes('/uploads/')
          if (direct) return <video src={block.url} controls className="previewVideo" />
          return (
            <div className="previewVideoWrapper">
              <iframe src={toEmbedUrl(block.url)} title="video" allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          )
        }
        return null
      case BLOCK_TYPES.AUDIO:
        return block.audioSrc ? <AudioPlayer src={block.audioSrc} preview /> : null
      default:
        return null
    }
  }

  return (
    <div className="previewOverlay" onClick={onClose}>
      <button className="previewCloseButton" onClick={onClose}>✕</button>
      <div className="previewWindow project-view-window" style={bgStyle} onClick={(e) => e.stopPropagation()}>
        <div className="previewContentList" style={{ '--preview-block-gap': `${blockGap}px` }}>
          {blocks.length === 0 && <p className="previewEmptyMessage">No hay contenido para previsualizar.</p>}
          {blocks.map((block) => (
            <div key={block.id} className="previewContentItem">{renderBlock(block)}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PreviewDialog
