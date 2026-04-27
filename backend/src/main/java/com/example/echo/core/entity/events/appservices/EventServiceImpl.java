package com.example.echo.core.entity.events.appservices;

import com.example.echo.core.entity.events.dto.EventDTO;
import com.example.echo.core.entity.events.model.Event;
import com.example.echo.core.entity.events.mappers.EventMapper;
import com.example.echo.core.entity.events.persistence.EventRepository;
import com.example.echo.core.entity.sharedkernel.appservices.FileStorageService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.venues.persistence.VenueRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private VenueRepository venueRepository;
    @Autowired
    private FileStorageService fileStorageService;

    private final ObjectMapper mapper;

    public EventServiceImpl() {
        mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public String getAllToJson() throws ServiceException {
        try {
            return mapper.writeValueAsString(eventRepository.findAll());
        } catch (Exception e) {
            throw new ServiceException("Error: " + e.getMessage());
        }
    }

    @Override
    public String getByIdToJson(Integer id) throws ServiceException {
        EventDTO dto = eventRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Evento " + id + " no encontrado"));
        try {
            return mapper.writeValueAsString(dto);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage());
        }
    }

    @Override
    public String getByCreatorIdToJson(Integer creatorId) throws ServiceException {
        try {
            return mapper.writeValueAsString(eventRepository.findByCreatorId(creatorId));
        } catch (Exception e) {
            throw new ServiceException("Error: " + e.getMessage());
        }
    }

    @Override
    public String getByVenueIdToJson(Integer venueId) throws ServiceException {
        try {
            return mapper.writeValueAsString(eventRepository.findByVenueId(venueId));
        } catch (Exception e) {
            throw new ServiceException("Error: " + e.getMessage());
        }
    }

    @Override
    public String createEvent(Integer creatorId, Integer venueId, LocalDateTime startDate,
            LocalDateTime endDate, String title, String description,
            MultipartFile img) throws ServiceException {
        try {
            if (!venueRepository.existsById(venueId))
                throw new ServiceException("El local indicado no existe");

            Event event = Event.getInstance(venueId, creatorId, startDate, endDate, title);
            event.setStatus("REQUESTED");
            event.setDescription(description);

            EventDTO dto = EventMapper.dtoFromEvent(event);

            if (img != null && !img.isEmpty())
                dto.setImg(fileStorageService.store(img, "events"));

            EventDTO saved = eventRepository.save(dto);
            return mapper.writeValueAsString(saved);
        } catch (com.example.echo.core.entity.sharedkernel.exceptions.BuildException e) {
            throw new ServiceException("Datos inválidos: " + e.getMessage());
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error al crear evento: " + e.getMessage());
        }
    }

    @Override
    public void deleteById(Integer id, Integer requesterId) throws ServiceException {
        EventDTO dto = eventRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Evento no encontrado"));
        if (!dto.getCreatorId().equals(requesterId))
            throw new ServiceException("No autorizado");
        eventRepository.deleteById(id);
    }
}