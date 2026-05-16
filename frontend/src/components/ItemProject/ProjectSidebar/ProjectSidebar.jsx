import { useState, useRef } from 'react'
import useProjectStore, { BLOCK_TYPES, BLOCK_META } from '../../../store/useProjectStore'
import { ActionButton } from '../../UI/ActionButton/ActionButton'
import { uploadFile } from '../../../services/uploads'
import useFilePicker from '../../../hooks/useFilePicker'
import SaveProjectModal from '../SaveProjectModal/SaveProjectModal'
import { useAuth } from '../../../context/AuthContext'
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
              {showAddContent ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
          </button>
          {showAddContent && (
            <div className="backgroundPanel">
              <div className="sidebarButtonGrid">
                {Object.values(BLOCK_TYPES).map((type) => {
                  const meta = BLOCK_META[type]
                  const getIcon = () => {
                    switch(type) {
                      case BLOCK_TYPES.TEXT:
                        return (
                          <svg width="28" height="28" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h16v4h-2V2H9v12h3v2H4v-2h3V2H2v2H0V2z" fill="currentColor" fillRule="evenodd"/>
                          </svg>
                        )
                      case BLOCK_TYPES.IMAGE:
                        return (
                          <svg width="28" height="28" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.083,4.667 C12.083,3.562 12.978,2.667 14.083,2.667 C15.188,2.667 16.083,3.562 16.083,4.667 C16.083,5.772 15.188,6.667 14.083,6.667 C12.978,6.667 12.083,5.772 12.083,4.667 L12.083,4.667 Z M18,12.086 L13.987,8.074 L13.971,8.089 L13.955,8.074 L12.525,9.504 L7.896,4.876 L7.881,4.892 L7.865,4.876 L2,10.741 L2,2 L18,2 L18,12.086 Z M0,16 L20,16 L20,0 L0,0 L0,16 Z" fill="currentColor"/>
                          </svg>
                        )
                      case BLOCK_TYPES.GALLERY:
                        return (
                          <svg width="28" height="28" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 1H1V5H7V1Z" fill="currentColor"/>
                            <path d="M7 7H1V15H7V7Z" fill="currentColor"/>
                            <path d="M9 1H15V9H9V1Z" fill="currentColor"/>
                            <path d="M15 11H9V15H15V11Z" fill="currentColor"/>
                          </svg>
                        )
                      case BLOCK_TYPES.VIDEO:
                        return (
                          <svg width="28" height="28" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16 2H0V14H16V2ZM6.5 5V11H7.5L11 8L7.5 5H6.5Z" fill="currentColor"/>
                          </svg>
                        )
                      case BLOCK_TYPES.AUDIO:
                        return (
                          <svg width="28" height="28" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 1H4V9H3C1.34315 9 0 10.3431 0 12C0 13.6569 1.34315 15 3 15C4.65685 15 6 13.6569 6 12V5H13V9H12C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V1Z" fill="currentColor"/>
                          </svg>
                        )
                      default:
                        return null
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
              {showEditProject ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
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
