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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

@Service
@Transactional
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
            BigDecimal precio, String categoria, String linkEntradas,
            MultipartFile img) throws ServiceException {
        try {
            if (venueId == null || !venueRepository.existsById(venueId))
                throw new ServiceException("El local indicado no existe");

            Event event = Event.getInstance(venueId, creatorId, startDate, endDate, title);

            if (description != null && event.setDescription(description) != 0)
                throw new ServiceException("Descripción demasiado larga (máx. 5000 caracteres)");
            if (precio != null && event.setPrecio(precio) != 0)
                throw new ServiceException("Precio inválido");
            if (categoria != null && event.setCategoria(categoria) != 0)
                throw new ServiceException("Categoría inválida");
            if (linkEntradas != null && event.setLinkEntradas(linkEntradas) != 0)
                throw new ServiceException("Link de entradas inválido");

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
            BigDecimal precio, String categoria, String linkEntradas,
            MultipartFile img, boolean removeImg, boolean removePrice) throws ServiceException {
        try {
            EventDTO dto = eventRepository.findById(id)
                    .orElseThrow(() -> new ServiceException("Evento " + id + " no encontrado"));

            if (!dto.getCreatorId().equals(requesterId))
                throw new ServiceException("No autorizado para editar este evento");

            Event event = EventMapper.eventFromDTO(dto);
            StringBuilder errors = new StringBuilder();

            if (title != null && !title.isBlank())
                if (event.setTitle(title) != 0)
                    errors.append("title inválido; ");

            if (description != null) {
                String descToSet = description.trim().isEmpty() ? null : description;
                if (event.setDescription(descToSet) != 0)
                    errors.append("description demasiado larga; ");
            }

            if (startDate != null && !startDate.isBlank()) {
                try {
                    if (event.setStartDate(LocalDateTime.parse(startDate.trim(), FLEXIBLE_DT)) != 0)
                        errors.append("startDate inválida; ");
                } catch (Exception ex) {
                    errors.append("formato startDate inválido; ");
                }
            }
            if (endDate != null && !endDate.isBlank()) {
                try {
                    if (event.setEndDate(LocalDateTime.parse(endDate.trim(), FLEXIBLE_DT)) != 0)
                        errors.append("endDate debe ser posterior a startDate; ");
                } catch (Exception ex) {
                    errors.append("formato endDate inválido; ");
                }
            }

            if (removePrice) {
                event.setPrecio(null);
            } else if (precio != null) {
                if (event.setPrecio(precio) != 0)
                    errors.append("precio inválido; ");
            }

            if (categoria != null && event.setCategoria(categoria) != 0)
                errors.append("categoria inválida; ");
            if (linkEntradas != null && event.setLinkEntradas(linkEntradas) != 0)
                errors.append("linkEntradas inválido; ");

            if (!errors.isEmpty())
                throw new ServiceException("Datos inválidos: " + errors.toString().trim());

            dto.setTitle(event.getTitle());
            dto.setDescription(event.getDescription());
            dto.setStartDate(event.getStartDate());
            dto.setEndDate(event.getEndDate());
            dto.setPrecio(event.getPrecio());
            dto.setCategoria(event.getCategoria());
            dto.setLinkEntradas(event.getLinkEntradas());

            if (removeImg) {
                dto.setImg(null);
            } else if (img != null && !img.isEmpty()) {
                dto.setImg(fileStorageService.store(img, "events"));
            }

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
    public String updateEvent(Integer id, Integer requesterId, String title,
            String description, String startDate, String endDate,
            BigDecimal precio, String categoria, String linkEntradas,
            MultipartFile img) throws ServiceException {
        return updateEvent(id, requesterId, title, description, startDate, endDate,
                precio, categoria, linkEntradas, img, false, false);
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