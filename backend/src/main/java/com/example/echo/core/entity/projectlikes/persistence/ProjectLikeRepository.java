package com.example.echo.core.entity.projectlikes.persistence;

import com.example.echo.core.entity.projectlikes.model.ProjectLike;

public interface ProjectLikeRepository {
    boolean existsByUserIdAndProjectId(Integer userId, Integer projectId);

    ProjectLike save(ProjectLike like);

    void deleteByUserIdAndProjectId(Integer userId, Integer projectId);
}
