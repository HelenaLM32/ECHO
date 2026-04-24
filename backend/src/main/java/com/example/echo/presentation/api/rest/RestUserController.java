package com.example.echo.presentation.api.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.appservices.UserService;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.security.JwtUtil;

@RestController
@RequestMapping("/users")
public class RestUserController {

    @Autowired
    UserService userService;

    @Autowired
    ObjectMapper mapper;

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
            String responseJson = userService.registerFromJson(userJson);
            ObjectNode userNode = (ObjectNode) mapper.readTree(responseJson);
            String token = JwtUtil.generateToken(userNode.get("email").asText(), List.of("USER"));
            userNode.put("token", token);
            return ResponseEntity.ok(userNode.toString());
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> login(@RequestBody String loginJson) {
        try {
            String responseJson = userService.loginFromJson(loginJson);
            ObjectNode userNode = (ObjectNode) mapper.readTree(responseJson);
            String email = userNode.get("email").asText();

            UserDTO user = userService.findByEmail(email);

            ArrayNode rolesArray = userNode.putArray("roles");
            List<String> roleNames = new java.util.ArrayList<>();

            for (RoleDTO r : user.getRoles()) {
                rolesArray.add(r.getName());
                roleNames.add(r.getName());
            }

            String token = JwtUtil.generateToken(email, roleNames);
            userNode.put("token", token);

            return ResponseEntity.ok(userNode.toString());
        } catch (Exception e) {
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
    public ResponseEntity<String> deleteUser(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer "))
                return ResponseEntity.status(403).body("No autorizado");
            String token = authHeader.replace("Bearer ", "");
            if (!JwtUtil.validateToken(token))
                return ResponseEntity.status(403).body("Token inválido");
            String email = JwtUtil.extractEmail(token);
            UserDTO user = userService.findByEmail(email);
            boolean isAdmin = user.getRoles().stream()
                    .anyMatch(r -> r.getName().equals("ADMIN"));
            if (!user.getId().equals(id) && !isAdmin)
                return ResponseEntity.status(403).body("No autorizado");

            userService.deleteById(id);
            return ResponseEntity.ok("{\"message\":\"Cuenta eliminada correctamente\"}");
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PatchMapping(value = "/{id}/credentials", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateCredentials(
            @PathVariable Integer id,
            @RequestBody String body,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer "))
                return ResponseEntity.status(403).body("No autorizado");
            String token = authHeader.replace("Bearer ", "");
            if (!JwtUtil.validateToken(token))
                return ResponseEntity.status(403).body("Token inválido");
            String email = JwtUtil.extractEmail(token);
            com.example.echo.core.entity.user.dto.UserDTO user = userService.findByEmail(email);
            if (!user.getId().equals(id))
                return ResponseEntity.status(403).body("No autorizado");

            com.fasterxml.jackson.databind.JsonNode node = mapper.readTree(body);
            String newUsername = node.has("username") ? node.get("username").asText() : null;
            String currentPassword = node.has("currentPassword") ? node.get("currentPassword").asText() : null;
            String newPassword = node.has("newPassword") ? node.get("newPassword").asText() : null;

            return ResponseEntity.ok(userService.updateCredentials(id, newUsername, currentPassword, newPassword));
        } catch (com.example.echo.core.entity.sharedkernel.exceptions.ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }
}