package com.example.echo.presentation.rest;

import com.example.echo.core.entity.follows.appservices.FollowService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.security.AuthenticatedUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/follows")
public class FollowController {

    private final FollowService followService;
    private final AuthenticatedUserService authenticatedUserService;

    public FollowController(FollowService followService, AuthenticatedUserService authenticatedUserService) {
        this.followService = followService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PostMapping("/{targetId}")
    public ResponseEntity<String> follow(@PathVariable Integer targetId) {
        try {
            Integer followerId = authenticatedUserService.getRequiredUserId();
            followService.follow(followerId, targetId);
            return ResponseEntity.ok("{\"message\":\"Siguiendo\"}");
        } catch (ServiceException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{targetId}")
    public ResponseEntity<String> unfollow(@PathVariable Integer targetId) {
        try {
            Integer followerId = authenticatedUserService.getRequiredUserId();
            followService.unfollow(followerId, targetId);
            return ResponseEntity.ok("{\"message\":\"Has dejado de seguir\"}");
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/check/{targetId}")
    public ResponseEntity<String> isFollowing(@PathVariable Integer targetId) {
        try {
            Integer followerId = authenticatedUserService.getRequiredUserId();
            boolean following = followService.isFollowing(followerId, targetId);
            return ResponseEntity.ok("{\"following\":" + following + "}");
        } catch (ServiceException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<String> getStats(@PathVariable Integer userId) {
        long followers = followService.countFollowers(userId);
        long following = followService.countFollowing(userId);
        return ResponseEntity.ok(
                "{\"followers\":" + followers + ",\"following\":" + following + "}");
    }
}
