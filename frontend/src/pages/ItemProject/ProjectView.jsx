import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProjectById, deleteProject, deleteProjectComment } from '../../services/projects'
import { fetchApi, fetchWithToken } from '../../services/config'
import './ProjectEditor.css'
import './ProjectView.css'
import { BLOCK_TYPES, toEmbedUrl, parseJsonSafe } from '../../store/useProjectStore'
import { AudioPlayer } from '../../components/ItemProject/Project/Blocks'
import Footer from '../../components/ItemProject/ProjectFooter/Footer'
import OrderModal from '../../components/Modals/OrderModal/OrderModal'
import PopupConfirm from '../../components/Modals/PopupConfirm/PopupConfirm'
import PopupSuccess from '../../components/Modals/PopupSuccess/PopupSuccess'
import useConfirmPopup from '../../hooks/useConfirmPopup'
import useSuccessPopup from '../../hooks/useSuccessPopup'
import { useAuth } from '../../context/AuthContext'
import usePolling from '../../hooks/usePolling'
import { getAuthToken } from '../../services/session'

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
      return block.audioSrc ? <AudioPlayer src={block.audioSrc} preview /> : null
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
  const { user, loadingContext } = useAuth()
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useConfirmPopup()
  const { successState, showSuccess, hideSuccess } = useSuccessPopup()
  const hasIncrementedView = useRef(false)

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
    fetchApi(`/item-projects/${project.id}/comments`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCommentsList(Array.isArray(data) ? data : []))
      .catch(() => setCommentsList([]))
  }, [project?.id])

  // increment views once when project is loaded in the preview (only for logged users)
  useEffect(() => {
    if (loadingContext || !project?.id || hasIncrementedView.current) return
    // Only count views for authenticated users
    if (!user?.id) {
      hasIncrementedView.current = true
      return
    }
    hasIncrementedView.current = true
    fetchWithToken(`/item-projects/${project.id}/views`, {
      method: 'POST'
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setProject(data) })
      .catch((err) => { console.error("Error al incrementar views:", err); })
  }, [project?.id, user?.id, loadingContext])

  // Poll for updated views count every 30 seconds to show real-time updates
  usePolling(
    () => {
      fetchWithToken(`/item-projects/${project.id}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data && data.views !== undefined) {
            setProject(prev => prev ? { ...prev, views: data.views } : prev)
          }
        })
        .catch((err) => { console.error("Error en polling de views:", err); })
    },
    30000,
    !!project?.id
  )

  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    if (!token || !project) return
    fetchWithToken(`/item-projects/${project.id}/likes/status`)
      .then((r) => r.ok ? r.json() : { liked: false })
      .then((data) => { setIsLiked(Boolean(data.liked)) })
      .catch(() => setIsLiked(false))
  }, [project?.id])

  function handleToggleLike() {
    const token = getAuthToken()
    if (!token) {
      showSuccess('Debes iniciar sesion para dar like', 'Accion requerida')
      return
    }
    fetchWithToken(`/item-projects/${project.id}/likes`, { method: 'POST' })
      .then((r) => { if (!r.ok) throw new Error('Error like'); return r.json() })
      .then((data) => {
        // response includes updated project fields and `liked` flag
        setProject(data)
        setIsLiked(Boolean(data.liked))
      })
      .catch((err) => {
        console.error('Error toggling like:', err)
      })
  }

  function loadComments() {
    if (!project?.id) return
    fetchApi(`/item-projects/${project.id}/comments`)
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
          showSuccess('No se pudo borrar el proyecto: ' + (e.message || 'error'), 'Error')
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
          showSuccess('No se pudo borrar el comentario: ' + (e.message || 'error'), 'Error')
        }
      }
    )
  }

  function handleAddComment(commentText) {
    const token = getAuthToken()
    if (!token) {
      showSuccess('Debes iniciar sesion para comentar', 'Accion requerida')
      return
    }
    if (!commentText || !commentText.trim()) return
    fetchWithToken(`/item-projects/${project.id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment: commentText.trim() }),
    })
      .then((r) => { if (!r.ok) throw new Error('Error al enviar comentario'); return r.json() })
      .then((data) => {
        setProject(data)
        loadComments()
      })
      .catch((err) => {
        console.error('Error adding comment:', err)
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
        <button
          className="previewCloseButton"
          onClick={(e) => {
            e.stopPropagation()
            if (onClose) {
              onClose()
            } else {
              navigate('/')
            }
          }}
          aria-label="Cerrar"
        >
          ✕
        </button>
        {canDeleteProject && (
          <button className="project-delete-button" onClick={handleDeleteProject} aria-label="Borrar proyecto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        )}
        <div className="previewWindow project-view-window" style={bgStyle} onClick={(e) => e.stopPropagation()}>
          <div className="previewContentList" style={{ gap: `${blockGap}px` }}>
            {blocks.length === 0 && <p className="previewEmptyMessage">No hay contenido para previsualizar.</p>}
            {blocks.map((b) => (
              <div key={b.id} className="previewContentItem"><RenderBlock block={b} /></div>
            ))}
          </div>
          <div className="project-footer-container">
            <Footer
              name={(profile && profile.publicName) || project?.item?.title || 'Anónimo'}
              avatar={(profile && profile.avatarUrl) || null}
              likes={project?.likes || 0}
              views={project?.views || 0}
              comments={project?.comments || 0}
              price={project?.item?.basePrice}
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
            <div className="project-order-container">
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
      <PopupSuccess
        isOpen={successState.isOpen}
        onClose={hideSuccess}
        message={successState.message}
        title={successState.title}
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
