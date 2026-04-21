import { useRef, useCallback, useEffect } from 'react'
import { fileToBase64, toEmbedUrl } from '../../pages/ItemProyect/store/useProjectStore'
import './ItemProyect.css'

/* ── Text Block (rich editor) ────────────────── */

const TEXT_EDITOR_FORMATS = [
  { cmd: 'bold', icon: 'B', title: 'Negrita' },
  { cmd: 'italic', icon: 'I', title: 'Cursiva' },
  { cmd: 'underline', icon: 'U', title: 'Subrayado' },
  { cmd: 'strikeThrough', icon: 'S', title: 'Tachado' },
  { sep: true },
  { cmd: 'insertUnorderedList', icon: '•', title: 'Lista' },
  { cmd: 'insertOrderedList', icon: '1.', title: 'Lista numerada' },
  { sep: true },
  { cmd: 'justifyLeft', icon: '⫷', title: 'Izquierda' },
  { cmd: 'justifyCenter', icon: 'O', title: 'Centro' },
  { cmd: 'justifyRight', icon: '⫸', title: 'Derecha' },
]

const HEADING_OPTIONS = [
  { label: 'Normal', value: 'p' },
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
]

const FONT_FAMILIES = [
  'Sans-serif',
  'Serif',
  'Monospace',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Palatino Linotype',
  'Garamond',
  'Comic Sans MS',
  'Impact',
]

export function TextBlock({ block, onChange }) {
  const editorRef = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = block.content || ''
      document.execCommand('styleWithCSS', false, true)
      initialized.current = true
    }
  }, [block])

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) onChange({ content: editorRef.current.innerHTML })
  }, [onChange])

  function executeRichTextCommand(cmd, value) {
    document.execCommand(cmd, false, value || null)
    editorRef.current?.focus()
    handleEditorInput()
  }

  function handleHeadingChange(e) {
    const val = e.target.value
    executeRichTextCommand('formatBlock', val)
  }

  function handleFontChange(e) {
    const val = e.target.value
    if (val) executeRichTextCommand('fontName', val)
  }

  function handleColorChange(e) {
    const color = e.target.value
    editorRef.current?.focus()
    executeRichTextCommand('foreColor', color)
  }

  return (
    <div className="blockContentArea">
      <div className="richTextToolbar">
        <select className="headingSelect" onChange={handleHeadingChange} defaultValue="">
          <option value="" disabled>Encabezado</option>
          {HEADING_OPTIONS.map((h) => (
            <option key={h.label} value={h.value}>{h.label}</option>
          ))}
        </select>
        <select className="fontSelect" onChange={handleFontChange} defaultValue="">
          <option value="" disabled>Fuente</option>
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
          ))}
        </select>
        <input
          type="color"
          title="Color del texto"
          onChange={handleColorChange}
          className="textColorInput"
        />
        {TEXT_EDITOR_FORMATS.map((f, i) =>
          f.sep ? (
            <span key={i} className="toolbarDivider" />
          ) : (
            <button
              key={f.cmd}
              type="button"
              className="toolbarActionButton"
              title={f.title}
              onMouseDown={(e) => { e.preventDefault(); executeRichTextCommand(f.cmd) }}
            >
              {f.icon}
            </button>
          )
        )}
      </div>
      <div
        ref={editorRef}
        className="richTextEditor"
        contentEditable
        suppressContentEditableWarning
        dir="ltr"
        onInput={handleEditorInput}
        data-placeholder="Haz clic aquí para empezar a escribir tu texto..."
      />
    </div>
  )
}

/* ── Image Block ─────────────────────────────── */

