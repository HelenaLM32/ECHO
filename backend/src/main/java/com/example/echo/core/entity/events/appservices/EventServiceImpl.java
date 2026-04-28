package com.example.echo.core.entity.events.appservices;

import com.example.echo.core.entity.events.dto.EventDTO;
import com.example.echo.core.entity.events.mappers.EventMapper;
import com.example.echo.core.entity.events.model.Event;
import com.example.echo.core.entity.events.persistence.EventRepository;
import com.example.echo.core.entity.sharedkernel.appservices.FileStorageService;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.venues.persistence.VenueRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

@Service
public class EventServiceImpl implements EventService {

    private static final DateTimeFormatter FLEXIBLE_DT = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd'T'HH:mm")
            .optionalStart().appendPattern(":ss").optionalEnd()
            .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
            .toFormatter();

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
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public String getAllToJson() throws ServiceException {
        try {
            return mapper.writeValueAsString(eventRepository.findAll());
        } catch (Exception e) {
            throw new ServiceException("Error al obtener eventos: " + e.getMessage());
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
            if (venueId == null || !venueRepository.existsById(venueId))
                throw new ServiceException("El local indicado no existe");

            Event event = Event.getInstance(venueId, creatorId, startDate, endDate, title);
            event.setStatus("REQUESTED");

            if (description != null && event.setDescription(description) != 0)
                throw new ServiceException("Descripción demasiado larga (máx. 5000 caracteres)");

            EventDTO dto = EventMapper.dtoFromEvent(event);

            if (img != null && !img.isEmpty())
                dto.setImg(fileStorageService.store(img, "events"));

            return mapper.writeValueAsString(eventRepository.save(dto));

        } catch (BuildException e) {
            throw new ServiceException("Datos inválidos: " + e.getMessage());
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error al crear evento: " + e.getMessage());
        }
    }

    @Override
    public String updateEvent(Integer id, Integer requesterId, String title,
            String description, String startDate, String endDate,
            MultipartFile img) throws ServiceException {
        try {
            EventDTO dto = eventRepository.findById(id)
                    .orElseThrow(() -> new ServiceException("Evento " + id + " no encontrado"));

            if (!dto.getCreatorId().equals(requesterId))
                throw new ServiceException("No autorizado para editar este evento");

            Event event = EventMapper.eventFromDTO(dto);

            StringBuilder errors = new StringBuilder();

            if (title != null && !title.isBlank()) {
                if (event.setTitle(title) != 0)
                    errors.append("title inválido (2-150 chars); ");
            }

            if (description != null) {
                if (event.setDescription(description) != 0)
                    errors.append("description demasiado larga; ");
            }

            if (startDate != null && !startDate.isBlank()) {
                try {
                    LocalDateTime parsedStart = LocalDateTime.parse(startDate.trim(), FLEXIBLE_DT);
                    if (event.setStartDate(parsedStart) != 0)
                        errors.append("startDate inválida; ");
                } catch (Exception ex) {
                    errors.append("formato startDate inválido; ");
                }
            }

            if (endDate != null && !endDate.isBlank()) {
                try {
                    LocalDateTime parsedEnd = LocalDateTime.parse(endDate.trim(), FLEXIBLE_DT);
                    if (event.setEndDate(parsedEnd) != 0)
                        errors.append("endDate debe ser posterior a startDate; ");
                } catch (Exception ex) {
                    errors.append("formato endDate inválido; ");
                }
            }

            if (!errors.isEmpty())
                throw new ServiceException("Datos inválidos: " + errors.toString().trim());

            dto.setTitle(event.getTitle());
            dto.setDescription(event.getDescription());
            dto.setStartDate(event.getStartDate());
            dto.setEndDate(event.getEndDate());

            if (img != null && !img.isEmpty())
                dto.setImg(fileStorageService.store(img, "events"));

            return mapper.writeValueAsString(eventRepository.save(dto));

        } catch (BuildException e) {
            throw new ServiceException("Datos inválidos: " + e.getMessage());
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error al actualizar evento: " + e.getMessage());
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