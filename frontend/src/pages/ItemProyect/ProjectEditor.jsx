import { useState, useRef } from 'react'
import './ProjectEditor.css'
import Editor from '../../components/ItemProyect/Editor'
import useProjectStore, {
  BLOCK_TYPES,
  BLOCK_META,
  fileToBase64,
} from './store/useProjectStore'

/* ── Sidebar (inline) ────────────────────────── */

function ProjectSidebar({ onPreview }) {
  const addBlock = useProjectStore((s) => s.addBlock)
  const addBlockWithData = useProjectStore((s) => s.addBlockWithData)
  const background = useProjectStore((s) => s.background)
  const setBackground = useProjectStore((s) => s.setBackground)
  const blockGap = useProjectStore((s) => s.blockGap)
  const setBlockGap = useProjectStore((s) => s.setBlockGap)
  const blockBorderRadius = useProjectStore((s) => s.blockBorderRadius)
  const setBlockBorderRadius = useProjectStore((s) => s.setBlockBorderRadius)
  const [showEditProject, setShowEditProject] = useState(false)
  const [showCustomizeStyles, setShowCustomizeStyles] = useState(false)
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
        addBlockWithData('IMAGE', { src: await fileToBase64(file) })
      }
    }
    input.click()
  }

  function pickVideo() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      addBlockWithData('VIDEO', { url: URL.createObjectURL(file), isLocal: true })
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
      addBlockWithData('GALLERY', { images: await Promise.all(files.map(fileToBase64)) })
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
      addBlockWithData('AUDIO', { audioSrc: await fileToBase64(file) })
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
      setBackground('image', await fileToBase64(file))
    }
    input.click()
  }

  return (
    <div className="sidebarContent">
      <h3 className="sidebarHeading">Añadir contenido</h3>
      <div className="sidebarButtonGrid">
        {Object.values(BLOCK_TYPES).map((type) => {
          const meta = BLOCK_META[type]
          return (
            <button key={type} className="sidebarButton" onClick={() => handleClick(type)}>
              <span className="sidebarButtonIcon">{meta.icon}</span>
              <span className="sidebarButtonText">{meta.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Edit Project Button ─────────────── */}
      <div className="editSection">
        <button className="editProjectButton" onClick={() => setShowEditProject(!showEditProject)}>
          Editar proyecto {showEditProject ? '▲' : '▼'}
        </button>
        {showEditProject && (
          <div className="backgroundPanel">
            <div className="backgroundModeRow">
              {[
                { mode: 'color', label: 'Color' },
                { mode: 'image', label: 'Imagen' },
              ].map(({ mode, label }) => (
                <button
                  key={mode}
                  className={`backgroundModeButton${background.mode === mode ? ' active' : ''}`}
                  onClick={() => {
                    if (mode === 'image') return pickBgImage()
                    if (mode === 'color') {
                      setBackground('color', background.value || '#ffffff')
                      colorInputRef.current?.click()
                    }
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Hidden color input */}
            <input
              ref={colorInputRef}
              type="color"
              value={background.value}
              onChange={(e) => setBackground('color', e.target.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />

            {background.mode === 'image' && background.value && (
              <div className="backgroundImagePreview">
                <img src={background.value} alt="bg" className="backgroundImageThumbnail" />
                <button className="backgroundImageChangeButton" onClick={pickBgImage}>Cambiar</button>
              </div>
            )}

            <div
              className="backgroundPreviewSwatch"
              style={
                background.mode === 'image'
                  ? { backgroundImage: `url(${background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : background.mode === 'gradient'
                    ? { background: background.value }
                    : { background: background.value }
            }
            />
          </div>
        )}
      </div>

      {/* ── Customize Styles Button ─────────────── */}
      <div className="editSection">
        <button className="editProjectButton" onClick={() => setShowCustomizeStyles(!showCustomizeStyles)}>
          Personalizar estilos {showCustomizeStyles ? '▲' : '▼'}
        </button>
        {showCustomizeStyles && (
          <div className="backgroundPanel">
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

            <h3 className="customizeHeading">Borde de imágenes y videos</h3>
            <div className="blockSpacingControl">
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={blockBorderRadius}
                onChange={(e) => setBlockBorderRadius(Number(e.target.value))}
                className="blockSpacingSlider"
              />
              <span className="blockSpacingValue">{blockBorderRadius}px</span>
            </div>
          </div>
        )}
      </div>

      <button className="previewButton" onClick={onPreview}>Vista previa</button>
    </div>
  )
}

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
            {block.audio && <audio src={block.audio} controls className="previewAudioPlayer" />}
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
                style={{ aspectRatio: block.aspect === 'square' ? '1' : block.aspect === 'landscape' ? '16/9' : block.aspect === 'portrait' ? '3/4' : 'auto' }} />
            ))}
          </div>
        )
      case BLOCK_TYPES.VIDEO:
        if (block.isLocal && block.url)
          return <video src={block.url} controls className="previewVideo" />
        if (block.url) {
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
