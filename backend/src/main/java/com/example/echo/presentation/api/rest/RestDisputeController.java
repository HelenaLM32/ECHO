package com.example.echo.presentation.api.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.echo.core.entity.dispute.appservices.DisputeService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;

@RestController
@RequestMapping("/disputes")
public class RestDisputeController {

    @Autowired
    private DisputeService disputeService;

    @Autowired
    private UserRepository userRepository;

    private UserDTO getCurrentUser() throws ServiceException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof String)) {
            throw new ServiceException("Usuario no autenticado");
        }
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado"));
    }

    private boolean isAdmin(UserDTO user) {
        return user.getRoles() != null && user.getRoles().stream().anyMatch(r -> "ADMIN".equals(r.getName()));
    }

    @PostMapping
    public ResponseEntity<String> createDispute(@RequestBody String json) {
        try {
            Integer userId = getCurrentUser().getId();
            String result = disputeService.createDisputeFromJson(json, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{disputeId}")
    public ResponseEntity<String> getDispute(@PathVariable Integer disputeId) {
        try {
            UserDTO user = getCurrentUser();
            String result = disputeService.getDisputeByIdToJson(disputeId, user.getId(), isAdmin(user));
            return ResponseEntity.ok(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<String> getDisputeByOrder(@PathVariable Integer orderId) {
        try {
            UserDTO user = getCurrentUser();
            String result = disputeService.getDisputeByOrderIdToJson(orderId, user.getId(), isAdmin(user));
            return ResponseEntity.ok(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/user/my-disputes")
    public ResponseEntity<String> getUserDisputes() {
        try {
            Integer userId = getCurrentUser().getId();
            String result = disputeService.getUserDisputesToJson(userId);
            return ResponseEntity.ok(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/open")
    public ResponseEntity<String> getOpenDisputes() {
        try {
            UserDTO user = getCurrentUser();
            String result = disputeService.getOpenDisputesToJson(isAdmin(user));
            return ResponseEntity.ok(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping
    public ResponseEntity<String> getAllDisputes() {
        try {
            UserDTO user = getCurrentUser();
            String result = disputeService.getAllDisputesToJson(isAdmin(user));
            return ResponseEntity.ok(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/{disputeId}/messages")
    public ResponseEntity<String> addMessage(@PathVariable Integer disputeId,
            @RequestBody String json) {
        try {
            UserDTO user = getCurrentUser();
            String result = disputeService.addMessageToDisputeFromJson(disputeId, json, user.getId(), isAdmin(user));
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PatchMapping("/{disputeId}/close")
    public ResponseEntity<String> closeDispute(@PathVariable Integer disputeId,
            @RequestBody String json) {
        try {
            UserDTO user = getCurrentUser();
            String result = disputeService.closeDisputeFromJson(disputeId, json, user.getId(), isAdmin(user));
            return ResponseEntity.ok(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
