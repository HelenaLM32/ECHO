import { create } from 'zustand'

export const BLOCK_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  GALLERY: 'GALLERY',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
}

let blockIdCounter = 0

export function createBlock(type) {
  const base = { id: ++blockIdCounter, type }
  switch (type) {
    case BLOCK_TYPES.TEXT: return { ...base, content: '' }
    case BLOCK_TYPES.IMAGE: return { ...base, src: '', caption: '' }
    case BLOCK_TYPES.GALLERY: return { ...base, images: [], columns: 3, gap: 8, aspect: 'square' }
    case BLOCK_TYPES.VIDEO: return { ...base, url: '' }
    case BLOCK_TYPES.AUDIO: return { ...base, audioSrc: '' }
    default: return base
  }
}

export const BLOCK_META = {
  [BLOCK_TYPES.TEXT]: { label: 'Texto', icon: 'text.svg' },
  [BLOCK_TYPES.IMAGE]: { label: 'Imagen', icon: 'imagene.svg' },
  [BLOCK_TYPES.GALLERY]: { label: 'Galería', icon: 'galeria.svg' },
  [BLOCK_TYPES.VIDEO]: { label: 'Vídeo', icon: 'video.svg' },
  [BLOCK_TYPES.AUDIO]: { label: 'Audio', icon: 'audio.svg' },
}

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

export function parseJsonSafe(value) {
  try {
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch {
    return null
  }
}

const STORAGE_KEY = 'echo-project-draft'

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
  }
}

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

  // duplicateBlock removed per request

  reorderBlocks: (newBlocks) => set({ blocks: newBlocks }),

  setBackground: (mode, value) => set({ background: { mode, value } }),

  setBlockGap: (gap) => set({ blockGap: gap }),

  saveDraft: () => {
    const { blocks, background, blockGap } = get()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ blocks, background, blockGap }))
  },

  exportJSON: () => {
    const { blocks, background, blockGap } = get()
    return { blocks, background, blockGap }
  },

  reset: () => {
    localStorage.removeItem(STORAGE_KEY)
    set(defaultState())
  },
}))

export default useProjectStore
