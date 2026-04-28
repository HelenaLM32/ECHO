package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.reviews.appservices.ReviewService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
public class RestReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    private Integer resolveUserId(Authentication auth) throws ServiceException {
        String email = (String) auth.getPrincipal();
        UserDTO user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado"));
        return user.getId();
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createReview(@RequestBody String json, Authentication auth) {
        try {
            Integer authorId = resolveUserId(auth);
            return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createFromJson(json, authorId));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping(value = "/order/{orderId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getByOrder(@PathVariable Integer orderId) {
        try {
            return ResponseEntity.ok(reviewService.getByOrderId(orderId));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping(value = "/user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getByUser(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(reviewService.getByReviewedUserId(userId));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping(value = "/user/{userId}/average", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAverage(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(reviewService.getAverageByReviewedUserId(userId));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAll() {
        try {
            return ResponseEntity.ok(reviewService.getAllToJson());
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping(value = "/{reviewId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> delete(@PathVariable Integer reviewId) {
        try {
            return ResponseEntity.ok(reviewService.deleteById(reviewId));
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
