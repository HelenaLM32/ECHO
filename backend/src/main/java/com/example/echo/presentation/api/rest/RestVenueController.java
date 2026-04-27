package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.core.entity.venues.dto.VenueDTO;
import com.example.echo.core.entity.venues.persistence.VenueRepository;
import com.example.echo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/venues")
public class RestVenueController {

    @Autowired
    VenueRepository venueRepository;

    @Autowired
    UserRepository userRepository;

    // GET publico: listar locales de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VenueDTO>> getByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(venueRepository.findByManagerId(userId));
    }

    // GET publico: obtener un local por id
    @GetMapping("/{id}")
    public ResponseEntity<VenueDTO> getById(@PathVariable Integer id) {
        return venueRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST autenticado: crear local
    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody VenueDTO venue,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Integer userId = getUserIdFromToken(authHeader);
            venue.setManagerId(userId);
            venue.setStatus("ACTIVE");
            return ResponseEntity.ok(venueRepository.save(venue));
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // DELETE autenticado: eliminar local propio
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Integer userId = getUserIdFromToken(authHeader);
            VenueDTO venue = venueRepository.findById(id)
                    .orElseThrow(() -> new ServiceException("Local no encontrado"));

            if (!venue.getManagerId().equals(userId)) {
                return ResponseEntity.status(403).body("No autorizado");
            }

            venueRepository.deleteById(id);
            return ResponseEntity.ok("{\"message\":\"Local eliminado\"}");
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