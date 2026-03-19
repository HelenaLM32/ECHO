package com.example.echo.core.entity.user.mappers;

import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.model.Role;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class RoleMapper {

    public static Role roleFromDTO(RoleDTO dto) throws BuildException {
        return Role.getInstance(dto.getName());
    }

    public static RoleDTO dtoFromRole(Role role) {
        return new RoleDTO(role.getId(), role.getName());
    }
}
