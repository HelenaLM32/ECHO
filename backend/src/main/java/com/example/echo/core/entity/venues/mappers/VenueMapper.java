package com.example.echo.core.entity.venues.mappers;

import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import com.example.echo.core.entity.venues.dto.VenueDTO;
import com.example.echo.core.entity.venues.model.Venue;

public class VenueMapper {

    public static Venue venueFromDTO(VenueDTO dto) throws BuildException {
        if (dto == null)
            return null;
        Venue v = Venue.getInstance(dto.getManagerId(), dto.getName(), dto.getAddress(), dto.getCapacity());
        v.setImg1(dto.getImg1());
        v.setImg2(dto.getImg2());
        v.setImg3(dto.getImg3());
        return v;
    }

    public static VenueDTO dtoFromVenue(Venue v) {
        if (v == null)
            return null;
        return new VenueDTO(v.getId(), v.getManagerId(), v.getName(), v.getAddress(),
                v.getCapacity(), v.getImg1(), v.getImg2(), v.getImg3());
    }
}