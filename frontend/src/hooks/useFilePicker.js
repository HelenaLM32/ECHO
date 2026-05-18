import { useCallback } from 'react'
import { uploadFile } from '../services/uploads'

// Hook que crea inputs ocultos para seleccionar archivos (img, video, audio)
// Sube los archivos al servidor y devuelve las urls
// Recibe: funcion para añadir el bloque al proyecto
// Devuelve: funciones pickImage, pickVideo, pickGallery, pickAudio
export const useFilePicker = (addBlockWithData) => {
  const pickImage = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async () => {
      const files = Array.from(input.files || [])
      for (const file of files) {
        try {
          const url = await uploadFile(file, 'images')
          addBlockWithData('IMAGE', { src: url })
        } catch (e) {
          console.error('Error uploading image:', e)
          addBlockWithData('IMAGE', { src: '' })
        }
      }
    }
    input.click()
  }, [addBlockWithData])

  const pickVideo = useCallback(() => {
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
        console.error('Error uploading video:', e)
        addBlockWithData('VIDEO', { url: '' })
      }
    }
    input.click()
  }, [addBlockWithData])

  const pickGallery = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async () => {
      const files = Array.from(input.files || [])
      if (files.length === 0) return
      const uploads = []
      for (const file of files) {
        try {
          const url = await uploadFile(file, 'images')
          uploads.push(url)
        } catch (e) {
          console.error('Error uploading gallery image:', e)
        }
      }
      addBlockWithData('GALLERY', { images: uploads })
    }
    input.click()
  }, [addBlockWithData])

  const pickAudio = useCallback(() => {
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
        console.error('Error uploading audio:', e)
        addBlockWithData('AUDIO', { audioSrc: '' })
      }
    }
    input.click()
  }, [addBlockWithData])

  return {
    pickImage,
    pickVideo,
    pickGallery,
    pickAudio,
  }
}

export default useFilePicker
