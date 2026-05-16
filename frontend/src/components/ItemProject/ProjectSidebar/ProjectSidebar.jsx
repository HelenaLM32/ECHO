import { useState, useRef } from 'react'
import useProjectStore, { BLOCK_TYPES, BLOCK_META } from '../../../store/useProjectStore'
import { ActionButton } from '../../UI/ActionButton/ActionButton'
import { uploadFile } from '../../../services/uploads'
import useFilePicker from '../../../hooks/useFilePicker'
import SaveProjectModal from '../SaveProjectModal/SaveProjectModal'
import { useAuth } from '../../../context/AuthContext'
import { IconChevronUp, IconChevronDown, IconImage, IconText, IconGallery, IconVideo, IconAudio } from '../../UI/Icons/Icons'
import './ProjectSidebar.css'

/**
 * Botón para guardar proyecto - Abre el modal de guardado
 * @param {string} mode - 'create' o 'edit'
 */
function SaveProjectButton({ mode = 'create' }) {
  const exportJSON = useProjectStore((s) => s.exportJSON)
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button className="actionButton saveActionButton" onClick={() => setShowModal(true)}>
        {mode === 'create' ? 'Guardar proyecto' : 'Guardar cambios'}
      </button>
      {showModal && (
        <SaveProjectModal
          onClose={() => setShowModal(false)}
          exportJSON={exportJSON}
          user={user}
          mode={mode}
        />
      )}
    </>
  )
}

/**
 * Sidebar para edición de proyectos
 * @param {Object} props
 * @param {Function} props.onPreview - Callback para mostrar vista previa
 * @param {string} props.mode - 'create' o 'edit'
 */
function ProjectSidebar({ onPreview, mode = 'create' }) {
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

  const { pickImage, pickVideo, pickGallery, pickAudio } = useFilePicker(addBlockWithData)

  function handleClick(type) {
    if (type === 'IMAGE') return pickImage()
    if (type === 'VIDEO') return pickVideo()
    if (type === 'GALLERY') return pickGallery()
    if (type === 'AUDIO') return pickAudio()
    addBlock(type)
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
      } catch (e) { 
        console.error('Error uploading background image:', e)
      }
    }
    input.click()
  }

  return (
    <div className="sidebarContent">
      {/* ── Isla 1: Configuración del proyecto ─────────────── */}
      <div className="sidebarIsland">
        <div className="editSection">
          <button className="editProjectButton" onClick={() => setShowAddContent(!showAddContent)}>
            Añadir contenido
            <span className="editProjectButton__arrow">
              {showAddContent ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />}
            </span>
          </button>
          {showAddContent && (
            <div className="backgroundPanel">
              <div className="sidebarButtonGrid">
                {Object.values(BLOCK_TYPES).map((type) => {
                  const meta = BLOCK_META[type]
                  const getIcon = () => {
                    switch(type) {
                      case BLOCK_TYPES.TEXT: return <IconText size={28} />
                      case BLOCK_TYPES.IMAGE: return <IconImage size={28} />
                      case BLOCK_TYPES.GALLERY: return <IconGallery size={28} />
                      case BLOCK_TYPES.VIDEO: return <IconVideo size={28} />
                      case BLOCK_TYPES.AUDIO: return <IconAudio size={28} />
                      default: return null
                    }
                  }
                  return (
                    <ActionButton
                      key={type}
                      icon={getIcon()}
                      label={meta.label}
                      large={false}
                      onClick={() => handleClick(type)}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Edit Project Button ─────────────── */}
        <div className="editSection">
          <button className="editProjectButton" onClick={() => setShowEditProject(!showEditProject)}>
            Editar proyecto
            <span className="editProjectButton__arrow">
              {showEditProject ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />}
            </span>
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
                    setShowImagePicker(true)
                    // Abrir selector de archivos directamente si no hay imagen
                    if (background.mode !== 'image' || !background.value) {
                      setTimeout(() => pickBgImage(), 100)
                    }
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

              {/* Image picker panel - solo muestra vista previa si hay imagen */}
              {showImagePicker && background.mode === 'image' && background.value && (
                <div className="imagePickerPanel">
                  <div className="backgroundImagePreview">
                    <img src={background.value} alt="bg" className="backgroundImageThumbnail" />
                    <button className="backgroundImageChangeButton" onClick={pickBgImage}>Cambiar</button>
                  </div>
                </div>
              )}

              {/* Spacing panel */}
              {showSpacing && (
                <div className="spacingPanel">
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
        <SaveProjectButton mode={mode} />
      </div>
    </div>
  )
}

export default ProjectSidebar
