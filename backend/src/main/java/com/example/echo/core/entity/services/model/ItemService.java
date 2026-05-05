package com.example.echo.core.entity.services.model;

import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.items.dto.ItemProjectDTO;
import com.example.echo.core.entity.user.dto.UserDTO;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "item_services")
public class ItemService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "item_id", nullable = false)
    private ItemDTO item;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "delivery_duration", nullable = false)
    private Integer deliveryDuration;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false)
    private Double price;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private UserDTO creator;

    @ManyToMany
    @JoinTable(
        name = "item_service_projects",
        joinColumns = @JoinColumn(name = "service_id"),
        inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    private Set<ItemProjectDTO> projects;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ItemDTO getItem() {
        return item;
    }

    public void setItem(ItemDTO item) {
        this.item = item;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDeliveryDuration() {
        return deliveryDuration;
    }

    public void setDeliveryDuration(Integer deliveryDuration) {
        this.deliveryDuration = deliveryDuration;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public UserDTO getCreator() {
        return creator;
    }

    public void setCreator(UserDTO creator) {
        this.creator = creator;
    }

    public Set<ItemProjectDTO> getProjects() {
        return projects;
    }

    public void setProjects(Set<ItemProjectDTO> projects) {
        this.projects = projects;
    }
}