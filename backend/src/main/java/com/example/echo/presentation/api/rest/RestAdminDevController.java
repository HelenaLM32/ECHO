package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.ordermessages.appservices.OrderMessageService;
import com.example.echo.core.entity.orders.appservices.OrderService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.appservices.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/dev")
public class RestAdminDevController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderMessageService orderMessageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping(value = "/orders", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAllOrders() {
        try {
            return ResponseEntity.ok(orderService.getAllToJson());
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/orders", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createOrder(@RequestBody String orderJson) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createForBuyerFromJson(orderJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PatchMapping(value = "/orders/{id}/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateOrderStatus(@PathVariable Integer id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(orderService.updateStatusByAdmin(id, status));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping(value = "/orders/{id}/messages", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getOrderMessages(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(orderMessageService.getMessagesByOrderIdAsAdmin(id));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/orders/{id}/messages", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> sendOrderMessage(@PathVariable Integer id, @RequestBody String payloadJson) {
        try {
            JsonNode payload = objectMapper.readTree(payloadJson);
            Integer senderId = payload.hasNonNull("senderId") ? payload.get("senderId").asInt() : null;
            String content = payload.hasNonNull("content") ? payload.get("content").asText() : null;
            String messageJson = objectMapper.createObjectNode().put("content", content).toString();
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(orderMessageService.sendMessageAsUser(id, senderId, messageJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payload inválido");
        }
    }

    @PostMapping(value = "/users/assign-role", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> assignRoleToUser(@RequestBody String payloadJson) {
        try {
            return ResponseEntity.ok(userService.addRoleToUserFromJson(payloadJson));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
