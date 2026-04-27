package com.example.echo.core.entity.venues.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "venues")
public class VenueDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer id;
    @Column(name = "manager_id", nullable = false)
    @JsonProperty("managerId")
    private Integer managerId;
    @Column(nullable = false)
    @JsonProperty("name")
    private String name;
    @Column(nullable = false)
    @JsonProperty("address")
    private String address;
    @Column
    @JsonProperty("capacity")
    private Integer capacity;
    @Column
    @JsonProperty("status")
    private String status;

    public VenueDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getManagerId() {
        return managerId;
    }

    public void setManagerId(Integer managerId) {
        this.managerId = managerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}