package com.example.echo.presentation.rest;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.venues.appservices.VenueService;
import com.example.echo.security.AuthenticatedUserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/venues")
public class VenueController {

    private final VenueService venueService;
    private final AuthenticatedUserService authenticatedUserService;

    public VenueController(VenueService venueService, AuthenticatedUserService authenticatedUserService) {
        this.venueService = venueService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAll() {
        try {
            return ResponseEntity.ok(venueService.getAllToJson());
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getByUser(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(venueService.getByManagerIdToJson(userId));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(venueService.getByIdToJson(id));
        } catch (ServiceException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> create(
            @RequestParam("name") String name,
            @RequestParam("address") String address,
            @RequestParam(value = "capacity", required = false) Integer capacity,
            @RequestParam(value = "telefono", required = false) String telefono,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "sitioWeb", required = false) String sitioWeb,
            @RequestParam(value = "horario", required = false) String horario,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        try {
            Integer userId = authenticatedUserService.getRequiredUserId();
            return ResponseEntity.ok(venueService.createVenue(
                    userId, name, address, capacity, telefono, email, sitioWeb, horario, images));
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> update(
            @PathVariable Integer id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "capacity", required = false) Integer capacity,
            @RequestParam(value = "telefono", required = false) String telefono,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "sitioWeb", required = false) String sitioWeb,
            @RequestParam(value = "horario", required = false) String horario,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        try {
            Integer userId = authenticatedUserService.getRequiredUserId();
            return ResponseEntity.ok(venueService.updateVenue(
                    id, userId, name, address, capacity, telefono, email, sitioWeb, horario, images));
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        try {
            Integer userId = authenticatedUserService.getRequiredUserId();
            venueService.deleteById(id, userId);
            return ResponseEntity.ok("{\"message\":\"Local eliminado\"}");
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
