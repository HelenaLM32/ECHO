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

    @Column(nullable = false, length = 150)
    @JsonProperty("name")
    private String name;

    @Column(nullable = false, length = 255)
    @JsonProperty("address")
    private String address;

    @Column
    @JsonProperty("capacity")
    private Integer capacity;

    @Column(length = 50)
    @JsonProperty("status")
    private String status;

    @Column(name = "img1", length = 500)
    @JsonProperty("img1")
    private String img1;

    @Column(name = "img2", length = 500)
    @JsonProperty("img2")
    private String img2;

    @Column(name = "img3", length = 500)
    @JsonProperty("img3")
    private String img3;

    public VenueDTO() {
    }

    public VenueDTO(Integer id, Integer managerId, String name, String address,
            Integer capacity, String status, String img1, String img2, String img3) {
        this.id = id;
        this.managerId = managerId;
        this.name = name;
        this.address = address;
        this.capacity = capacity;
        this.status = status;
        this.img1 = img1;
        this.img2 = img2;
        this.img3 = img3;
    }

    public Integer getId() {
        return id;
    }

    public Integer getManagerId() {
        return managerId;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getStatus() {
        return status;
    }

    public String getImg1() {
        return img1;
    }

    public String getImg2() {
        return img2;
    }

    public String getImg3() {
        return img3;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setManagerId(Integer managerId) {
        this.managerId = managerId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setImg1(String img1) {
        this.img1 = img1;
    }

    public void setImg2(String img2) {
        this.img2 = img2;
    }

    public void setImg3(String img3) {
        this.img3 = img3;
    }
}