package com.example.echo.core.entity.venues.persistence;

import com.example.echo.core.entity.venues.dto.VenueDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VenueRepository extends JpaRepository<VenueDTO, Integer> {
    List<VenueDTO> findByManagerId(Integer managerId);
}
