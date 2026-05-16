import { useRef, useCallback, useEffect, useState } from 'react'
import { uploadFile } from '../../../services/uploads'
import './Project.css'

// Componente reutilizable para el reproductor de audio
export function AudioPlayer({ src, preview = false, inEditor = false }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef(null)

  function togglePlay() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  function handleTimeUpdate() {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  function handleLoadedMetadata() {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  function handleSeek(e) {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  function toggleMute() {
    if (audioRef.current) {
      const newVolume = volume === 0 ? 1 : 0
      audioRef.current.volume = newVolume
      setVolume(newVolume)
    }
  }

  function handleEnded() {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  function formatTime(time) {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`audioPlayerWrapper${preview ? ' preview' : ''}${inEditor ? ' inEditor' : ''}`}>
      <audio
        ref={audioRef}
        src={src}
        className="audioPlayerFullWidth"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <div className="audioPlayerCustom">
        <button className="audioPlayerPlayBtn" onClick={togglePlay} type="button">
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="audioPlayerProgress"
        />
        <span className="audioPlayerTime">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <button 
          className="audioPlayerVolumeBtn" 
          onClick={toggleMute}
          type="button"
          title={volume === 0 ? "Activar sonido" : "Silenciar"}
        >
          {volume === 0 ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : volume < 0.5 ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

const TEXT_EDITOR_FORMATS = [
  { cmd: 'bold', icon: (
    <span className="toolbarIcon">
      <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M2 1H8.625C11.0412 1 13 2.95875 13 5.375C13 6.08661 12.8301 6.75853 12.5287 7.35243C13.4313 8.15386 14 9.32301 14 10.625C14 13.0412 12.0412 15 9.625 15H2V1ZM5.5 9.75V11.5H9.625C10.1082 11.5 10.5 11.1082 10.5 10.625C10.5 10.1418 10.1082 9.75 9.625 9.75H5.5ZM5.5 6.25H8.625C9.10825 6.25 9.5 5.85825 9.5 5.375C9.5 4.89175 9.10825 4.5 8.625 4.5H5.5V6.25Z" fill="currentColor"/>
      </svg>
    </span>
  ), title: 'Negrita' },
  { cmd: 'italic', icon: (
    <span className="toolbarIcon">
      <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 1H5V4H7.75219L5.08553 12H2V15H11V12H8.24781L10.9145 4H14V1Z" fill="currentColor"/>
      </svg>
    </span>
  ), title: 'Cursiva' },
  { cmd: 'underline', icon: (
    <span className="toolbarIcon">
      <svg width="18" height="18" viewBox="0 0 92.246 92.246" xmlns="http://www.w3.org/2000/svg">
        <path d="M32.824,59.723h26.819l3.764,14.307h19.725L58.776,0H33.169L9.114,74.029h19.845L32.824,59.723z M36.842,41.151 l8.094-24.028l2.636,0.004l8.483,25.675H36.404L36.842,41.151z" fill="currentColor"/>
        <rect x="9.114" y="80.768" width="74.018" height="11.479" fill="currentColor"/>
      </svg>
    </span>
  ), title: 'Subrayado' },
  { cmd: 'strikeThrough', icon: (
    <span className="toolbarIcon">
      <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 4.75C5 4.45531 5.16258 4.05336 5.69626 3.66792C6.22795 3.28392 7.03762 3 8 3C9.75028 3 10.7599 3.87319 10.9539 4.4663L13.8053 3.5337C13.0616 1.26011 10.5055 0 8 0C6.4771 0 5.03677 0.443615 3.93978 1.23588C2.84478 2.02672 2 3.24977 2 4.75C2 5.59786 2.26982 6.35719 2.70214 7H0V9H16V7H10.7035C9.87766 6.67447 8.95507 6.5 8 6.5C7.03762 6.5 6.22795 6.21608 5.69626 5.83208C5.16258 5.44664 5 5.04469 5 4.75Z" fill="currentColor"/>
        <path d="M11 11.25C11 11.1732 10.989 11.0892 10.9632 11H13.9921C13.9973 11.0824 14 11.1658 14 11.25C14 12.7502 13.1552 13.9733 12.0602 14.7641C10.9632 15.5564 9.5229 16 8 16C5.49455 16 2.93836 14.7399 2.19473 12.4663L5.0461 11.5337C5.24008 12.1268 6.24972 13 8 13C8.96238 13 9.77205 12.7161 10.3037 12.3321C10.8374 11.9466 11 11.5447 11 11.25Z" fill="currentColor"/>
      </svg>
    </span>
  ), title: 'Tachado' },
  { sep: true },
  { cmd: 'insertUnorderedList', icon: (
    <span className="toolbarIcon">
      <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 1H1V3H3V1Z" fill="currentColor"/>
        <path d="M3 5H1V7H3V5Z" fill="currentColor"/>
        <path d="M1 9H3V11H1V9Z" fill="currentColor"/>
        <path d="M3 13H1V15H3V13Z" fill="currentColor"/>
        <path d="M15 1H5V3H15V1Z" fill="currentColor"/>
        <path d="M15 5H5V7H15V5Z" fill="currentColor"/>
        <path d="M5 9H15V11H5V9Z" fill="currentColor"/>
        <path d="M15 13H5V15H15V13Z" fill="currentColor"/>
      </svg>
    </span>
  ), title: 'Lista' },
  { cmd: 'insertOrderedList', icon: (
    <span className="toolbarIcon">
      <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.99999 1H15V3H6.99999V1Z" fill="currentColor"/>
        <path d="M6.99999 5H15V7H6.99999V5Z" fill="currentColor"/>
        <path d="M15 9H6.99999V11H15V9Z" fill="currentColor"/>
        <path d="M6.99999 13H15V15H6.99999V13Z" fill="currentColor"/>
        <path d="M3.28854 10.75H0.999993V9H3.28854C4.30279 9 5.12499 9.82221 5.12499 10.8364C5.12499 11.3407 4.91763 11.8228 4.55155 12.1696L3.41116 13.25H4.99999V15H0.999993V13.1236L3.348 10.8992C3.36523 10.8829 3.37499 10.8602 3.37499 10.8364C3.37499 10.7887 3.33629 10.75 3.28854 10.75Z" fill="currentColor"/>
        <path d="M2.358 1.125L0.723297 1.6699L1.2767 3.3301L2.125 3.04733V7H3.875V1.125H2.358Z" fill="currentColor"/>
      </svg>
    </span>
  ), title: 'Lista numerada' },
  { sep: true },
  { cmd: 'justifyLeft', icon: (
    <span className="toolbarIcon">
      <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 1H1V3H11V1Z" fill="currentColor"/>
        <path d="M1 5H15V7H1V5Z" fill="currentColor"/>
        <path d="M11 9H1V11H11V9Z" fill="currentColor"/>
        <path d="M15 13H1V15H15V13Z" fill="currentColor"/>
      </svg>
    </span>
  ), title: 'Izquierda' },
  { cmd: 'justifyCenter', icon: (
    <span className="toolbarIcon">
      <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 1H3V3H13V1Z" fill="currentColor"/>
        <path d="M1 5H15V7H1V5Z" fill="currentColor"/>
        <path d="M13 9H3V11H13V9Z" fill="currentColor"/>
        <path d="M15 13H1V15H15V13Z" fill="currentColor"/>
      </svg>
    </span>
  ), title: 'Centro' },
  { cmd: 'justifyRight', icon: (
    <span className="toolbarIcon">
      <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 1H5V3H15V1Z" fill="currentColor"/>
        <path d="M1 5H15V7H1V5Z" fill="currentColor"/>
        <path d="M15 9H5V11H15V9Z" fill="currentColor"/>
        <path d="M15 13H1V15H15V13Z" fill="currentColor"/>
      </svg>
    </span>
  ), title: 'Derecha' },
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
  'Impact',
]

export function TextBlock({ block, onChange }) {
  const editorRef = useRef(null)
  const initialized = useRef(false)
  const [activeFormats, setActiveFormats] = useState(new Set())

  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = block.content || ''
      document.execCommand('styleWithCSS', false, true)
      document.execCommand('bold', false, false)
      setActiveFormats(new Set())
      initialized.current = true
    }
  }, [block])

  const updateActiveFormats = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return
    const newActiveFormats = new Set()
    TEXT_EDITOR_FORMATS.forEach((f) => {
      if (!f.sep && document.queryCommandState(f.cmd)) {
        newActiveFormats.add(f.cmd)
      }
    })
    setActiveFormats(newActiveFormats)
  }, [])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleSelectionChange = () => {
      if (document.activeElement === editor || editor?.contains?.(document.activeElement)) {
        updateActiveFormats()
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    editor.addEventListener('keyup', updateActiveFormats)
    editor.addEventListener('mouseup', updateActiveFormats)
    editor.addEventListener('click', updateActiveFormats)
    editor.addEventListener('focus', updateActiveFormats)

    const intervalId = setInterval(() => {
      if (document.activeElement === editor || editor?.contains?.(document.activeElement)) {
        updateActiveFormats()
      }
    }, 200)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      editor.removeEventListener('keyup', updateActiveFormats)
      editor.removeEventListener('mouseup', updateActiveFormats)
      editor.removeEventListener('click', updateActiveFormats)
      editor.removeEventListener('focus', updateActiveFormats)
      clearInterval(intervalId)
    }
  }, [updateActiveFormats])

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) onChange({ content: editorRef.current.innerHTML })
  }, [onChange])

  function executeRichTextCommand(cmd, value) {
    document.execCommand(cmd, false, value || null)
    editorRef.current?.focus()
    handleEditorInput()
    updateActiveFormats()
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
              className={`toolbarActionButton${activeFormats.has(f.cmd) ? ' active' : ''}`}
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

export function ImageBlock({ block, onChange }) {
  async function handleImageFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'images')
    onChange({ src: url })
  }

  return (
    <div className="blockContentArea">
      {block.src ? (
        <div className="imageContainer">
          <img src={block.src} alt="imagen" className="image" />
        </div>
      ) : (
        <label className="uploadDropZone">
          <span>Haz clic para subir una imagen</span>
          <input type="file" accept="image/*" onChange={handleImageFileChange} hidden />
        </label>
      )}
    </div>
  )
}

