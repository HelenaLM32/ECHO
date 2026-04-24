package com.example.echo.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public final class JwtUtil {

    private static final String ENV_SECRET_KEY = "ECHO_JWT_SECRET";
    private static final String ISSUER = "echo-api";
    private static final Key KEY = buildSigningKey();
    private static final long EXPIRATION_TIME_MS = 86_400_000L;

    private JwtUtil() {
    }

    private static Key buildSigningKey() {
        String secret = System.getProperty(ENV_SECRET_KEY);
        if (secret == null || secret.isBlank()) {
            secret = System.getenv(ENV_SECRET_KEY);
        }
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("ECHO_JWT_SECRET is required as JVM property or environment variable");
        }
        if (secret.trim().length() < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters long");
        }
        byte[] keyBytes = secret.trim().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static String generateToken(String email, List<String> roles) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + EXPIRATION_TIME_MS);
        List<String> safeRoles = roles == null ? Collections.emptyList() : roles;

        return Jwts.builder()
                .setSubject(email)
                .setIssuer(ISSUER)
                .setIssuedAt(now)
                .setExpiration(expiresAt)
                .claim("roles", safeRoles)
                .signWith(KEY)
                .compact();
    }

    public static String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public static List<String> extractRoles(String token) {
        Claims claims = parseClaims(token);
        @SuppressWarnings("unchecked")
        List<String> roles = claims.get("roles", List.class);
        return roles == null ? Collections.emptyList() : roles;
    }

    public static boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            String subject = claims.getSubject();
            String issuer = claims.getIssuer();
            return subject != null && !subject.isBlank() && ISSUER.equals(issuer);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private static Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
