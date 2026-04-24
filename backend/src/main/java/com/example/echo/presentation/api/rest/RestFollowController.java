package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.follows.persistence.Follow;
import com.example.echo.core.entity.follows.persistence.FollowRepository;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/follows")
public class RestFollowController {

    @Autowired
    FollowRepository followRepository;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/{targetId}")
    public ResponseEntity<String> follow(
            @PathVariable Integer targetId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Integer followerId = getUserIdFromToken(authHeader);
            if (followerId.equals(targetId))
                return ResponseEntity.badRequest().body("No puedes seguirte a ti mismo");
            if (followRepository.existsByFollowerIdAndFollowingId(followerId, targetId))
                return ResponseEntity.badRequest().body("Ya sigues a este usuario");

            followRepository.save(new Follow(followerId, targetId));
            return ResponseEntity.ok("{\"message\":\"Siguiendo\"}");
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @DeleteMapping("/{targetId}")
    public ResponseEntity<String> unfollow(
            @PathVariable Integer targetId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Integer followerId = getUserIdFromToken(authHeader);
            followRepository.deleteByFollowerIdAndFollowingId(followerId, targetId);
            return ResponseEntity.ok("{\"message\":\"Has dejado de seguir\"}");
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/check/{targetId}")
    public ResponseEntity<String> isFollowing(
            @PathVariable Integer targetId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Integer followerId = getUserIdFromToken(authHeader);
            boolean following = followRepository.existsByFollowerIdAndFollowingId(followerId, targetId);
            return ResponseEntity.ok("{\"following\":" + following + "}");
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<String> getStats(@PathVariable Integer userId) {
        long followers = followRepository.countFollowers(userId);
        long following = followRepository.countFollowing(userId);
        return ResponseEntity.ok(
                "{\"followers\":" + followers + ",\"following\":" + following + "}");
    }

    private Integer getUserIdFromToken(String authHeader) throws ServiceException {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new ServiceException("No autorizado");
        String token = authHeader.replace("Bearer ", "");
        if (!JwtUtil.validateToken(token))
            throw new ServiceException("Token inválido");
        String email = JwtUtil.extractEmail(token);
        UserDTO user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado"));
        return user.getId();
    }
}