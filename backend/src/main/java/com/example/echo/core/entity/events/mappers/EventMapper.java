package com.example.echo.core.entity.events.mappers;

import com.example.echo.core.entity.events.dto.EventDTO;
import com.example.echo.core.entity.events.model.Event;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class EventMapper {

    public static Event eventFromDTO(EventDTO dto) throws BuildException {
        if (dto == null)
            return null;
        Event e = Event.getInstance(dto.getVenueId(), dto.getCreatorId(),
                dto.getStartDate(), dto.getEndDate(), dto.getTitle());
        e.setDescription(dto.getDescription());
        e.setImg(dto.getImg());
        e.setPrecio(dto.getPrecio());
        e.setCategoria(dto.getCategoria());
        e.setLinkEntradas(dto.getLinkEntradas());
        return e;
    }

    public static EventDTO dtoFromEvent(Event e) {
        if (e == null)
            return null;
        return new EventDTO(e.getId(), e.getVenueId(), e.getCreatorId(),
                e.getStartDate(), e.getEndDate(),
                e.getTitle(), e.getDescription(), e.getImg(),
                e.getPrecio(), e.getCategoria(), e.getLinkEntradas());
    }
}