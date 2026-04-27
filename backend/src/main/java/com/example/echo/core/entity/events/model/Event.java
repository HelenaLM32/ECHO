package com.example.echo.core.entity.events.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import java.time.LocalDateTime;

public class Event {

    private Integer id;
    private Integer venueId;
    private Integer creatorId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private String title;
    private String description;
    private String img;

    protected Event() {
    }

    public static Event getInstance(Integer venueId, Integer creatorId,
            LocalDateTime startDate, LocalDateTime endDate,
            String title) throws BuildException {
        Event e = new Event();
        StringBuilder msg = new StringBuilder();

        if (venueId == null || !Check.isPositive(venueId))
            msg.append("venueId inválido; ");
        else
            e.venueId = venueId;

        if (creatorId == null || !Check.isPositive(creatorId))
            msg.append("creatorId inválido; ");
        else
            e.creatorId = creatorId;

        if (startDate == null)
            msg.append("startDate requerida; ");
        else
            e.startDate = startDate;

        if (endDate == null || (startDate != null && !endDate.isAfter(startDate)))
            msg.append("endDate debe ser posterior a startDate; ");
        else
            e.endDate = endDate;

        if (title != null && !Check.maxStringChars(title, 150))
            msg.append("title demasiado largo; ");
        else
            e.title = title;

        if (!msg.isEmpty())
            throw new BuildException(msg.toString().trim());
        return e;
    }

    // Getters
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

    // Setters
    public void setStatus(String status) {
        this.status = status;
    }

    public void setDescription(String desc) {
        this.description = desc;
    }

    public void setImg(String img) {
        this.img = img;
    }
}