package com.example.echo.core.entity.events.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Event {

    private Integer id;
    private Integer venueId;
    private Integer creatorId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String title;
    private String description;
    private String img;
    private BigDecimal precio;
    private String categoria;
    private String linkEntradas;

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

        if (!Check.lengthBetween(title, 2, 150))
            msg.append("title inválido (2-150 caracteres); ");
        else
            e.title = title.trim();

        if (!msg.isEmpty())
            throw new BuildException(msg.toString().trim());
        return e;
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

    public int setTitle(String title) {
        if (Check.lengthBetween(title, 2, 150)) {
            this.title = title.trim();
            return 0;
        }
        return -1;
    }

    public int setDescription(String desc) {
        if (desc == null) {
            this.description = null;
            return 0;
        }
        if (Check.maxLength(desc, 5000)) {
            this.description = desc.trim();
            return 0;
        }
        return -1;
    }

    public int setImg(String img) {
        if (img == null) {
            this.img = null;
            return 0;
        }
        if (Check.maxLength(img, 500)) {
            this.img = img.trim();
            return 0;
        }
        return -1;
    }

    public int setStartDate(LocalDateTime startDate) {
        if (startDate == null)
            return -1;
        this.startDate = startDate;
        return 0;
    }

    public int setEndDate(LocalDateTime endDate) {
        if (endDate == null)
            return -1;
        if (this.startDate != null && !endDate.isAfter(this.startDate))
            return -1;
        this.endDate = endDate;
        return 0;
    }

    public int setPrecio(BigDecimal precio) {
        if (precio == null || precio.compareTo(BigDecimal.ZERO) >= 0) {
            this.precio = precio;
            return 0;
        }
        return -1;
    }

    public int setCategoria(String categoria) {
        if (categoria == null || Check.maxLength(categoria, 100)) {
            this.categoria = categoria;
            return 0;
        }
        return -1;
    }

    public int setLinkEntradas(String linkEntradas) {
        if (linkEntradas == null || Check.maxLength(linkEntradas, 500)) {
            this.linkEntradas = linkEntradas;
            return 0;
        }
        return -1;
    }
}