package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.services.appservices.ItemServiceService;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.services.dto.ItemServiceRequest;
import com.example.echo.core.entity.services.dto.ItemServiceResponse;
import com.example.echo.core.entity.user.persistence.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ItemServiceController {

    private final ItemServiceService itemServiceService;
    private final UserRepository userRepository;

    public ItemServiceController(ItemServiceService itemServiceService, UserRepository userRepository) {
        this.itemServiceService = itemServiceService;
        this.userRepository = userRepository;
    }

    private UserDTO getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof String)) {
            throw new SecurityException("Usuario no autenticado");
        }
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new SecurityException("Usuario no encontrado"));
    }

    @PostMapping
    public ResponseEntity<ItemServiceResponse> create(@Valid @RequestBody ItemServiceRequest request) {
        UserDTO creator = getCurrentUser();
        ItemServiceResponse response = itemServiceService.create(request, creator);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemServiceResponse> update(@PathVariable Long id, @Valid @RequestBody ItemServiceRequest request) {
        UserDTO creator = getCurrentUser();
        ItemServiceResponse response = itemServiceService.update(id, request, creator);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        UserDTO creator = getCurrentUser();
        itemServiceService.delete(id, creator);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<List<ItemServiceResponse>> getMyServices() {
        UserDTO creator = getCurrentUser();
        List<ItemServiceResponse> responses = itemServiceService.getMyServices(creator);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemServiceResponse> getById(@PathVariable Long id) {
        ItemServiceResponse response = itemServiceService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ItemServiceResponse>> getAll() {
        return ResponseEntity.ok(itemServiceService.getAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ItemServiceResponse>> getByUserId(@PathVariable Integer userId) {
        List<ItemServiceResponse> responses = itemServiceService.getByCreatorId(userId);
        return ResponseEntity.ok(responses);
    }
}