export function ImageBlock({ block, onChange }) {
  async function handleImageFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    onChange({ src: await fileToBase64(file) })
  }

  async function handleAudioFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    onChange({ audio: await fileToBase64(file) })
  }

  return (
    <div className="blockContentArea">
      {block.src ? (
        <div className="imageContainer">
          <img src={block.src} alt="imagen" className="image" />
          <label className="imageAudioButton" title="Añadir audio a la imagen">
            {block.audio ? '♪' : '♪'}
            <input type="file" accept="audio/*" onChange={handleAudioFileChange} hidden />
          </label>
        </div>
      ) : (
        <label className="uploadDropZone">
          <span>Haz clic para subir una imagen</span>
          <input type="file" accept="image/*" onChange={handleImageFileChange} hidden />
        </label>
      )}
      {block.audio && (
        <div className="audioControlRow">
          <audio src={block.audio} controls className="audioPlayerControl" />
          <button className="audioRemoveButton" onClick={() => onChange({ audio: '' })} title="Quitar audio">✕</button>
        </div>
      )}
    </div>
  )
}

/* ── Gallery Block ───────────────────────────── */

const ASPECT_OPTIONS = [
  { label: 'Cuadrado', value: 'square' },
  { label: 'Original', value: 'original' },
  { label: 'Horizontal', value: 'landscape' },
  { label: 'Vertical', value: 'portrait' },
]

export function GalleryBlock({ block, onChange }) {
  const columns = block.columns || 3
  const gap = block.gap ?? 8
  const aspect = block.aspect || 'square'

  async function handleFiles(e) {
    const fileList = Array.from(e.target.files || [])
    if (fileList.length === 0) return
    const newImages = await Promise.all(fileList.map(fileToBase64))
    onChange({ images: [...block.images, ...newImages] })
  }

  function removeImage(index) {
    onChange({ images: block.images.filter((_, i) => i !== index) })
  }

  const aspectRatio = aspect === 'square' ? '1' : aspect === 'landscape' ? '16/9' : aspect === 'portrait' ? '3/4' : 'auto'

  return (
    <div className="blockContentArea">
      <div className="galleryControlBar">
        <label className="galleryControlItem">
          Columnas
          <input type="range" min="1" max="6" value={columns} onChange={(e) => onChange({ columns: Number(e.target.value) })} />
          <span>{columns}</span>
        </label>
        <label className="galleryControlItem">
          Espacio
          <input type="range" min="0" max="24" step="2" value={gap} onChange={(e) => onChange({ gap: Number(e.target.value) })} />
          <span>{gap}px</span>
        </label>
        <label className="galleryControlItem">
          Proporcion
          <select value={aspect} onChange={(e) => onChange({ aspect: e.target.value })}>
            {ASPECT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div
        className="galleryGrid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {block.images.map((src, i) => (
          <div key={i} className="galleryGridItem" style={{ aspectRatio }}>
            <img src={src} alt={`gallery-${i}`} />
            <button className="galleryItemRemoveButton" onClick={() => removeImage(i)} title="Eliminar">×</button>
          </div>
        ))}
        <label className="galleryAddButton" style={{ aspectRatio }}>
          <span>+</span>
          <input type="file" accept="image/*" multiple onChange={handleFiles} hidden />
        </label>
      </div>
    </div>
  )
}

/* ── Video Block ─────────────────────────────── */

export function VideoBlock({ block, onChange }) {
  if (block.isLocal && block.url) {
    return (
      <div className="blockContentArea">
        <div className="videoLocal">
          <video src={block.url} controls />
        </div>
      </div>
    )
  }

  const embedSrc = block.url ? toEmbedUrl(block.url) : ''

  return (
    <div className="blockContentArea">
      <input
        className="videoUrlInput"
        type="url"
        placeholder="Pega la URL del vídeo (YouTube, Vimeo…)"
        value={block.url}
        onChange={(e) => onChange({ url: e.target.value })}
      />
      {embedSrc && (
        <div className="videoEmbedContainer">
          <iframe
            src={embedSrc}
            title="video"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}
    </div>
  )
}

/* ── Audio Block ─────────────────────────────── */

export function AudioBlock({ block, onChange }) {
  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    onChange({ audioSrc: await fileToBase64(file) })
  }

  return (
    <div className="blockContentArea">
      {block.audioSrc ? (
        <audio src={block.audioSrc} controls className="audioPlayerFullWidth" />
      ) : (
        <label className="uploadDropZone">
          <span>Haz clic para subir un audio</span>
          <input type="file" accept="audio/*" onChange={handleFile} hidden />
        </label>
      )}
    </div>
  )
}
