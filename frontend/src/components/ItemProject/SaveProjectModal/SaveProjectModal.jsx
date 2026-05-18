import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createItem, createProject, updateProject, getCategories, getProjectById } from '../../../services/projects'
import useSuccessPopup from '../../../hooks/useSuccessPopup'
import PopupSuccess from '../../Modals/PopupSuccess/PopupSuccess'
import './SaveProjectModal.css'

function SaveProjectModal({ onClose, exportJSON, user, mode = 'create' }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const { successState, showSuccess, hideSuccess } = useSuccessPopup()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [loadingProject, setLoadingProject] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    getCategories()
      .then((list) => { if (mounted) setCategories(list || []) })
      .catch(() => { if (mounted) setCategories([]) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (mode === 'edit' && id) {
      const loadProject = async () => {
        try {
          const project = await getProjectById(id)
          if (project?.item) {
            setTitle(project.item.title || '')
            setDescription(project.item.description || '')
            setBasePrice(project.item.basePrice ? String(project.item.basePrice) : '')
            setCategoryId(project.item.categoryId ? String(project.item.categoryId) : '')
          }
        } catch (err) {
          console.error('Error cargando proyecto:', err)
        } finally {
          setLoadingProject(false)
        }
      }
      loadProject()
    }
  }, [mode, id])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title || title.trim().length < 3) {
      showSuccess('El título debe tener al menos 3 caracteres', 'Alto ahí!', 'warning')
      return
    }
    if (!categoryId) {
      showSuccess('Debes seleccionar una categoría', 'Alto ahí!', 'warning')
      return
    }
    
    let price = null
    if (basePrice && basePrice.trim() !== '') {
      const parsedPrice = Number(basePrice)
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        showSuccess('El precio debe ser un número válido mayor o igual a 0', 'Alto ahí!', 'warning')
        return
      }
      price = parsedPrice
    }

    setSaving(true)
    try {
      const data = exportJSON()
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      if (mode === 'create') {
        const itemPayload = {
          creatorId: user?.id,
          title: title.trim(),
          description: description ? description.trim() : null,
          basePrice: price,
          itemType: 'PROJECT',
          categoryId: Number(categoryId),
        }

        const createdItem = await createItem(itemPayload)
        const itemId = createdItem?.id || (typeof createdItem === 'number' ? createdItem : null)
        if (!itemId) throw new Error('Created item has no id')

        const projectPayload = {
          id: itemId,
          item: { id: itemId },
          blocks: JSON.stringify(data.blocks || []),
          background: JSON.stringify(data.background || {}),
          blockGap: data.blockGap || 0,
          published: false,
          slug,
        }

        const createdProject = await createProject(projectPayload)
        showSuccess('Proyecto guardado correctamente (id: ' + (createdProject.id || createdProject.item?.id) + ')', 'Éxito')
      } else {
        const numericId = Number(id)
        const projectPayload = {
          id: numericId,
          blocks: JSON.stringify(data.blocks || []),
          background: JSON.stringify(data.background || {}),
          blockGap: data.blockGap || 0,
          published: false,
          slug,
          item: {
            id: numericId,
            title: title.trim(),
            description: description ? description.trim() : null,
            basePrice: price,
            categoryId: Number(categoryId),
          }
        }

        await updateProject(id, projectPayload)
        showSuccess('Proyecto actualizado correctamente', 'Éxito')
      }
      
      onClose()
      try {
        if (user?.id) navigate(`/profile/${user.id}`)
      } catch (e) {
      }
    } catch (err) {
      showSuccess('Error al guardar: ' + (err.message || err), 'Error')
    } finally {
      setSaving(false)
    }
  }

  if (loadingProject) {
    return (
      <div className="modalOverlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="modalOverlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h3 className="modalTitle">
            {mode === 'create' ? 'Guardar proyecto' : 'Guardar cambios'}
          </h3>
          <form onSubmit={handleSubmit} className="modalForm">
            <label className="modalLabel">Título *</label>
            <input 
              className="modalInput" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ej: Mi increíble proyecto artístico"
              required 
            />

            <label className="modalLabel">Descripción</label>
            <textarea 
              className="modalTextarea" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Ej: Este proyecto muestra mi trabajo de ilustración digital..."
            />

            <label className="modalLabel">Precio base (opcional)</label>
            <input 
              className="modalInput" 
              type="number" 
              step="0.01" 
              min="0"
              value={basePrice} 
              onChange={(e) => setBasePrice(e.target.value)} 
              placeholder="Ej: 150.00"
            />

            <label className="modalLabel">Categoría *</label>
            <select 
              className="modalSelect" 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">-- Selecciona una categoría --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="modalButtons">
              <button type="button" onClick={onClose} disabled={saving} className="modalButton modalCancel">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="modalButton modalSave">
                {saving ? 'Guardando...' : (mode === 'create' ? 'Guardar' : 'Actualizar')}
              </button>
            </div>
          </form>
        </div>
      </div>
      <PopupSuccess
        isOpen={successState.isOpen}
        onClose={hideSuccess}
        message={successState.message}
        title={successState.title}
        variant={successState.variant}
      />
    </>
  )
}

export default SaveProjectModal
