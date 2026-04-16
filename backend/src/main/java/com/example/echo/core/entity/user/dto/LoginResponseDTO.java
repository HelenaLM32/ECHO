package com.example.echo.core.entity.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

import com.example.echo.core.entity.role.dto.RoleDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private Integer id;
    private String email;
    private String username;
    private List<String> roles;
    private Boolean isActive;

    public LoginResponseDTO(String token, UserDTO user) {
        this.token = token;
        this.id = user.getId();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.isActive = user.getIsActive();
        
        // Convert RoleDTO objects to role name strings
        this.roles = user.getRoles() != null
            ? user.getRoles().stream()
                .map(RoleDTO::getName)
                .collect(Collectors.toList())
            : new java.util.ArrayList<>();
    }
}
