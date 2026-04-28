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
        e.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVO");
        e.setDescription(dto.getDescription());
        e.setImg(dto.getImg());
        return e;
    }

    public static EventDTO dtoFromEvent(Event e) {
        if (e == null)
            return null;
        return new EventDTO(e.getId(), e.getVenueId(), e.getCreatorId(),
                e.getStartDate(), e.getEndDate(), e.getStatus(),
                e.getTitle(), e.getDescription(), e.getImg());
    }
}