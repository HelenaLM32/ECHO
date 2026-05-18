package com.example.echo.core.entity.events.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.Formula;

@Entity
@Table(name = "events")
public class EventDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer id;

    @Column(name = "venue_id", nullable = false)
    @JsonProperty("venueId")
    private Integer venueId;

    @Column(name = "creator_id", nullable = false)
    @JsonProperty("creatorId")
    private Integer creatorId;

    @Column(name = "start_date", nullable = false)
    @JsonProperty("startDate")
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    @JsonProperty("endDate")
    private LocalDateTime endDate;

    @Column(length = 150)
    @JsonProperty("title")
    private String title;

    @Column(columnDefinition = "TEXT")
    @JsonProperty("description")
    private String description;

    @Column(name = "img", length = 500)
    @JsonProperty("img")
    private String img;

    @Column(name = "precio", precision = 10, scale = 2)
    @JsonProperty("precio")
    private BigDecimal precio;

    @Column(name = "categoria", length = 100)
    @JsonProperty("categoria")
    private String categoria;

    @Column(name = "link_entradas", length = 500)
    @JsonProperty("linkEntradas")
    private String linkEntradas;

    @Formula("(SELECT p.avatar_url FROM profiles p WHERE p.user_id = creator_id LIMIT 1)")
    @JsonProperty("creatorAvatarUrl")
    private String creatorAvatarUrl;

    @Formula("(SELECT p.public_name FROM profiles p WHERE p.user_id = creator_id LIMIT 1)")
    @JsonProperty("creatorPublicName")
    private String creatorPublicName;

    @Formula("(SELECT v.name FROM venues v WHERE v.id = venue_id LIMIT 1)")
    @JsonProperty("venueName")
    private String venueName;

    @Formula("(SELECT v.address FROM venues v WHERE v.id = venue_id LIMIT 1)")
    @JsonProperty("venueAddress")
    private String venueAddress;

    public EventDTO() {
    }

    public EventDTO(Integer id, Integer venueId, Integer creatorId,
            LocalDateTime startDate, LocalDateTime endDate,
            String title, String description, String img,
            BigDecimal precio, String categoria, String linkEntradas) {
        this.id = id;
        this.venueId = venueId;
        this.creatorId = creatorId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.title = title;
        this.description = description;
        this.img = img;
        this.precio = precio;
        this.categoria = categoria;
        this.linkEntradas = linkEntradas;
    }

    public Integer getId() {
        return id;
    }

    public Integer getVenueId() {
        return venueId;
    }

    public Integer getCreatorId() {
        return creatorId;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getImg() {
        return img;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getLinkEntradas() {
        return linkEntradas;
    }

    public String getCreatorAvatarUrl() {
        return creatorAvatarUrl;
    }

    public String getCreatorPublicName() {
        return creatorPublicName;
    }

    public String getVenueName() {
        return venueName;
    }

    public String getVenueAddress() {
        return venueAddress;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setVenueId(Integer venueId) {
        this.venueId = venueId;
    }

    public void setCreatorId(Integer creatorId) {
        this.creatorId = creatorId;
    }

    public void setStartDate(LocalDateTime v) {
        this.startDate = v;
    }

    public void setEndDate(LocalDateTime v) {
        this.endDate = v;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String desc) {
        this.description = desc;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public void setLinkEntradas(String link) {
        this.linkEntradas = link;
    }
}