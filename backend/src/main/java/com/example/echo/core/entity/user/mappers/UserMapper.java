package com.example.echo.core.entity.user.mappers;

import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.model.User;
import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.model.Role;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

import java.util.HashSet;
import java.util.Set;

public class UserMapper {

    public static User userFromDTO(UserDTO dto) throws BuildException {
        User user = User.getInstance(
                dto.getEmail(),
                dto.getUsername(),
                dto.getPassword(),
                dto.getIsActive());

        if (dto.getRoles() != null) {
            for (RoleDTO roleDTO : dto.getRoles()) {
                Role role = Role.getInstance(roleDTO.getName());
                user.getRoles().add(role);
            }
        }

        return user;
    }

    public static UserDTO dtoFromUser(User user) {
        UserDTO dto = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getPassword(),
                user.getIsActive(),
                null);

        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            Set<RoleDTO> rolesDTO = new HashSet<>();
            for (Role role : user.getRoles()) {
                rolesDTO.add(new RoleDTO(role.getId(), role.getName()));
            }
            dto.setRoles(rolesDTO);
        }

        return dto;
    }
}