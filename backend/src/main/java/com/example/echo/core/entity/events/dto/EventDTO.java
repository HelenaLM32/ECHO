package com.example.echo.core.entity.events.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

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

    @Column(length = 50)
    @JsonProperty("status")
    private String status;

    @Column(length = 150)
    @JsonProperty("title")
    private String title;

    @Column(columnDefinition = "TEXT")
    @JsonProperty("description")
    private String description;

    @Column(name = "img", length = 500)
    @JsonProperty("img")
    private String img;

    public EventDTO() {
    }

    public EventDTO(Integer id, Integer venueId, Integer creatorId,
            LocalDateTime startDate, LocalDateTime endDate,
            String status, String title, String description, String img) {
        this.id = id;
        this.venueId = venueId;
        this.creatorId = creatorId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.title = title;
        this.description = description;
        this.img = img;
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

    public String getStatus() {
        return status;
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

    public void setId(Integer id) {
        this.id = id;
    }

    public void setVenueId(Integer venueId) {
        this.venueId = venueId;
    }

    public void setCreatorId(Integer creatorId) {
        this.creatorId = creatorId;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public void setStatus(String status) {
        this.status = status;
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
}