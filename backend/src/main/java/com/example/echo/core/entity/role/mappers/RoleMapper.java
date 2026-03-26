package com.example.echo.core.entity.role.mappers;

import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.model.Role;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class RoleMapper {

    public static Role roleFromDTO(RoleDTO dto) throws BuildException {
        if (dto == null) {
            return null;
        }

        Role role = Role.getInstance(dto.getName());

        if (dto.getId() != null) {
            try {
                var field = Role.class.getDeclaredField("id");
                field.setAccessible(true);
                field.set(role, dto.getId());
            } catch (Exception e) {
                throw new BuildException("Error setting role ID: " + e.getMessage());
            }
        }

        return role;
    }

    public static RoleDTO dtoFromRole(Role role) {
        if (role == null) {
            return null;
        }

        return new RoleDTO(
                role.getId(),
                role.getName()
        );
    }
}
