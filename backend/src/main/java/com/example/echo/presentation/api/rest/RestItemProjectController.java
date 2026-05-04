package com.example.echo.presentation.api.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.echo.core.entity.items.appservices.ItemProjectService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/item-projects")
public class RestItemProjectController {

    private static final Logger log = LoggerFactory.getLogger(RestItemProjectController.class);

    @Autowired
    ItemProjectService projectService;
    @Autowired
    com.fasterxml.jackson.databind.ObjectMapper mapper;
    @Autowired
    com.example.echo.core.entity.user.persistence.UserRepository userRepository;
    @Autowired
    com.example.echo.infrastructure.persistence.jpa.JpaProjectLikeRepository projectLikeRepo;

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
    public ResponseEntity<String> toggleLike(@PathVariable Integer id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer "))
                return ResponseEntity.status(401).body("No autorizado");
            String token = authHeader.replace("Bearer ", "");
            if (!com.example.echo.security.JwtUtil.validateToken(token))
                return ResponseEntity.status(401).body("Token inválido");
            String email = com.example.echo.security.JwtUtil.extractEmail(token);
            com.example.echo.core.entity.user.dto.UserDTO user = userRepository.findByEmail(email).orElse(null);
            if (user == null)
                return ResponseEntity.status(401).body("Usuario no encontrado");
            return ResponseEntity.ok(projectService.toggleLikeAndGetByIdToJson(id, user.getId()));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping(value = "/{id}/comments", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addComment(@PathVariable Integer id, @RequestBody String body,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer "))
                return ResponseEntity.status(401).body("No autorizado");
            String token = authHeader.replace("Bearer ", "");
            if (!com.example.echo.security.JwtUtil.validateToken(token))
                return ResponseEntity.status(401).body("Token inválido");
            String email = com.example.echo.security.JwtUtil.extractEmail(token);
            com.example.echo.core.entity.user.dto.UserDTO user = userRepository.findByEmail(email).orElse(null);
            if (user == null)
                return ResponseEntity.status(401).body("Usuario no encontrado");
            String commentText = new com.fasterxml.jackson.databind.ObjectMapper().readTree(body).path("comment")
                    .asText(null);
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
    public ResponseEntity<String> deleteComment(@PathVariable Integer projectId, @PathVariable Long commentId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer "))
                return ResponseEntity.status(401).body("No autorizado");
            String token = authHeader.replace("Bearer ", "");
            if (!com.example.echo.security.JwtUtil.validateToken(token))
                return ResponseEntity.status(401).body("Token inválido");
            String email = com.example.echo.security.JwtUtil.extractEmail(token);
            com.example.echo.core.entity.user.dto.UserDTO user = userRepository.findByEmail(email).orElse(null);
            if (user == null)
                return ResponseEntity.status(401).body("Usuario no encontrado");
            return ResponseEntity.ok(projectService.deleteCommentAndGetByIdToJson(projectId, commentId, user.getId()));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{id}/likes/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> likeStatus(@PathVariable Integer id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.ok("{\"liked\":false}");
            }
            String token = authHeader.replace("Bearer ", "");
            if (!com.example.echo.security.JwtUtil.validateToken(token))
                return ResponseEntity.ok("{\"liked\":false}");
            String email = com.example.echo.security.JwtUtil.extractEmail(token);
            com.example.echo.core.entity.user.dto.UserDTO user = userRepository.findByEmail(email).orElse(null);
            if (user == null)
                return ResponseEntity.ok("{\"liked\":false}");
            boolean exists = projectLikeRepo.existsByUserIdAndProjectId(user.getId(), id);
            return ResponseEntity.ok("{\"liked\":" + (exists ? "true" : "false") + "}");
        } catch (Exception e) {
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
    public ResponseEntity<String> delete(@PathVariable Integer id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer "))
                return ResponseEntity.status(401).body("No autorizado");
            String token = authHeader.replace("Bearer ", "");
            if (!com.example.echo.security.JwtUtil.validateToken(token))
                return ResponseEntity.status(401).body("Token inválido");
            String email = com.example.echo.security.JwtUtil.extractEmail(token);
            com.example.echo.core.entity.user.dto.UserDTO user = userRepository.findByEmail(email).orElse(null);
            if (user == null)
                return ResponseEntity.status(401).body("Usuario no encontrado");
            boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN"));
            JsonNode projectNode = mapper.readTree(projectService.getByIdToJson(id));
            Integer creatorId = projectNode.path("item").path("creatorId").isInt() ? projectNode.path("item").path("creatorId").asInt() : null;
            if (!isAdmin && (creatorId == null || !creatorId.equals(user.getId()))) {
                return ResponseEntity.status(403).body("No autorizado");
            }
            projectService.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
