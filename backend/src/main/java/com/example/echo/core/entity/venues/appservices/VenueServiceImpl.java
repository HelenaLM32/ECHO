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

            VenueDTO dto = VenueMapper.dtoFromVenue(venue);

            if (images != null && !images.isEmpty()) {
                List<MultipartFile> valid = images.stream()
                        .filter(f -> f != null && !f.isEmpty())
                        .toList();

                if (valid.size() >= 1)
                    dto.setImg1(fileStorageService.store(valid.get(0), "venues"));
                if (valid.size() >= 2)
                    dto.setImg2(fileStorageService.store(valid.get(1), "venues"));
                if (valid.size() >= 3)
                    dto.setImg3(fileStorageService.store(valid.get(2), "venues"));
            }

            VenueDTO savedDto = venueRepository.save(dto);
            return mapper.writeValueAsString(savedDto);

        } catch (com.example.echo.core.entity.sharedkernel.exceptions.BuildException e) {
            throw new ServiceException("Datos inválidos: " + e.getMessage());
        } catch (Exception e) {
            throw new ServiceException("Error al crear local: " + e.getMessage());
        }
    }

    @Override
    public String updateVenue(Integer id, Integer managerId, String name, String address,
            Integer capacity, List<MultipartFile> images) throws ServiceException {
        try {
            VenueDTO dto = venueRepository.findById(id)
                    .orElseThrow(() -> new ServiceException("Local no encontrado"));

            if (!dto.getManagerId().equals(managerId))
                throw new ServiceException("No autorizado para editar este local");

            Venue venue = VenueMapper.venueFromDTO(dto);
            StringBuilder errors = new StringBuilder();

            if (name != null && !name.isBlank()) {
                if (venue.setName(name) != 0)
                    errors.append("name inválido; ");
            }
            if (address != null && !address.isBlank()) {
                if (venue.setAddress(address) != 0)
                    errors.append("address inválido; ");
            }
            if (capacity != null) {
                if (venue.setCapacity(capacity) != 0)
                    errors.append("capacity inválido; ");
            }

            if (!errors.isEmpty())
                throw new ServiceException("Datos inválidos: " + errors.toString().trim());

            dto.setName(venue.getName());
            dto.setAddress(venue.getAddress());
            dto.setCapacity(venue.getCapacity());

            if (images != null && !images.isEmpty()) {
                List<MultipartFile> valid = images.stream()
                        .filter(f -> f != null && !f.isEmpty())
                        .toList();
                if (valid.size() >= 1)
                    dto.setImg1(fileStorageService.store(valid.get(0), "venues"));
                if (valid.size() >= 2)
                    dto.setImg2(fileStorageService.store(valid.get(1), "venues"));
                if (valid.size() >= 3)
                    dto.setImg3(fileStorageService.store(valid.get(2), "venues"));
            }

            VenueDTO saved = venueRepository.save(dto);
            return mapper.writeValueAsString(saved);

        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error al actualizar local: " + e.getMessage());
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