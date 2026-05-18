import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './ProjectEditor.css'
import Editor from '../../components/ItemProject/Project/Editor'
import useProjectStore from '../../store/useProjectStore'
import { getProjectById } from '../../services/projects'
import ProjectSidebar from '../../components/ItemProject/ProjectSidebar/ProjectSidebar'
import PreviewDialog from '../../components/ItemProject/PreviewDialog/PreviewDialog'

function ProjectEdit() {
  const { id } = useParams()
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const project = await getProjectById(id)
        if (project) {
          const blocks = typeof project.blocks === 'string' ? JSON.parse(project.blocks) : project.blocks
          const background = typeof project.background === 'string' ? JSON.parse(project.background) : project.background
          
          useProjectStore.setState({
            blocks: blocks || [],
            background: background || { mode: 'color', value: '#ffffff' },
            blockGap: project.blockGap || 0,
          })
        }
        setLoading(false)
      } catch (err) {
        console.error('Error cargando proyecto:', err)
        setError('Error al cargar el proyecto: ' + (err.message || 'Error desconocido'))
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  if (loading) {
    return (
      <div className="layoutPage">
        <main className="editorArea">
          <p>Cargando proyecto...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="layoutPage">
        <main className="editorArea">
          <p>{error}</p>
        </main>
      </div>
    )
  }

  return (
    <>
      <div className="layoutPage">
        <main className="editorArea">
          <Editor />
        </main>
        <aside className="sidebarPanel">
          <ProjectSidebar onPreview={() => setShowPreview(true)} mode="edit" />
        </aside>
      </div>
      {showPreview && <PreviewDialog onClose={() => setShowPreview(false)} />}
    </>
  )
}

export default ProjectEdit
