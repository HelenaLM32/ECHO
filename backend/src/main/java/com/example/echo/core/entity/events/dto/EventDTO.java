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
    @Column
    @JsonProperty("status")
    private String status;
    @Column
    @JsonProperty("title")
    private String title;
    @Column(columnDefinition = "TEXT")
    @JsonProperty("description")
    private String description;

    public EventDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getVenueId() {
        return venueId;
    }

    public void setVenueId(Integer venueId) {
        this.venueId = venueId;
    }

    public Integer getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Integer creatorId) {
        this.creatorId = creatorId;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}