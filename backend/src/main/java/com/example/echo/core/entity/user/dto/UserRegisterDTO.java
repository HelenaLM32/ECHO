package com.example.echo.core.entity.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Set;

// Input-only DTO for register endpoint (kept for compatibility).
// The main persistence DTO is UserDTO.
public class UserRegisterDTO {

    @JsonProperty("email")
    public String email;

    @JsonProperty("username")
    public String username;

    @JsonProperty("password")
    public String password;

    @JsonProperty("roles")
    public Set<String> roles;
}
