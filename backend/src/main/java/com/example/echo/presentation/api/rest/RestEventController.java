package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.events.appservices.EventService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/events")
public class RestEventController {

    @Autowired
    private EventService eventService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping(value = "/user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getByUser(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(eventService.getByCreatorIdToJson(userId));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/venue/{venueId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getByVenue(@PathVariable Integer venueId) {
        try {
            return ResponseEntity.ok(eventService.getByVenueIdToJson(venueId));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(eventService.getByIdToJson(id));
        } catch (ServiceException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> create(
            @RequestParam("venueId") Integer venueId,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "img", required = false) MultipartFile img,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Integer userId = getUserIdFromToken(authHeader);
            return ResponseEntity.ok(eventService.createEvent(
                    userId, venueId,
                    LocalDateTime.parse(startDate),
                    LocalDateTime.parse(endDate),
                    title, description, img));
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Integer userId = getUserIdFromToken(authHeader);
            eventService.deleteById(id, userId);
            return ResponseEntity.ok("{\"message\":\"Evento eliminado\"}");
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    private Integer getUserIdFromToken(String authHeader) throws ServiceException {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new ServiceException("No autorizado");
        String token = authHeader.replace("Bearer ", "");
        if (!JwtUtil.validateToken(token))
            throw new ServiceException("Token inválido");
        String email = JwtUtil.extractEmail(token);
        UserDTO user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado"));
        return user.getId();
    }
}