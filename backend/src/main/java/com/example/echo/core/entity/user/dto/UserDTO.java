package com.example.echo.core.entity.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import jakarta.persistence.*;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "users")
public class UserDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    @JacksonXmlProperty(localName = "id")
    private Integer id;

    @Column(unique = true, nullable = false)
    @JsonProperty("email")
    @JacksonXmlProperty(localName = "email")
    private String email;

    @Column(nullable = false)
    @JsonProperty("username")
    @JacksonXmlProperty(localName = "username")
    private String username;

    @Column(nullable = false)
    @JsonProperty("password")
    @JacksonXmlProperty(localName = "password")
    private String password;

    @Column(name = "is_active")
    @JsonProperty("isActive")
    @JacksonXmlProperty(localName = "is_active")
    private Boolean isActive = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @JsonProperty("roles")
    private Set<com.example.echo.core.entity.role.dto.RoleDTO> roles = new HashSet<>();

    protected UserDTO() {
    }

    public UserDTO(Integer id, String email, String username, String password,
                   Boolean isActive, Set<com.example.echo.core.entity.role.dto.RoleDTO> roles) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.isActive = isActive;
        this.roles = roles != null ? roles : new HashSet<>();
    }

    public Integer getId() { return id; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public Boolean getIsActive() { return isActive; }
    public Set<com.example.echo.core.entity.role.dto.RoleDTO> getRoles() { return roles; }

    public void setId(Integer id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setRoles(Set<com.example.echo.core.entity.role.dto.RoleDTO> roles) { this.roles = roles; }

    @Override
    public String toString() {
        return "UserDTO{id=" + id + ", email='" + email + "', username='" + username +
                "', isActive=" + isActive + ", roles=" + roles + "}";
    }
}
