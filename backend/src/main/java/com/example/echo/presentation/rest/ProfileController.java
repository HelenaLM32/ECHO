package com.example.echo.presentation.rest;

import com.example.echo.core.entity.profile.appservices.ProfileService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.items.appservices.ItemService;
import com.example.echo.security.AuthenticatedUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profiles")
public class ProfileController {

    private final ProfileService profileService;
    private final AuthenticatedUserService authenticatedUserService;
    private final ItemService itemService;

    public ProfileController(ProfileService profileService, AuthenticatedUserService authenticatedUserService, ItemService itemService) {
        this.profileService = profileService;
        this.authenticatedUserService = authenticatedUserService;
        this.itemService = itemService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAllProfiles() {
        try {
            return ResponseEntity.ok(profileService.getAllToJson());
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

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
            @RequestBody String profileJson) {
        try {
            if (!authenticatedUserService.isCurrentUser(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
            }
            return ResponseEntity.ok(profileService.updateFromJson(userId, profileJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno");
        }
    }

    @PutMapping(value = "/{userId}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateAvatar(
            @PathVariable Integer userId,
            @RequestParam("avatarUrl") MultipartFile file) {
        try {
            if (!authenticatedUserService.isCurrentUser(userId))
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
            return ResponseEntity.ok(profileService.updateAvatar(userId, file));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno");
        }
    }

    @PutMapping(value = "/{userId}/banner", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateBanner(
            @PathVariable Integer userId,
            @RequestParam("bannerUrl") MultipartFile file) {
        try {
            if (!authenticatedUserService.isCurrentUser(userId))
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
            return ResponseEntity.ok(profileService.updateBanner(userId, file));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno");
        }
    }
}
