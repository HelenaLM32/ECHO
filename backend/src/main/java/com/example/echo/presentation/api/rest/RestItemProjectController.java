package com.example.echo.presentation.api.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.echo.core.entity.items.appservices.ItemProjectService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

@RestController
@RequestMapping("/item-projects")
public class RestItemProjectController {

    private static final Logger log = LoggerFactory.getLogger(RestItemProjectController.class);

    @Autowired
    ItemProjectService projectService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAll() {
        try {
            return ResponseEntity.ok(projectService.getAllToJson());
        } catch (ServiceException e) {
            log.error("Error in GET /item-projects", e);
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/by-creator/{creatorId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getByCreator(@PathVariable Integer creatorId) {
        try {
            return ResponseEntity.ok(projectService.getByCreatorIdToJson(creatorId));
        } catch (ServiceException e) {
            log.error("Error in GET /item-projects/by-creator/{}", creatorId, e);
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(projectService.getByIdToJson(id));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> register(@RequestBody String projectJson) {
        try {
            return ResponseEntity.ok(projectService.registerFromJson(projectJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> update(@PathVariable Integer id, @RequestBody String projectJson) {
        try {
            return ResponseEntity.ok(projectService.updateFromJson(projectJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        try {
            projectService.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
