package com.example.echo.core.entity.projectcomments.persistence;

import com.example.echo.core.entity.projectcomments.model.ProjectComment;
import java.util.List;

public interface ProjectCommentRepository {
    ProjectComment save(ProjectComment comment);
    long countByProjectId(Integer projectId);
    List<ProjectComment> findByProjectIdOrderByCreatedAtDesc(Integer projectId);
}
