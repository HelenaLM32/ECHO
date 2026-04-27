package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.events.dto.EventDTO;
import com.example.echo.core.entity.events.persistence.EventRepository;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.core.entity.venues.persistence.VenueRepository;
import com.example.echo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/events")
public class RestEventController {

    @Autowired
    EventRepository eventRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    VenueRepository venueRepository;

    // GET publico: listar eventos de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventDTO>> getByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(eventRepository.findByCreatorId(userId));
    }

    // GET publico: listar eventos de un local
    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<EventDTO>> getByVenue(@PathVariable Integer venueId) {
        return ResponseEntity.ok(eventRepository.findByVenueId(venueId));
    }

    // GET publico: obtener evento por id
    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getById(@PathVariable Integer id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST autenticado: crear evento
    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody EventDTO event,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Integer userId = getUserIdFromToken(authHeader);

            // Validar que el venue existe
            if (!venueRepository.existsById(event.getVenueId())) {
                return ResponseEntity.badRequest().body("El local indicado no existe");
            }

            event.setCreatorId(userId);
            event.setStatus("REQUESTED");
            return ResponseEntity.ok(eventRepository.save(event));
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // DELETE autenticado: eliminar evento (solo el creador)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Integer userId = getUserIdFromToken(authHeader);
            EventDTO event = eventRepository.findById(id)
                    .orElseThrow(() -> new ServiceException("Evento no encontrado"));

            if (!event.getCreatorId().equals(userId)) {
                return ResponseEntity.status(403).body("No autorizado");
            }

            eventRepository.deleteById(id);

            return ResponseEntity.ok("{\"message\":\"Evento eliminado\"}");
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    private Integer getUserIdFromToken(String authHeader) throws ServiceException {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ServiceException("No autorizado");
        }

        String token = authHeader.replace("Bearer ", "");
        if (!JwtUtil.validateToken(token)) {
            throw new ServiceException("Token invalido");
        }

        String email = JwtUtil.extractEmail(token);
        UserDTO user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado"));

        return user.getId();
    }
}