import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProjectById, deleteProject, deleteProjectComment } from '../../services/projects'
import './ProjectEditor.css'
import { BLOCK_TYPES, toEmbedUrl, parseJsonSafe } from './store/useProjectStore'
import ProjectFooter from '../../components/ProjectFooter/ProjectFooter'
import OrderModal from '../../components/OrderModal/OrderModal'
import { API_URL } from '../../services/config'
import { useAuth } from '../../context/AuthContext'
import { PopupConfirm, useConfirmPopup } from '../../components/PopupConfirm/PopupConfirm'

function RenderBlock({ block }) {
  if (!block) return null
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
        <div className="previewGalleryGrid" style={{ gridTemplateColumns: `repeat(${block.columns || 3}, 1fr)`, gap: `${block.gap ?? 8}px` }}>
          {Array.isArray(block.images) && block.images.map((src, i) => (
            <img key={i} src={src} alt="" className="previewGalleryImage" style={{ aspectRatio: block.aspect === 'square' ? '1' : block.aspect === 'landscape' ? '16/9' : block.aspect === 'portrait' ? '3/4' : 'auto' }} />
          ))}
        </div>
      )
    case BLOCK_TYPES.VIDEO:
      if (block.url) {
        const direct = /\.(mp4|webm|ogg)(\?|$)/i.test(block.url) || block.url.includes('/uploads/')
        if (direct) return <video src={block.url} controls className="previewVideo" />
        return (
          <div className="previewVideoWrapper">
            <iframe src={toEmbedUrl(block.url)} title="video" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
          </div>
        )
      }
      return null
    case BLOCK_TYPES.AUDIO:
      return block.audioSrc ? <audio src={block.audioSrc} controls className="previewAudioPlayer" /> : null
    default:
      return null
  }
}

