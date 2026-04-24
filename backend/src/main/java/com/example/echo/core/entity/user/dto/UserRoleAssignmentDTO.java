package com.example.echo.core.entity.user.dto;

public class UserRoleAssignmentDTO {

    private Integer userId;
    private String roleName;

    public UserRoleAssignmentDTO() {
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
