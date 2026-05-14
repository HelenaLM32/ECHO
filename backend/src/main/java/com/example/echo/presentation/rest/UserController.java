package com.example.echo.presentation.rest;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.appservices.UserService;
import com.example.echo.security.AuthenticatedUserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final ObjectMapper mapper;
    private final AuthenticatedUserService authenticatedUserService;

    public UserController(UserService userService, ObjectMapper mapper, AuthenticatedUserService authenticatedUserService) {
        this.userService = userService;
        this.mapper = mapper;
        this.authenticatedUserService = authenticatedUserService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllToJson());
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getUserById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(userService.getByIdToJson(id));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> register(@RequestBody String userJson) {
        try {
            return ResponseEntity.ok(userService.registerFromJson(userJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> login(@RequestBody String loginJson) {
        try {
            return ResponseEntity.ok(userService.loginFromJson(loginJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateUser(@PathVariable Integer id, @RequestBody String userJson) {
        try {
            return ResponseEntity.ok(userService.updateFromJson(userJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        try {
            if (!authenticatedUserService.isCurrentUserOrAdmin(id)) {
                return ResponseEntity.status(403).body("No autorizado");
            }

            userService.deleteById(id);
            return ResponseEntity.ok("{\"message\":\"Cuenta eliminada correctamente\"}");
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PatchMapping(value = "/{id}/credentials", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateCredentials(
            @PathVariable Integer id,
            @RequestBody String body) {
        try {
            Integer authenticatedUserId = authenticatedUserService.getRequiredUserId();
            if (!authenticatedUserId.equals(id)) {
                return ResponseEntity.status(403).body("No autorizado");
            }

            com.fasterxml.jackson.databind.JsonNode node = mapper.readTree(body);
            String newUsername = node.has("username") ? node.get("username").asText() : null;
            String currentPassword = node.has("currentPassword") ? node.get("currentPassword").asText() : null;
            String newPassword = node.has("newPassword") ? node.get("newPassword").asText() : null;

            return ResponseEntity.ok(userService.updateCredentials(id, newUsername, currentPassword, newPassword));
        } catch (com.example.echo.core.entity.sharedkernel.exceptions.ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(400).body("JSON invalido");
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }
}
