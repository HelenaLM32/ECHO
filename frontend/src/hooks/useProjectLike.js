import { useState, useEffect } from 'react'
import { checkUserLiked } from '../services/projects'
import { useAuth } from '../context/AuthContext'

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
