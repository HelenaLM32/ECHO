package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.profile.appservices.ProfileService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.core.entity.items.appservices.ItemService;
import com.example.echo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
public class RestProfileController {

    @Autowired
    ProfileService profileService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ItemService itemService;

    @GetMapping(value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getProfile(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(profileService.getByUserIdToJson(userId));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping(value = "/{userId}/products", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getProfileProducts(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(itemService.getByCreatorIdAndTypeToJson(userId, "PRODUCT"));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping(value = "/{userId}/services", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getProfileServices(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(itemService.getByCreatorIdAndTypeToJson(userId, "SERVICE"));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping(value = "/{userId}/all-items", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getProfileAllItems(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(itemService.getByCreatorIdToJson(userId));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateProfile(
            @PathVariable Integer userId,
            @RequestBody String profileJson,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isAuthorized(authHeader, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
            }
            return ResponseEntity.ok(profileService.updateFromJson(userId, profileJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno");
        }
    }

    @PutMapping(value = "/{userId}/avatar", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateAvatar(
            @PathVariable Integer userId,
            @RequestBody String body,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isAuthorized(authHeader, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
            }
            return ResponseEntity.ok(profileService.updateFromJson(userId, body));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno");
        }
    }

    @PutMapping(value = "/{userId}/banner", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateBanner(
            @PathVariable Integer userId,
            @RequestBody String body,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isAuthorized(authHeader, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
            }
            return ResponseEntity.ok(profileService.updateFromJson(userId, body));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno");
        }
    }

    private boolean isAuthorized(String authHeader, Integer userId) throws ServiceException {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            return false;
        String token = authHeader.replace("Bearer ", "");
        if (!JwtUtil.validateToken(token))
            return false;
        String email = JwtUtil.extractEmail(token);
        UserDTO user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado"));
        return user.getId().equals(userId);
    }
}