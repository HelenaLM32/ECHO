package com.example.echo.core.entity.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Set;

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
