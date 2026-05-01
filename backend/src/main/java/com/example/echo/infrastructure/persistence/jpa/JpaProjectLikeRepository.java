package com.example.echo.infrastructure.persistence.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.echo.core.entity.projectlikes.model.ProjectLike;
import com.example.echo.core.entity.projectlikes.model.ProjectLikeId;
import com.example.echo.core.entity.projectlikes.persistence.ProjectLikeRepository;

@Repository
public interface JpaProjectLikeRepository extends JpaRepository<ProjectLike, ProjectLikeId>, ProjectLikeRepository {
    boolean existsByUserIdAndProjectId(Integer userId, Integer projectId);

    void deleteByUserIdAndProjectId(Integer userId, Integer projectId);
}
