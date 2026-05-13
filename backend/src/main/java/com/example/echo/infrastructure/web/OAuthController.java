package com.example.echo.infrastructure.web;

import com.example.echo.core.entity.user.appservices.OAuthUserServiceImpl;
import com.example.echo.core.entity.user.dto.LoginResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/oauth")
public class OAuthController {

    @Autowired
    private OAuthUserServiceImpl oauthUserService;

    @Value("${GOOGLE_CLIENT_ID}")
    private String googleClientId;

    @Value("${GOOGLE_CLIENT_SECRET}")
    private String googleClientSecret;

    @Value("${GITHUB_CLIENT_ID}")
    private String githubClientId;

    @Value("${GITHUB_CLIENT_SECRET}")
    private String githubClientSecret;

    private final WebClient webClient = WebClient.builder().build();

    // ── GOOGLE ────────────────────────────────────────────────────────
    @PostMapping("/google")
    public ResponseEntity<LoginResponseDTO> googleCallback(
            @RequestBody Map<String, String> body) {

        String code = body.get("code");
        String redirectUri = body.get("redirectUri");

        Map<?, ?> tokenResponse = webClient.post()
                .uri("https://oauth2.googleapis.com/token")
                .bodyValue(Map.of(
                        "code", code,
                        "client_id", googleClientId,
                        "client_secret", googleClientSecret,
                        "redirect_uri", redirectUri,
                        "grant_type", "authorization_code"))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String accessToken = (String) tokenResponse.get("access_token");

        Map<?, ?> userInfo = webClient.get()
                .uri("https://www.googleapis.com/oauth2/v2/userinfo")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String email = (String) userInfo.get("email");
        String id = (String) userInfo.get("id");
        String username = (String) userInfo.get("name");

        return ResponseEntity.ok(oauthUserService.loginOrRegister(email, id, "google", username));
    }

    // ── GITHUB ────────────────────────────────────────────────────────
    @PostMapping("/github")
    public ResponseEntity<LoginResponseDTO> githubCallback(
            @RequestBody Map<String, String> body) {

        String code = body.get("code");
        String redirectUri = body.get("redirectUri");

        Map<?, ?> tokenResponse = webClient.post()
                .uri("https://github.com/login/oauth/access_token")
                .header("Accept", "application/json")
                .bodyValue(Map.of(
                        "code", code,
                        "client_id", githubClientId,
                        "client_secret", githubClientSecret,
                        "redirect_uri", redirectUri))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String accessToken = (String) tokenResponse.get("access_token");

        Map<?, ?> userInfo = webClient.get()
                .uri("https://api.github.com/user")
                .header("Authorization", "Bearer " + accessToken)
                .header("Accept", "application/vnd.github+json")
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String email = (String) userInfo.get("email");
        String id = String.valueOf(userInfo.get("id"));
        String username = (String) userInfo.get("login");

        // GitHub puede no devolver email público, lo pedimos aparte
        if (email == null) {
            email = fetchGithubPrimaryEmail(accessToken);
        }

        return ResponseEntity.ok(oauthUserService.loginOrRegister(email, id, "github", username));
    }

    @SuppressWarnings("unchecked")
    private String fetchGithubPrimaryEmail(String accessToken) {
        List<Map<?, ?>> emails = webClient.get()
                .uri("https://api.github.com/user/emails")
                .header("Authorization", "Bearer " + accessToken)
                .header("Accept", "application/vnd.github+json")
                .retrieve()
                .bodyToMono(List.class)
                .block();

        if (emails == null)
            return null;

        return emails.stream()
                .filter(e -> Boolean.TRUE.equals(e.get("primary"))
                        && Boolean.TRUE.equals(e.get("verified")))
                .map(e -> (String) e.get("email"))
                .findFirst()
                .orElse(null);
    }
}