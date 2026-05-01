package com.example.echo.core.entity.projectlikes.model;

import jakarta.persistence.*;

@Entity
@Table(name = "project_likes")
@IdClass(ProjectLikeId.class)
public class ProjectLike {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Id
    @Column(name = "project_id")
    private Integer projectId;

    public ProjectLike() {
    }

    public ProjectLike(Integer userId, Integer projectId) {
        this.userId = userId;
        this.projectId = projectId;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }
}
