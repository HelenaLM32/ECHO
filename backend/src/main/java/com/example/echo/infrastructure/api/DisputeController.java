package com.example.echo.infrastructure.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.dispute.appservices.DisputeService;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.security.JwtUtil;

@RestController
@RequestMapping("/disputes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DisputeController {

    @Autowired
    private DisputeService disputeService;

    @Autowired
    private UserRepository userRepository;

    private Integer getCurrentUserId() throws ServiceException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof String)) {
            throw new ServiceException("Usuario no autenticado");
        }
        String email = (String) auth.getPrincipal();
        UserDTO user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado"));
        return user.getId();
    }

    @PostMapping
    public ResponseEntity<String> createDispute(@RequestBody String json) {
        try {
            Integer userId = getCurrentUserId();
            String result = disputeService.createDisputeFromJson(json, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{disputeId}")
    public ResponseEntity<String> getDispute(@PathVariable Integer disputeId) {
        try {
            String result = disputeService.getDisputeByIdToJson(disputeId);
            return ResponseEntity.ok(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/user/my-disputes")
    public ResponseEntity<String> getUserDisputes() {
        try {
            Integer userId = getCurrentUserId();
            String result = disputeService.getUserDisputesToJson(userId);
            return ResponseEntity.ok(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/open")
    public ResponseEntity<String> getOpenDisputes() {
        try {
            String result = disputeService.getOpenDisputesToJson();
            return ResponseEntity.ok(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping
    public ResponseEntity<String> getAllDisputes() {
        try {
            String result = disputeService.getAllDisputesToJson();
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
            Integer userId = getCurrentUserId();
            String result = disputeService.addMessageToDisputeFromJson(disputeId, json, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PatchMapping("/{disputeId}/close")
    public ResponseEntity<String> closeDispute(@PathVariable Integer disputeId,
            @RequestBody String json) {
        try {
            String result = disputeService.closeDisputeFromJson(disputeId, json);
            return ResponseEntity.ok(result);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
