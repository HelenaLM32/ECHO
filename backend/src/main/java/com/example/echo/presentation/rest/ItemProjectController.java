package com.example.echo.presentation.rest;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.echo.core.entity.items.appservices.ItemProjectService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.security.AuthenticatedUserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/item-projects")
public class ItemProjectController {

    private static final Logger log = LoggerFactory.getLogger(ItemProjectController.class);

    private final ItemProjectService projectService;
    private final ObjectMapper mapper;
    private final AuthenticatedUserService authenticatedUserService;
    private final com.example.echo.infrastructure.persistence.jpa.JpaProjectLikeRepository projectLikeRepo;

    public ItemProjectController(ItemProjectService projectService, ObjectMapper mapper, AuthenticatedUserService authenticatedUserService, com.example.echo.infrastructure.persistence.jpa.JpaProjectLikeRepository projectLikeRepo) {
        this.projectService = projectService;
        this.mapper = mapper;
        this.authenticatedUserService = authenticatedUserService;
        this.projectLikeRepo = projectLikeRepo;
    }

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

    @PostMapping(value = "/{id}/views", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> incrementViews(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(projectService.incrementViewsAndGetByIdToJson(id));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping(value = "/{id}/likes", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> toggleLike(@PathVariable Integer id) {
        try {
            UserDTO user = authenticatedUserService.getRequiredUser();
            return ResponseEntity.ok(projectService.toggleLikeAndGetByIdToJson(id, user.getId()));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping(value = "/{id}/comments", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addComment(@PathVariable Integer id, @RequestBody String body) {
        try {
            UserDTO user = authenticatedUserService.getRequiredUser();
            String commentText = mapper.readTree(body).path("comment").asText(null);
            return ResponseEntity.ok(projectService.addCommentAndGetByIdToJson(id, user.getId(), commentText));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{id}/comments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getComments(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(projectService.getCommentsByProjectIdToJson(id));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping(value = "/{projectId}/comments/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Integer projectId, @PathVariable Long commentId) {
        try {
            UserDTO user = authenticatedUserService.getRequiredUser();
            return ResponseEntity.ok(projectService.deleteCommentAndGetByIdToJson(projectId, commentId, user.getId()));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{id}/likes/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> likeStatus(@PathVariable Integer id) {
        try {
            UserDTO user = authenticatedUserService.getCurrentUser().orElse(null);
            if (user == null) {
                return ResponseEntity.ok("{\"liked\":false}");
            }
            boolean exists = projectLikeRepo.existsByUserIdAndProjectId(user.getId(), id);
            return ResponseEntity.ok("{\"liked\":" + exists + "}");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
