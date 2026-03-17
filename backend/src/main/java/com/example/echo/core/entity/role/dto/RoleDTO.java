package com.example.echo.core.entity.role.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.example.echo.core.entity.user.dto.UserDTO;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
public class RoleDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    @JacksonXmlProperty(localName = "id")
    private Integer id;

    @Column(unique = true, nullable = false)
    @JsonProperty("name")
    @JacksonXmlProperty(localName = "name")
    private String name;

    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    private Set<UserDTO> users = new HashSet<>();

    protected RoleDTO() {
    }

    public RoleDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() { return id; }
    public String getName() { return name; }
    public Set<UserDTO> getUsers() { return users; }

    public void setId(Integer id) { this.id = id; }
    public void setName(String name) { this.name = name; }

    @Override
    public String toString() {
        return "RoleDTO{id=" + id + ", name='" + name + "'}";
    }
}
