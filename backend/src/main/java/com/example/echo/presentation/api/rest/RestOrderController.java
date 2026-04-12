package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.orders.appservices.OrderService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class RestOrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getMyOrders(Authentication auth) {
        try {
            return ResponseEntity.ok(orderService.getMyOrdersToJson(auth.getName()));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getOrderById(@PathVariable Integer id, Authentication auth) {
        try {
            return ResponseEntity.ok(orderService.getByIdToJson(id, auth.getName()));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createOrder(@RequestBody String orderJson, Authentication auth) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(orderService.createFromJson(orderJson, auth.getName()));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PatchMapping(value = "/{id}/status",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateStatus(
            @PathVariable Integer id,
            @RequestParam String status,
            Authentication auth) {
        try {
            return ResponseEntity.ok(orderService.updateStatus(id, status, auth.getName()));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
