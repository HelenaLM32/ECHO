package com.example.echo.core.entity.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserLoginDTO {

    @JsonProperty("email")
    private String email;

    @JsonProperty("password")
    private String password;

    public UserLoginDTO() {
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
