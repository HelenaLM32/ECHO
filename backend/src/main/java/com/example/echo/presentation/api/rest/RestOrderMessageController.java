package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.ordermessages.appservices.OrderMessageService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders/{orderId}/messages")
public class RestOrderMessageController {

    @Autowired
    private OrderMessageService orderMessageService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getMessages(
            @PathVariable Integer orderId,
            Authentication auth) {
        try {
            return ResponseEntity.ok(orderMessageService.getMessagesByOrderId(orderId, auth.getName()));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> sendMessage(
            @PathVariable Integer orderId,
            @RequestBody String messageJson,
            Authentication auth) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(orderMessageService.sendMessage(orderId, messageJson, auth.getName()));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
