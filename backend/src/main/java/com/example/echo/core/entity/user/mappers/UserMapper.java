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
        Set<Role> roles = new HashSet<>();
        if (dto.getRoles() != null) {
            for (RoleDTO roleDTO : dto.getRoles()) {
                roles.add(RoleMapper.roleFromDTO(roleDTO));
            }
        }

        return User.getInstance(
                dto.getEmail(),
                dto.getUsername(),
                dto.getPassword(),
                dto.getIsActive(),
                roles);
    }

    public static UserDTO dtoFromUser(User user) {
        Set<RoleDTO> roleDTOs = new HashSet<>();
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                roleDTOs.add(RoleMapper.dtoFromRole(role));
            }
        }

        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getPassword(),
                user.getIsActive(),
                roleDTOs);
    }
}
