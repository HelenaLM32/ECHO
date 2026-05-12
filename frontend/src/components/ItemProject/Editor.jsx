import { useState } from 'react'
import { uploadFile } from '../../services/uploads'

import useProjectStore, { BLOCK_TYPES, BLOCK_META, reorder } from '../../pages/ItemProject/store/useProjectStore'
import { TextBlock, ImageBlock, GalleryBlock, VideoBlock, AudioBlock } from './Blocks'
import './ItemProject.css'

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
        ? block.audioSrc && <audio src={block.audioSrc} controls className="audioPlayerFullWidth" />
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
          <button onClick={() => removeBlock(block.id)} title="Eliminar" className="blockActionButton">✕</button>
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
          <button className="reorderClose" onClick={onClose}>✕</button>
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
                >▲</button>
                <button
                  className="reorderBtn"
                  onClick={() => moveDown(i)}
                  disabled={i === blocks.length - 1}
                  title="Bajar"
                >▼</button>
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
      : { background: background.value }

  const emptyActions = [
    { type: BLOCK_TYPES.IMAGE, icon: 'imagene.svg' },
    { type: BLOCK_TYPES.TEXT, icon: 'text.svg' },
    { type: BLOCK_TYPES.GALLERY, icon: 'galeria.svg' },
    { type: BLOCK_TYPES.VIDEO, icon: 'video.svg' },
  ]

  return (
    <>
      <div className="editorBlockList" style={{ ...bgStyle, gap: `${blockGap}px` }}>
        {blocks.length === 0 && (
          <div className="emptyBlockState">
            <div className="emptyProjectCard">
              <div className="emptyProjectTitle">
                <span>CONSTRUYE</span>
                <strong>TU <b>PROYECTO</b></strong>
              </div>
              <div className="emptyProjectActions">
                {emptyActions.map((action) => (
                  <button
                    key={action.type}
                    type="button"
                    className="emptyActionButton"
                    onClick={async () => {
                      if (action.type === BLOCK_TYPES.VIDEO) {
                        // open file selector and upload
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
                      } else {
                        addBlock(action.type)
                      }
                    }}
                  >
                    <div className="emptyActionIcon">
                      <img src={`/project/${action.icon}`} className="iconImg" alt="" />
                    </div>
                    <span className="emptyActionLabel">{BLOCK_META[action.type]?.label}</span>
                  </button>
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
