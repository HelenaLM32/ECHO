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

            if (images != null && !images.isEmpty()) {
            }

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
    public String updateVenue(Integer id, Integer managerId, String name, String address,
            Integer capacity, List<MultipartFile> images) throws ServiceException {
        try {
            // 1. Buscar el local existente
            VenueDTO dto = venueRepository.findById(id)
                    .orElseThrow(() -> new ServiceException("Local no encontrado"));

            // 2. Validar que quien edita es el dueño
            if (!dto.getManagerId().equals(managerId)) {
                throw new ServiceException("No autorizado para editar este local");
            }

            // 3. Actualizar solo los campos que no sean nulos
            if (name != null)
                dto.setName(name);
            if (address != null)
                dto.setAddress(address);
            if (capacity != null)
                dto.setCapacity(capacity);

            // 4. Actualizar imágenes si se envían nuevas
            if (images != null && !images.isEmpty()) {
                List<MultipartFile> validImages = images.stream()
                        .filter(f -> f != null && !f.isEmpty())
                        .toList();

                if (validImages.size() >= 1)
                    dto.setImg1(fileStorageService.store(validImages.get(0), "venues"));
                if (validImages.size() >= 2)
                    dto.setImg2(fileStorageService.store(validImages.get(1), "venues"));
                if (validImages.size() >= 3)
                    dto.setImg3(fileStorageService.store(validImages.get(2), "venues"));
            }

            // 5. Guardar y retornar
            VenueDTO saved = venueRepository.save(dto);
            return mapper.writeValueAsString(saved);

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