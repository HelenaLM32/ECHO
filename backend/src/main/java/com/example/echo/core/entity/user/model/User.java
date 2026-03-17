package com.example.echo.core.entity.user.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import com.example.echo.core.entity.role.model.Role;

import java.util.HashSet;
import java.util.Set;

public class User {

    private Integer id;
    private String email;
    private String username;
    private String password;
    private Boolean isActive = true;
    private Set<Role> roles = new HashSet<>();

    protected User() {
    }

    public static User getInstance(String email, String username, String password,
                                   Boolean isActive, Set<Role> roles) throws BuildException {
        User u = new User();
        String message = u.userDataValidation(email, username, password, isActive, roles);
        if (message.isEmpty()) {
            return u;
        }
        throw new BuildException(message);
    }

    protected String userDataValidation(String email, String username, String password,
                                        Boolean isActive, Set<Role> roles) {
        String message = "";

        if (setEmail(email) != 0) {
            message += "Email inválido; ";
        }
        if (setUsername(username) != 0) {
            message += "Username inválido; ";
        }
        if (setPassword(password) != 0) {
            message += "Password inválido; ";
        }
        this.isActive = (isActive == null) ? true : isActive;

        if (roles == null || roles.isEmpty()) {
            message += "Roles no pueden estar vacíos; ";
        } else {
            this.roles = roles;
        }

        return message.trim();
    }

    protected int setEmail(String email) {
        if (Check.isEmail(email)) {
            this.email = email.trim();
            return 0;
        }
        return -1;
    }

    protected int setUsername(String username) {
        if (Check.minStringChars(username, 3)) {
            this.username = username.trim();
            return 0;
        }
        return -1;
    }

    protected int setPassword(String password) {
        if (Check.minStringChars(password, 6)) {
            this.password = password.trim();
            return 0;
        }
        return -1;
    }

    public Integer getId() { return id; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public Boolean getIsActive() { return isActive; }
    public Set<Role> getRoles() { return roles; }

    @Override
    public String toString() {
        return "User{id=" + id + ", email='" + email + "', username='" + username +
                "', isActive=" + isActive + ", roles=" + roles + "}";
    }
}
