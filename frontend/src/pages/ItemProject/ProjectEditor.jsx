import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProjectEditor.css'
import Editor from '../../components/ItemProject/Editor'
import useProjectStore, {
  BLOCK_TYPES,
  BLOCK_META,
} from './store/useProjectStore'
import { uploadFile } from '../../services/uploads'
import { useAuth } from '../../context/AuthContext'
import { createItem, createProject, getCategories } from '../../services/projects'
import { PopupConfirm, useConfirmPopup } from '../../components/PopupConfirm/PopupConfirm'
import { PopupSuccess, useSuccessPopup } from '../../components/PopupSuccess/PopupSuccess'

function ProjectSidebar({ onPreview }) {
  const addBlock = useProjectStore((s) => s.addBlock)
  const addBlockWithData = useProjectStore((s) => s.addBlockWithData)
  const background = useProjectStore((s) => s.background)
  const setBackground = useProjectStore((s) => s.setBackground)
  const blockGap = useProjectStore((s) => s.blockGap)
  const setBlockGap = useProjectStore((s) => s.setBlockGap)
  const [showAddContent, setShowAddContent] = useState(false)
  const [showEditProject, setShowEditProject] = useState(false)
  const [showSpacing, setShowSpacing] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const colorInputRef = useRef(null)

  function handleClick(type) {
    if (type === 'IMAGE') return pickImage()
    if (type === 'VIDEO') return pickVideo()
    if (type === 'GALLERY') return pickGallery()
    if (type === 'AUDIO') return pickAudio()
    addBlock(type)
  }

  function pickImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async () => {
      const files = Array.from(input.files || [])
      for (const file of files) {
        try {
          const url = await uploadFile(file, 'images')
          addBlockWithData('IMAGE', { src: url })
        } catch (e) { addBlockWithData('IMAGE', { src: '' }) }
      }
    }
    input.click()
  }

  function pickVideo() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const url = await uploadFile(file, 'video')
        addBlockWithData('VIDEO', { url })
      } catch (e) {
        addBlockWithData('VIDEO', { url: '' })
      }
    }
    input.click()
  }

  function pickGallery() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async () => {
      const files = Array.from(input.files || [])
      if (files.length === 0) return
      const uploads = []
      for (const f of files) {
        try { uploads.push(await uploadFile(f, 'images')) } catch (e) { /* silent fail */ }
      }
      addBlockWithData('GALLERY', { images: uploads })
    }
    input.click()
  }

  function pickAudio() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'audio/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const url = await uploadFile(file, 'audio')
        addBlockWithData('AUDIO', { audioSrc: url })
      } catch (e) { addBlockWithData('AUDIO', { audioSrc: '' }) }
    }
    input.click()
  }

  function pickBgImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const url = await uploadFile(file, 'images')
        setBackground('image', url)
      } catch (e) { /* silent fail */ }
    }
    input.click()
  }

  return (
    <div className="sidebarContent">
      {/* ── Isla 1: Configuración del proyecto ─────────────── */}
      <div className="sidebarIsland">
        <div className="editSection">
          <button className="editProjectButton" onClick={() => setShowAddContent(!showAddContent)}>
            Añadir contenido {showAddContent ? '▲' : '▼'}
          </button>
          {showAddContent && (
            <div className="backgroundPanel">
              <div className="sidebarButtonGrid">
                {Object.values(BLOCK_TYPES).map((type) => {
                  const meta = BLOCK_META[type]
                  return (
                    <button key={type} className="sidebarButton" onClick={() => handleClick(type)}>
                      <img src={`/project/${meta.icon}`} className="sidebarButtonIcon" alt={meta.label} />
                      <span className="sidebarButtonText">{meta.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Edit Project Button ─────────────── */}
        <div className="editSection">
          <button className="editProjectButton" onClick={() => setShowEditProject(!showEditProject)}>
            Editar proyecto {showEditProject ? '▲' : '▼'}
          </button>
          {showEditProject && (
            <div className="backgroundPanel">
              <div className="backgroundModeRow">
                <button
                  className={`backgroundModeButton${showColorPicker ? ' active' : ''}`}
                  onClick={() => {
                    setShowSpacing(false)
                    setShowImagePicker(false)
                    setShowColorPicker(!showColorPicker)
                  }}
                >
                  Color
                </button>
                <button
                  className={`backgroundModeButton${showImagePicker ? ' active' : ''}`}
                  onClick={() => {
                    setShowSpacing(false)
                    setShowColorPicker(false)
                    setShowImagePicker(!showImagePicker)
                  }}
                >
                  Imagen
                </button>
                <button
                  className={`backgroundModeButton${showSpacing ? ' active' : ''}`}
                  onClick={() => {
                    setShowColorPicker(false)
                    setShowImagePicker(false)
                    setShowSpacing(!showSpacing)
                  }}
                >
                  Espaciado
                </button>
              </div>

              {/* Color picker panel */}
              {showColorPicker && (
                <div className="colorInputWrapper">
                  <label className="colorInputLabel">Color de fondo</label>
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={background.value}
                    onChange={(e) => setBackground('color', e.target.value)}
                    className="modernColorInput"
                  />
                </div>
              )}

              {/* Image picker panel */}
              {showImagePicker && (
                <div className="imagePickerPanel">
                  {background.mode === 'image' && background.value ? (
                    <div className="backgroundImagePreview">
                      <img src={background.value} alt="bg" className="backgroundImageThumbnail" />
                      <button className="backgroundImageChangeButton" onClick={pickBgImage}>Cambiar</button>
                    </div>
                  ) : (
                    <button className="backgroundImageUploadButton" onClick={pickBgImage}>
                      Seleccionar imagen
                    </button>
                  )}
                </div>
              )}

              {/* Spacing panel */}
              {showSpacing && (
                <div className="spacingPanel" style={{ marginTop: 12 }}>
                  <h3 className="customizeHeading">Espaciado entre bloques</h3>
                  <div className="blockSpacingControl">
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="2"
                      value={blockGap}
                      onChange={(e) => setBlockGap(Number(e.target.value))}
                      className="blockSpacingSlider"
                    />
                    <span className="blockSpacingValue">{blockGap}px</span>
                  </div>
                </div>
              )}

              {/* Preview swatch */}
              {(showColorPicker || showImagePicker) && (
                <div
                  className="backgroundPreviewSwatch"
                  style={
                    background.mode === 'image'
                      ? { backgroundImage: `url(${background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: background.value }
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Isla 2: Acciones ─────────────── */}
      <div className="sidebarIsland actionsIsland">
        <button className="actionButton previewActionButton" onClick={onPreview}>
          Vista previa
        </button>
        <SaveProjectButton />
      </div>
    </div>
  )
}

function SaveProjectButton() {
  const exportJSON = useProjectStore((s) => s.exportJSON)
  const user = useAuth()?.user
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button className="actionButton saveActionButton" onClick={() => setShowModal(true)}>
        Guardar proyecto
      </button>
      {showModal && (
        <SaveProjectModal
          onClose={() => setShowModal(false)}
          exportJSON={exportJSON}
          user={user}
        />
      )}
    </>
  )
}

function SaveProjectModal({ onClose, exportJSON, user }) {
  const navigate = useNavigate()
  const { successState, showSuccess, hideSuccess } = useSuccessPopup()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let mounted = true
    getCategories()
      .then((list) => { if (mounted) setCategories(list || []) })
      .catch(() => { if (mounted) setCategories([]) })
    return () => { mounted = false }
  }, [])
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title || title.trim().length < 3) {
      showSuccess('El titulo debe tener al menos 3 caracteres', 'Alto ahi!', 'warning')
      return
    }
    if (!categoryId) {
      showSuccess('Debes seleccionar una categoria', 'Alto ahi!', 'warning')
      return
    }
    
    // Precio es opcional, pero si se introduce debe ser válido
    let price = null
    if (basePrice && basePrice.trim() !== '') {
      const parsedPrice = Number(basePrice)
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        showSuccess('El precio debe ser un numero valido mayor o igual a 0', 'Alto ahi!', 'warning')
        return
      }
      price = parsedPrice
    }

    setSaving(true)
    try {
    const data = exportJSON()

      const itemPayload = {
        creatorId: user?.id,
        title: title.trim(),
        description: description ? description.trim() : null,
        basePrice: price,
        itemType: 'PROJECT',
        categoryId: Number(categoryId),
      }

      const createdItem = await createItem(itemPayload)

      const projectPayload = {
        blocks: JSON.stringify(data.blocks || []),
        background: JSON.stringify(data.background || {}),
        blockGap: data.blockGap || 0,
        published: false,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }

      // ensure we pass the shared PK and item stub
      const itemId = createdItem?.id || (typeof createdItem === 'number' ? createdItem : null)
      if (!itemId) throw new Error('Created item has no id')
      projectPayload.id = itemId
      projectPayload.item = { id: itemId }

      const createdProject = await createProject(projectPayload)
      showSuccess('Proyecto guardado correctamente (id: ' + (createdProject.id || createdProject.item?.id) + ')', 'Éxito')
      onClose()
      try {
        // Redirect to the user's profile so they can see their projects immediately
        if (user?.id) navigate(`/profile/${user.id}`)
      } catch (e) {
        // Navigation error silenced
      }
    } catch (err) {
      showSuccess('Error al guardar: ' + (err.message || err), 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="modalOverlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h3 className="modalTitle">Guardar proyecto</h3>
          <form onSubmit={handleSubmit} className="modalForm">
            <label className="modalLabel">Título *</label>
            <input 
              className="modalInput" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ej: Mi increíble proyecto artístico"
              required 
            />

            <label className="modalLabel">Descripción</label>
            <textarea 
              className="modalTextarea" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Ej: Este proyecto muestra mi trabajo de ilustración digital con técnicas innovadoras..."
            />

            <label className="modalLabel">Precio base (opcional)</label>
            <input 
              className="modalInput" 
              type="number" 
              step="0.01" 
              min="0"
              value={basePrice} 
              onChange={(e) => setBasePrice(e.target.value)} 
              placeholder="Ej: 150.00"
            />

            <label className="modalLabel">Categoría *</label>
            <select 
              className="modalSelect" 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">-- Selecciona una categoría --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="modalButtons">
              <button type="button" onClick={onClose} disabled={saving} className="modalButton modalCancel">Cancelar</button>
              <button type="submit" disabled={saving} className="modalButton modalSave">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      </div>
      <PopupSuccess
        isOpen={successState.isOpen}
        onClose={hideSuccess}
        message={successState.message}
        title={successState.title}
        variant={successState.variant}
      />
    </>
  )
}

// modal inline styles removed; styles live in ProjectEditor.css

/* ── Preview Overlay (inline) ────────────────── */

function PreviewDialog({ onClose }) {
  const blocks = useProjectStore((s) => s.blocks)
  const background = useProjectStore((s) => s.background)
  const blockGap = useProjectStore((s) => s.blockGap)

  const bgStyle =
    background.mode === 'image'
      ? { backgroundImage: `url(${background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background: background.value }

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
            gridTemplateColumns: `repeat(${block.columns || 3}, 1fr)`,
            gap: `${block.gap ?? 8}px`,
          }}>
            {block.images.map((src, i) => (
              <img key={i} src={src} alt="" className="previewGalleryImage"
                style={{ aspectRatio: block.aspect === 'square' ? '1' : block.aspect === 'landscape'}} />
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
        return block.audioSrc ? <audio src={block.audioSrc} controls className="previewAudioPlayer" /> : null
      default:
        return null
    }
  }

  return (
    <div className="previewOverlay" onClick={onClose}>
      <button className="previewCloseButton" onClick={onClose}>✕</button>
      <div className="previewWindow" style={bgStyle} onClick={(e) => e.stopPropagation()}>
        <div className="previewContentList" style={{ gap: `${blockGap}px` }}>
          {blocks.length === 0 && <p className="previewEmptyMessage">No hay contenido para previsualizar.</p>}
          {blocks.map((block) => (
            <div key={block.id} className="previewContentItem">{renderBlock(block)}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── App ─────────────────────────────────────── */

function ProjectEditor() {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <>
      <div className="layoutPage">
        <main className="editorArea">
          <Editor />
        </main>
        <aside className="sidebarPanel">
          <ProjectSidebar onPreview={() => setShowPreview(true)} />
        </aside>
      </div>
      {showPreview && <PreviewDialog onClose={() => setShowPreview(false)} />}
    </>
  )
}

export default ProjectEditor
