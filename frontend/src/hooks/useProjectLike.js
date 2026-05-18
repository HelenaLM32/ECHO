import { useState, useEffect } from 'react'
import { checkUserLiked } from '../services/projects'
import { useAuth } from '../context/AuthContext'

// Comprueba si el usuario actual ha dado like a un proyecto
// Recibe: id del proyecto
// Devuelve: true/false segun si dio like o no
export function useProjectLike(projectId) {
  const [isLiked, setIsLiked] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !projectId) {
      setIsLiked(false)
      return
    }

    checkUserLiked(projectId)
      .then((data) => setIsLiked(Boolean(data.liked)))
      .catch(() => setIsLiked(false))
  }, [projectId, user])

  return isLiked
}

export default useProjectLike
