import { useState } from 'react'
import { uploadFile } from '../../../services/uploads'

import useProjectStore, { BLOCK_TYPES, BLOCK_META, reorder } from '../../../store/useProjectStore'
import { TextBlock, ImageBlock, GalleryBlock, VideoBlock, AudioBlock, AudioPlayer } from './Blocks'
import { ActionButton } from '../../UI/ActionButton/ActionButton'
import { IconClose, IconChevronUp, IconChevronDown, IconImage, IconText, IconGallery, IconVideo, IconAudio } from '../../UI/Icons/Icons'
import './Project.css'

function BlockRenderer({ block, onChange, preview }) {
  switch (block.type) {
    case BLOCK_TYPES.TEXT:
      return preview
        ? <div className="previewTextContent" dangerouslySetInnerHTML={{ __html: block.content }} />
        : <TextBlock block={block} onChange={onChange} />
    case BLOCK_TYPES.IMAGE:
      return preview
        ? block.src && <img src={block.src} alt="" className="previewImageContent" />
        : <ImageBlock block={block} onChange={onChange} />
    case BLOCK_TYPES.GALLERY:
      return preview
        ? <div className="previewGalleryGrid">{block.images.map((s, i) => <img key={i} src={s} alt="" />)}</div>
        : <GalleryBlock block={block} onChange={onChange} />
    case BLOCK_TYPES.VIDEO:
      return <VideoBlock block={block} onChange={onChange} />
    case BLOCK_TYPES.AUDIO:
      return preview
        ? block.audioSrc && <AudioPlayer src={block.audioSrc} preview />
        : <AudioBlock block={block} onChange={onChange} />
    default:
      return null
  }
}

function EditorBlockCard({ block }) {
  const updateBlock = useProjectStore((s) => s.updateBlock)
  const removeBlock = useProjectStore((s) => s.removeBlock)

  return (
    <div className="blockCard">
      <div className="blockCardHeader">
        <span className="blockTypeBadge">{BLOCK_META[block.type]?.label}</span>
        <div className="blockActionGroup">
          <button onClick={() => removeBlock(block.id)} title="Eliminar" className="blockActionButton">
            <IconClose size={16} />
          </button>
        </div>
      </div>
      <BlockRenderer block={block} onChange={(patch) => updateBlock(block.id, patch)} />
    </div>
  )
}

function BlockReorderDialog({ onClose }) {
  const blocks = useProjectStore((s) => s.blocks)
  const reorderBlocks = useProjectStore((s) => s.reorderBlocks)

  function moveUp(index) {
    if (index <= 0) return
    reorderBlocks(reorder(blocks, index, index - 1))
  }

  function moveDown(index) {
    if (index >= blocks.length - 1) return
    reorderBlocks(reorder(blocks, index, index + 1))
  }

  return (
    <div className="reorderOverlay" onClick={onClose}>
      <div className="reorderPanel" onClick={(e) => e.stopPropagation()}>
        <div className="reorderHeader">
          <h3>Ordenar bloques</h3>
          <button className="reorderClose" onClick={onClose}>
            <IconClose size={16} />
          </button>
        </div>
        <ul className="reorderList">
          {blocks.map((block, i) => (
            <li key={block.id} className="reorderItem">
              <span className="reorderIndex">{i + 1}</span>
              {block.type === 'IMAGE' && block.src && (
                <img src={block.src} alt="" className="reorderThumbnail" />
              )}
              <span className="reorderLabel">{BLOCK_META[block.type]?.label}</span>
              <div className="reorderBtns">
                <button
                  className="reorderBtn"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  title="Subir"
                >
                  <IconChevronUp size={12} />
                </button>
                <button
                  className="reorderBtn"
                  onClick={() => moveDown(i)}
                  disabled={i === blocks.length - 1}
                  title="Bajar"
                >
                  <IconChevronDown size={12} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Editor() {
  const blocks = useProjectStore((s) => s.blocks)
  const addBlock = useProjectStore((s) => s.addBlock)
  const addBlockWithData = useProjectStore((s) => s.addBlockWithData)
  const background = useProjectStore((s) => s.background)
  const blockGap = useProjectStore((s) => s.blockGap)
  const blockBorderRadius = useProjectStore((s) => s.blockBorderRadius)
  const [showReorder, setShowReorder] = useState(false)

  const bgStyle =
    background.mode === 'image'
      ? { backgroundImage: `url(${background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : background.value !== '#ffffff'
        ? { background: background.value }
        : {}

  const emptyActions = [
    { type: BLOCK_TYPES.IMAGE, icon: <IconImage size={28} /> },
    { type: BLOCK_TYPES.TEXT, icon: <IconText size={28} /> },
    { type: BLOCK_TYPES.GALLERY, icon: <IconGallery size={28} /> },
    { type: BLOCK_TYPES.VIDEO, icon: <IconVideo size={28} /> },
    { type: BLOCK_TYPES.AUDIO, icon: <IconAudio size={28} /> },
  ]

  return (
    <>
      <div className="editorBlockList" style={{ ...bgStyle, gap: `${blockGap}px` }}>
        {blocks.length === 0 && (background.mode !== 'color' || background.value === '#ffffff') && (
          <div className="emptyBlockState">
            <div className="emptyProjectCard">
              <div className="emptyProjectTitle">
                <span>CONSTRUYE</span>
                <strong>TU <b>PROYECTO</b></strong>
              </div>
              <div className="emptyProjectActions">
                {emptyActions.map((action) => (
                  <ActionButton
                    key={action.type}
                    icon={action.icon}
                    label={BLOCK_META[action.type]?.label}
                    large={true}
                    onClick={async () => {
                      if (action.type === BLOCK_TYPES.IMAGE) {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = async () => {
                          const file = input.files?.[0]
                          if (!file) return
                          try {
                            const url = await uploadFile(file, 'images')
                            addBlockWithData('IMAGE', { src: url })
                          } catch (e) {
                            addBlockWithData('IMAGE', { src: '' })
                          }
                        }
                        input.click()
                      } else if (action.type === BLOCK_TYPES.VIDEO) {
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
                      } else if (action.type === BLOCK_TYPES.GALLERY) {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.multiple = true
                        input.onchange = async () => {
                          const files = Array.from(input.files || [])
                          if (files.length === 0) return
                          const uploads = []
                           for (const f of files) {
                             try { uploads.push(await uploadFile(f, 'images')) } catch (e) { console.error('Failed to upload gallery image:', e) }
                           }
                          addBlockWithData('GALLERY', { images: uploads })
                        }
                        input.click()
                      } else if (action.type === BLOCK_TYPES.AUDIO) {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'audio/*'
                        input.onchange = async () => {
                          const file = input.files?.[0]
                          if (!file) return
                          try {
                            const url = await uploadFile(file, 'audio')
                            addBlockWithData('AUDIO', { audioSrc: url })
                          } catch (e) {
                            addBlockWithData('AUDIO', { audioSrc: '' })
                          }
                        }
                        input.click()
                      } else {
                        addBlock(action.type)
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {blocks.length > 1 && (
          <button className="reorderToggle" onClick={() => setShowReorder(true)} title="Ordenar bloques">
            ☰
          </button>
        )}
        {blocks.map((block) => (
          <EditorBlockCard key={block.id} block={block} />
        ))}
      </div>
      {showReorder && <BlockReorderDialog onClose={() => setShowReorder(false)} />}
    </>
  )
}
