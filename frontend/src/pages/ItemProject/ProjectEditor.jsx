import { useState, useEffect } from 'react'
import './ProjectEditor.css'
import Editor from '../../components/ItemProject/Project/Editor'
import useProjectStore from '../../store/useProjectStore'
import { useAuth } from '../../context/AuthContext'
import ProjectSidebar from '../../components/ItemProject/ProjectSidebar/ProjectSidebar'
import PreviewDialog from '../../components/ItemProject/PreviewDialog/PreviewDialog'

function ProjectEditor() {
  const [showPreview, setShowPreview] = useState(false)
  const reset = useProjectStore((s) => s.reset)

  // Resetear el store al entrar para crear un proyecto nuevo
  useEffect(() => {
    reset()
  }, [reset])

  return (
    <>
      <div className="layoutPage">
        <main className="editorArea">
          <Editor />
        </main>
        <aside className="sidebarPanel">
          <ProjectSidebar onPreview={() => setShowPreview(true)} mode="create" />
        </aside>
      </div>
      {showPreview && <PreviewDialog onClose={() => setShowPreview(false)} />}
    </>
  )
}

export default ProjectEditor
