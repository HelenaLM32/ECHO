package com.example.echo.core.entity.events.persistence;

import com.example.echo.core.entity.events.dto.EventDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<EventDTO, Integer> {
    List<EventDTO> findByCreatorId(Integer creatorId);

    List<EventDTO> findByVenueId(Integer venueId);
}
