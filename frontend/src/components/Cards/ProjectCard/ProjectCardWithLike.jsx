import React from 'react'
import ProjectCard from './ProjectCard'
import useProjectLike from '../../../hooks/useProjectLike'

function ProjectCardWithLike({ project, onOpen, small = false }) {
  const isLiked = useProjectLike(project.id)
  
  return <ProjectCard project={project} onOpen={onOpen} small={small} isLiked={isLiked} />
}

export default ProjectCardWithLike
