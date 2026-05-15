import { useState } from 'react'
import { uploadFile } from '../../services/uploads'

import useProjectStore, { BLOCK_TYPES, BLOCK_META, reorder } from '../../pages/ItemProject/store/useProjectStore'
import { TextBlock, ImageBlock, GalleryBlock, VideoBlock, AudioBlock } from './Blocks'
import { ActionButton } from '../ActionButton/ActionButton'
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
          <button onClick={() => removeBlock(block.id)} title="Eliminar" className="blockActionButton">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fill="currentColor" fillRule="evenodd"/>
            </svg>
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
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fill="currentColor" fillRule="evenodd"/>
            </svg>
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  className="reorderBtn"
                  onClick={() => moveDown(i)}
                  disabled={i === blocks.length - 1}
                  title="Bajar"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
    { type: BLOCK_TYPES.IMAGE, icon: (
      <svg width="28" height="28" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.083,4.667 C12.083,3.562 12.978,2.667 14.083,2.667 C15.188,2.667 16.083,3.562 16.083,4.667 C16.083,5.772 15.188,6.667 14.083,6.667 C12.978,6.667 12.083,5.772 12.083,4.667 L12.083,4.667 Z M18,12.086 L13.987,8.074 L13.971,8.089 L13.955,8.074 L12.525,9.504 L7.896,4.876 L7.881,4.892 L7.865,4.876 L2,10.741 L2,2 L18,2 L18,12.086 Z M0,16 L20,16 L20,0 L0,0 L0,16 Z" fill="currentColor"/>
      </svg>
    )},
    { type: BLOCK_TYPES.TEXT, icon: (
      <svg width="28" height="28" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h16v4h-2V2H9v12h3v2H4v-2h3V2H2v2H0V2z" fill="currentColor" fillRule="evenodd"/>
      </svg>
    )},
    { type: BLOCK_TYPES.GALLERY, icon: (
      <svg width="28" height="28" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1H1V5H7V1Z" fill="currentColor"/>
        <path d="M7 7H1V15H7V7Z" fill="currentColor"/>
        <path d="M9 1H15V9H9V1Z" fill="currentColor"/>
        <path d="M15 11H9V15H15V11Z" fill="currentColor"/>
      </svg>
    )},
    { type: BLOCK_TYPES.VIDEO, icon: (
      <svg width="28" height="28" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M16 2H0V14H16V2ZM6.5 5V11H7.5L11 8L7.5 5H6.5Z" fill="currentColor"/>
      </svg>
    )},
    { type: BLOCK_TYPES.AUDIO, icon: (
      <svg width="28" height="28" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 1H4V9H3C1.34315 9 0 10.3431 0 12C0 13.6569 1.34315 15 3 15C4.65685 15 6 13.6569 6 12V5H13V9H12C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V1Z" fill="currentColor"/>
      </svg>
    )},
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
                            try { uploads.push(await uploadFile(f, 'images')) } catch (e) { /* silent fail */ }
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
