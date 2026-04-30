package com.example.echo.core.entity.projectlikes.model;

import java.io.Serializable;

public class ProjectLikeId implements Serializable {
    private Integer userId;
    private Integer projectId;

    public ProjectLikeId() {
    }

    public ProjectLikeId(Integer userId, Integer projectId) {
        this.userId = userId;
        this.projectId = projectId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ProjectLikeId that = (ProjectLikeId) o;
        return java.util.Objects.equals(userId, that.userId) && java.util.Objects.equals(projectId, that.projectId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(userId, projectId);
    }

    // getters/setters required by some JPA providers
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }
}