const ASPECT_OPTIONS = [
  { label: 'Cuadrado', value: 'square' },
  { label: 'Original', value: 'original' },
]

export function GalleryBlock({ block, onChange }) {
  const columns = block.columns || 3
  const gap = block.gap ?? 8
  const aspect = block.aspect || 'square'

  async function handleFiles(e) {
    const fileList = Array.from(e.target.files || [])
    if (fileList.length === 0) return
    const uploads = await Promise.all(fileList.map((f) => uploadFile(f, 'images')))
    onChange({ images: [...block.images, ...uploads] })
  }

  function removeImage(index) {
    onChange({ images: block.images.filter((_, i) => i !== index) })
  }

  const aspectRatio = aspect === 'square' ? '1' : 'auto'

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
          '--gallery-columns': columns,
          '--gallery-gap': `${gap}px`,
        }}
      >
        {block.images.map((src, i) => (
          <div key={i} className="galleryGridItem" style={{ '--item-aspect-ratio': aspectRatio }}>
            <img src={src} alt={`gallery-${i}`} />
            <button className="galleryItemRemoveButton" onClick={() => removeImage(i)} title="Eliminar">
              <svg width="12" height="12" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fill="currentColor" fillRule="evenodd"/>
              </svg>
            </button>
          </div>
        ))}
        <label className="galleryAddButton" style={{ '--item-aspect-ratio': aspectRatio }}>
          <span>+</span>
          <input type="file" accept="image/*" multiple onChange={handleFiles} hidden />
        </label>
      </div>
    </div>
  )
}

export function VideoBlock({ block, onChange }) {
  function isDirectVideoUrl(url) {
    if (!url || typeof url !== 'string') return false
    return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.includes('/uploads/')
  }

  async function handleVideoFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadFile(file, 'video')
      onChange({ url })
    } catch (err) {
      onChange({ url: '' })
    }
  }

  return (
    <div className="blockContentArea">
      {block.url && isDirectVideoUrl(block.url) ? (
        <div className="videoLocal">
          <video src={block.url} controls className="previewVideo" />
        </div>
      ) : (
        <label className="uploadDropZone">
          <span>Haz clic para subir un vídeo (mp4, webm...)</span>
          <input className="fileInput" type="file" accept="video/*" onChange={handleVideoFileChange} />
        </label>
      )}
    </div>
  )
}

export function AudioBlock({ block, onChange }) {
  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'audio')
    onChange({ audioSrc: url })
  }

  return (
    <div className="blockContentArea">
      {block.audioSrc ? (
        <AudioPlayer src={block.audioSrc} inEditor />
      ) : (
        <label className="uploadDropZone">
          <span>Haz clic para subir un audio</span>
          <input className="fileInput" type="file" accept="audio/*" onChange={handleFile} />
        </label>
      )}
    </div>
  )
}
