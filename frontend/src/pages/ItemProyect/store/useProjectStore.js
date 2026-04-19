import { create } from 'zustand'

/* ── Block types & metadata ─────────────────── */
export const BLOCK_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  GALLERY: 'GALLERY',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  EMBED: 'EMBED',
}

export function createBlock(type) {
  const base = { id: crypto.randomUUID(), type }
  switch (type) {
    case BLOCK_TYPES.TEXT:    return { ...base, content: '' }
    case BLOCK_TYPES.IMAGE:   return { ...base, src: '', caption: '', audio: '' }
    case BLOCK_TYPES.GALLERY: return { ...base, images: [], columns: 3, gap: 8, aspect: 'square' }
    case BLOCK_TYPES.VIDEO:   return { ...base, url: '' }
    case BLOCK_TYPES.AUDIO:   return { ...base, audioSrc: '' }
    case BLOCK_TYPES.EMBED:   return { ...base, html: '' }
    default: return base
  }
}

export const BLOCK_META = {
  [BLOCK_TYPES.TEXT]:    { label: 'Texto',   icon: 'Aa' },
  [BLOCK_TYPES.IMAGE]:   { label: 'Imagen',  icon: '▣' },
  [BLOCK_TYPES.GALLERY]: { label: 'Galería', icon: '▦' },
  [BLOCK_TYPES.VIDEO]:   { label: 'Vídeo',   icon: '▶' },
  [BLOCK_TYPES.AUDIO]:   { label: 'Audio',   icon: '♪' },
  [BLOCK_TYPES.EMBED]:   { label: 'Embed',   icon: '</>' },
}

/* ── Utilities ──────────────────────────────── */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function reorder(list, fromIndex, toIndex) {
  const result = Array.from(list)
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

export function toEmbedUrl(raw) {
  try {
    const url = new URL(raw)
    if (url.hostname.includes('youtube.com') && url.searchParams.get('v'))
      return `https://www.youtube.com/embed/${url.searchParams.get('v')}`
    if (url.hostname === 'youtu.be')
      return `https://www.youtube.com/embed${url.pathname}`
    if (url.hostname.includes('vimeo.com')) {
      const id = url.pathname.replace('/', '')
      return `https://player.vimeo.com/video/${id}`
    }
  } catch { /* no-op */ }
  return raw
}

/* ── Store ──────────────────────────────────── */
const STORAGE_KEY = 'behance-project-draft'

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function defaultState() {
  return {
    blocks: [],
    // background: { mode: 'color' | 'gradient' | 'image', value: string }
    background: { mode: 'color', value: '#ffffff' },
    blockGap: 0,
    blockBorderRadius: 18, // new: border radius for images/videos
  }
}

/**
 * Store global del proyecto con Zustand.
 * Gestiona wizard, portada, info, bloques y persistencia.
 */
const useProjectStore = create((set, get) => ({
  ...defaultState(),
  ...(loadDraft() || {}),

  addBlock: (type) => {
    set((s) => ({ blocks: [...s.blocks, createBlock(type)] }))
  },

  addBlockWithData: (type, data) => {
    set((s) => ({ blocks: [...s.blocks, { ...createBlock(type), ...data }] }))
  },

  updateBlock: (id, patch) => {
    set((s) => ({
      blocks: s.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }))
  },

  removeBlock: (id) => {
    set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) }))
  },

  duplicateBlock: (id) => {
    set((s) => {
      const idx = s.blocks.findIndex((b) => b.id === id)
      if (idx === -1) return s
      const clone = { ...s.blocks[idx], id: crypto.randomUUID() }
      const next = [...s.blocks]
      next.splice(idx + 1, 0, clone)
      return { blocks: next }
    })
  },

  reorderBlocks: (newBlocks) => set({ blocks: newBlocks }),

  setBackground: (mode, value) => set({ background: { mode, value } }),

  setBlockGap: (gap) => set({ blockGap: gap }),

  setBlockBorderRadius: (radius) => set({ blockBorderRadius: radius }),

  saveDraft: () => {
    const { blocks, background, blockGap, blockBorderRadius } = get()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ blocks, background, blockGap, blockBorderRadius }))
  },

  exportJSON: () => {
    const { blocks, background, blockGap, blockBorderRadius } = get()
    return { blocks, background, blockGap, blockBorderRadius }
  },

  reset: () => {
    localStorage.removeItem(STORAGE_KEY)
    set(defaultState())
  },
}))

export default useProjectStore
