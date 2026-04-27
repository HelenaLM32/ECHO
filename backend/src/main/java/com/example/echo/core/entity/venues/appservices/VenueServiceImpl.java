package com.example.echo.core.entity.venues.appservices;

import com.example.echo.core.entity.sharedkernel.appservices.FileStorageService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.venues.dto.VenueDTO;
import com.example.echo.core.entity.venues.model.Venue;
import com.example.echo.core.entity.venues.mappers.VenueMapper;
import com.example.echo.core.entity.venues.persistence.VenueRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class VenueServiceImpl implements VenueService {

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private FileStorageService fileStorageService;

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String getAllToJson() throws ServiceException {
        try {
            return mapper.writeValueAsString(venueRepository.findAll());
        } catch (Exception e) {
            throw new ServiceException("Error al obtener locales: " + e.getMessage());
        }
    }

    @Override
    public String getByIdToJson(Integer id) throws ServiceException {
        VenueDTO dto = venueRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Local " + id + " no encontrado"));
        try {
            return mapper.writeValueAsString(dto);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage());
        }
    }

    @Override
    public String getByManagerIdToJson(Integer managerId) throws ServiceException {
        try {
            return mapper.writeValueAsString(venueRepository.findByManagerId(managerId));
        } catch (Exception e) {
            throw new ServiceException("Error al obtener locales del manager: " + e.getMessage());
        }
    }

    @Override
    public String createVenue(Integer managerId, String name, String address,
            Integer capacity, List<MultipartFile> images) throws ServiceException {
        try {
            Venue venue = Venue.getInstance(managerId, name, address, capacity);
            venue.setStatus("ACTIVE");

            VenueDTO dto = VenueMapper.dtoFromVenue(venue);

            VenueDTO saved = venueRepository.save(dto);
            return mapper.writeValueAsString(saved);
        } catch (com.example.echo.core.entity.sharedkernel.exceptions.BuildException e) {
            throw new ServiceException("Datos inválidos: " + e.getMessage());
        } catch (Exception e) {
            throw new ServiceException("Error al crear local: " + e.getMessage());
        }
    }

    @Override
    public void deleteById(Integer id, Integer requesterId) throws ServiceException {
        VenueDTO dto = venueRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Local no encontrado"));
        if (!dto.getManagerId().equals(requesterId))
            throw new ServiceException("No autorizado");
        venueRepository.deleteById(id);
    }
}