export default function ProjectView({ projectId, onClose }) {
  const navigate = useNavigate()
  const { id: routeId } = useParams()
  const id = projectId || routeId
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)
  const [commentsList, setCommentsList] = useState([])
  const { user } = useAuth()
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useConfirmPopup()

  const isProjectOwner = !!project?.item?.creatorId && user?.id === project.item.creatorId
  const isAdmin = !!user?.roles?.includes('ADMIN')
  const canDeleteProject = isAdmin || isProjectOwner
  const canOrder = !!user && !isProjectOwner

  const [showOrderModal, setShowOrderModal] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getProjectById(id)
      .then((p) => { if (mounted) setProject(p) })
      .catch((e) => { if (mounted) setError(e.message || String(e)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    if (!project || !project.item || !project.item.creatorId) return
    // Profile is already included in the project response
    setProfile(project.profile || null)
  }, [project])

  useEffect(() => {
    if (!project?.id) return
    fetch(`${API_URL}/item-projects/${project.id}/comments`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCommentsList(Array.isArray(data) ? data : []))
      .catch(() => setCommentsList([]))
  }, [project?.id])

  // increment views once when project is loaded in the preview
  useEffect(() => {
    if (!project) return
    fetch(`${API_URL}/item-projects/${project.id}/views`, { method: 'POST' })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setProject(data) })
      .catch(() => { })
  }, [project?.id])

  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token || !project) return
    fetch(`${API_URL}/item-projects/${project.id}/likes/status`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : { liked: false })
      .then((data) => { setIsLiked(Boolean(data.liked)) })
      .catch(() => setIsLiked(false))
  }, [project?.id])

  function handleToggleLike() {
    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('Debes iniciar sesión para dar like')
      return
    }
    fetch(`${API_URL}/item-projects/${project.id}/likes`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (!r.ok) throw new Error('Error like'); return r.json() })
      .then((data) => {
        // response includes updated project fields and `liked` flag
        setProject(data)
        setIsLiked(Boolean(data.liked))
      })
      .catch(() => {
        // Error silenciado
      })
  }

  function loadComments() {
    if (!project?.id) return
    fetch(`${API_URL}/item-projects/${project.id}/comments`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCommentsList(Array.isArray(data) ? data : []))
      .catch(() => setCommentsList([]))
  }

  function handleDeleteProject() {
    if (!project?.id) return
    showConfirm(
      '¿Eliminar este proyecto? Esta acción no se puede deshacer.',
      'Confirmar eliminación',
      async () => {
        try {
          await deleteProject(project.id)
          if (onClose) {
            onClose()
          } else {
            const target = project?.item?.creatorId ? `/profile/${project.item.creatorId}` : '/'
            navigate(target)
          }
        } catch (e) {
          alert('No se pudo borrar el proyecto: ' + (e.message || 'error'))
        }
      }
    )
  }

  function handleDeleteComment(commentId) {
    if (!project?.id || !commentId) return
    showConfirm(
      '¿Eliminar este comentario?',
      'Confirmar eliminación',
      async () => {
        try {
          const updatedProject = await deleteProjectComment(project.id, commentId)
          setProject(updatedProject)
          loadComments()
        } catch (e) {
          alert('No se pudo borrar el comentario: ' + (e.message || 'error'))
        }
      }
    )
  }

  function handleAddComment(commentText) {
    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('Debes iniciar sesión para comentar')
      return
    }
    if (!commentText || !commentText.trim()) return
    fetch(`${API_URL}/item-projects/${project.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment: commentText.trim() }),
    })
      .then((r) => { if (!r.ok) throw new Error('Error al enviar comentario'); return r.json() })
      .then((data) => {
        setProject(data)
        loadComments()
      })
      .catch(() => {
        // Error silenciado
      })
  }

  if (loading) return <div style={{ padding: 20 }}>Cargando proyecto...</div>
  if (error || !project) return <div style={{ padding: 20 }}>{error || 'Proyecto no encontrado'}</div>

  const blocks = parseJsonSafe(project.blocks) || []
  const background = parseJsonSafe(project.background) || (project.background || { mode: 'color', value: '#fff' })
  const blockGap = project.blockGap ?? 0

  const bgStyle = background.mode === 'image' ? { backgroundImage: `url(${background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: background.value }

  function handleOverlayClick() {
    if (onClose) {
      onClose()
      return
    }
    // Prefer returning to the profile of the project creator if available, otherwise go back in history
    const creatorId = project?.item?.creatorId
    if (creatorId) navigate(`/profile/${creatorId}`)
    else navigate(-1)
  }

  return (
    <>
      <div className="previewOverlay" onClick={handleOverlayClick}>
        <div className="previewWindow" style={{ ...bgStyle, width: '100%', maxWidth: 1200, margin: '0 auto', borderRadius: 16 }} onClick={(e) => e.stopPropagation()}>
          {canDeleteProject && (
            <button className="project-delete-button" onClick={handleDeleteProject}>
              Borrar proyecto
            </button>
          )}
          <div className="previewContentList" style={{ gap: `${blockGap}px` }}>
            {blocks.length === 0 && <p className="previewEmptyMessage">No hay contenido para previsualizar.</p>}
            {blocks.map((b) => (
              <div key={b.id} className="previewContentItem"><RenderBlock block={b} /></div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <ProjectFooter
              name={(profile && profile.publicName) || project?.item?.title || 'Anónimo'}
              avatar={(profile && profile.avatarUrl) || null}
              likes={project?.likes || 0}
              views={project?.views || 0}
              comments={project?.comments || 0}
              commentItems={commentsList}
              onLike={handleToggleLike}
              onSubmitComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              currentUserId={user?.id}
              projectOwnerId={project?.item?.creatorId}
              isAdmin={isAdmin}
              isLiked={isLiked}
            />
          </div>
          {canOrder && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 24px 28px' }}>
              <button
                className="pv-order-btn"
                onClick={(e) => { e.stopPropagation(); setShowOrderModal(true); }}
              >
                Encargar proyecto
              </button>
            </div>
          )}
        </div>
      </div>
      <PopupConfirm
        isOpen={confirmState.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={confirmState.message}
        title={confirmState.title}
      />
      {showOrderModal && (
        <OrderModal
          itemId={project.item?.id}
          itemTitle={project.item?.title || 'Proyecto'}
          basePrice={project.item?.basePrice ?? null}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </>
  )
}
