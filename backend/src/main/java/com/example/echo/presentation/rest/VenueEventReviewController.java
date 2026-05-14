package com.example.echo.presentation.rest;

import com.example.echo.core.entity.venuereviews.appservices.VenueEventReviewService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.security.AuthenticatedUserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/venue-event-reviews")
public class VenueEventReviewController {

    private final VenueEventReviewService service;
    private final AuthenticatedUserService authenticatedUserService;

    public VenueEventReviewController(VenueEventReviewService service, AuthenticatedUserService authenticatedUserService) {
        this.service = service;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> create(@RequestBody String json) {
        try {
            Integer userId = authenticatedUserService.getRequiredUserId();
            return ResponseEntity.status(201).body(service.create(json, userId));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getByTarget(
            @RequestParam Integer targetId,
            @RequestParam String targetType) {
        try {
            return ResponseEntity.ok(service.getByTarget(targetId, targetType));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping(value = "/average", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAverage(
            @RequestParam Integer targetId,
            @RequestParam String targetType) {
        try {
            return ResponseEntity.ok(service.getAverage(targetId, targetType));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        try {
            Integer userId = authenticatedUserService.getRequiredUserId();
            return ResponseEntity.ok(service.deleteById(id, userId));
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
