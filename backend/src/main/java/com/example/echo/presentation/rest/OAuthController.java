package com.example.echo.presentation.rest;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.echo.core.entity.profile.dto.ProfileDTO;
import com.example.echo.core.entity.profile.persistence.ProfileRepository;
import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.persistence.RoleRepository;
import com.example.echo.core.entity.user.dto.LoginResponseDTO;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.security.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/auth/oauth")
public class OAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @PostMapping("/google")
    public ResponseEntity<String> googleOAuth(@RequestBody Map<String, String> body) {
        String code        = body.get("code");
        String redirectUri = body.get("redirectUri");

        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body("{\"error\":\"Missing authorization code\"}");
        }
        if (redirectUri == null || redirectUri.isBlank()) {
            return ResponseEntity.badRequest().body("{\"error\":\"Missing redirectUri\"}");
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            // 1. Exchange code → Google access token
            HttpHeaders tokenHeaders = new HttpHeaders();
            tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> tokenParams = new LinkedMultiValueMap<>();
            tokenParams.add("code",          code);
            tokenParams.add("client_id",     googleClientId);
            tokenParams.add("client_secret", googleClientSecret);
            tokenParams.add("redirect_uri",  redirectUri);
            tokenParams.add("grant_type",    "authorization_code");

            ResponseEntity<String> tokenResponse;
            try {
                tokenResponse = restTemplate.postForEntity(
                        "https://oauth2.googleapis.com/token",
                        new HttpEntity<>(tokenParams, tokenHeaders),
                        String.class);
            } catch (HttpClientErrorException ex) {
                // Google returns 400 for expired/already-used codes
                String googleError = ex.getResponseBodyAsString();
                return ResponseEntity.status(400)
                        .body("{\"error\":\"Google token exchange failed\",\"detail\":" +
                              objectMapper.writeValueAsString(googleError) + "}");
            }

            JsonNode tokenJson   = objectMapper.readTree(tokenResponse.getBody());
            String accessToken   = tokenJson.path("access_token").asText(null);

            if (accessToken == null || accessToken.isBlank()) {
                return ResponseEntity.status(502).body("{\"error\":\"Google did not return an access token\"}");
            }

            // 2. Fetch user profile from Google
            HttpHeaders userInfoHeaders = new HttpHeaders();
            userInfoHeaders.setBearerAuth(accessToken);

            ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    new HttpEntity<>(userInfoHeaders),
                    String.class);

            JsonNode userInfo = objectMapper.readTree(userInfoResponse.getBody());
            String email      = userInfo.path("email").asText(null);
            String name       = userInfo.path("name").asText(null);
            String picture    = userInfo.path("picture").asText(null);

            if (email == null || email.isBlank()) {
                return ResponseEntity.status(400).body("{\"error\":\"Google account has no email\"}");
            }

            // 3. Find existing user or create a new one
            UserDTO user = userRepository.findByEmail(email).orElseGet(() -> {
                UserDTO newUser = new UserDTO();
                newUser.setEmail(email);
                String baseUsername = (name != null && !name.isBlank())
                        ? name.replaceAll("\\s+", "").toLowerCase()
                        : email.split("@")[0];
                newUser.setUsername(baseUsername);
                newUser.setPassword(null);
                newUser.setIsActive(true);
                newUser.setProvider("google");

                Set<RoleDTO> roles = new HashSet<>();
                roleRepository.findByName("USER").ifPresent(roles::add);
                newUser.setRoles(roles);

                UserDTO saved = userRepository.save(newUser);

                // Only create profile if it doesn't exist yet
                if (profileRepository.findByUserId(saved.getId()).isEmpty()) {
                    ProfileDTO profile = new ProfileDTO();
                    profile.setUserId(saved.getId());
                    profile.setPublicName(name);
                    if (picture != null && !picture.isBlank()) profile.setAvatarUrl(picture);
                    profileRepository.save(profile);
                }

                return saved;
            });

            // 4. Build JWT response
            List<String> roleNames = (user.getRoles() == null)
                    ? Collections.emptyList()
                    : user.getRoles().stream()
                            .map(RoleDTO::getName)
                            .collect(Collectors.toList());

            String jwt = JwtUtil.generateToken(user.getEmail(), roleNames);

            LoginResponseDTO loginResponse = new LoginResponseDTO(jwt, user);
            profileRepository.findByUserId(user.getId())
                    .ifPresent(p -> loginResponse.setAvatarUrl(p.getAvatarUrl()));

            return ResponseEntity.ok(objectMapper.writeValueAsString(loginResponse));

        } catch (Exception e) {
            String msg = (e.getMessage() != null) ? e.getMessage() : e.getClass().getSimpleName();
            try {
                return ResponseEntity.status(500)
                        .body("{\"error\":\"OAuth login error\",\"detail\":"
                              + objectMapper.writeValueAsString(msg) + "}");
            } catch (Exception jsonEx) {
                return ResponseEntity.status(500).body("{\"error\":\"OAuth login error\"}");
            }
        }
    }
}
