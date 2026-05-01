package com.example.echo.infrastructure.persistence.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.echo.core.entity.projectcomments.model.ProjectComment;
import com.example.echo.core.entity.projectcomments.persistence.ProjectCommentRepository;
import java.util.List;

@Repository
public interface JpaProjectCommentRepository extends JpaRepository<ProjectComment, Long>, ProjectCommentRepository {
    long countByProjectId(Integer projectId);

    List<ProjectComment> findByProjectIdOrderByCreatedAtDesc(Integer projectId);
}
