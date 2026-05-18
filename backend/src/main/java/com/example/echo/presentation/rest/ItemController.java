package com.example.echo.presentation.rest;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.items.appservices.ItemService;
import com.example.echo.core.entity.items.persistence.ItemRepository;
import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.core.entity.user.dto.UserDTO;

@RestController
@RequestMapping("/items")
public class ItemController {

    private final ItemService itemService;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ItemController(ItemService itemService, ItemRepository itemRepository, UserRepository userRepository) {
        this.itemService = itemService;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAllItems() {
        try {
            return ResponseEntity.ok(itemService.getAllToJson());
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getItemById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(itemService.getByIdToJson(id));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping(value = "/register",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> registerItem(@RequestBody String itemJson) {
        try {
            return ResponseEntity.ok(itemService.registerFromJson(itemJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateItem(@PathVariable Integer id, @RequestBody String itemJson, Authentication authentication) {
        try {
            String email = authentication.getName();
            UserDTO currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no autenticado"));
            
            ItemDTO existing = itemRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Item no encontrado"));
            
            boolean isCreator = existing.getCreatorId().equals(currentUser.getId());
            boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN"));
            
            if (!isCreator && !isAdmin) {
                return ResponseEntity.status(403).body("No autorizado para editar este item");
            }
            
            return ResponseEntity.ok(itemService.updateFromJson(itemJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Integer id, Authentication authentication) {
        try {
            String email = authentication.getName();
            UserDTO currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no autenticado"));
            
            ItemDTO existing = itemRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Item no encontrado"));
            
            boolean isCreator = existing.getCreatorId().equals(currentUser.getId());
            boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN"));
            
            if (!isCreator && !isAdmin) {
                return ResponseEntity.status(403).body("No autorizado para eliminar este item");
            }
            
            itemService.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (ServiceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}