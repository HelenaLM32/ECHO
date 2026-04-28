package com.example.echo.infrastructure.config;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    private static final List<String> DEV_DEFAULT_ORIGINS = List.of(
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
            "http://localhost:8083",
            "http://127.0.0.1:8083");

    private final Environment environment;
    private final String configuredOrigins;

    public CorsConfig(Environment environment, @Value("${app.cors.allowed-origins:}") String configuredOrigins) {
        this.environment = environment;
        this.configuredOrigins = configuredOrigins;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        Set<String> origins = parseOrigins(configuredOrigins);

        if (environment.acceptsProfiles(Profiles.of("dev"))) {
            origins.addAll(DEV_DEFAULT_ORIGINS);
        }

        addLoopbackAliases(origins);

        List<String> normalizedOrigins = origins.stream().toList();
        boolean wildcard = normalizedOrigins.stream().anyMatch("*"::equals);
        boolean hasPattern = normalizedOrigins.stream().anyMatch(origin -> origin.contains("*"));

        CorsConfiguration configuration = new CorsConfiguration();
        if (hasPattern) {
            configuration.setAllowedOriginPatterns(normalizedOrigins);
        } else {
            configuration.setAllowedOrigins(normalizedOrigins);
        }

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "Location"));
        configuration.setAllowCredentials(!wildcard);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private static Set<String> parseOrigins(String csvOrigins) {
        Set<String> origins = new LinkedHashSet<>();
        if (csvOrigins == null || csvOrigins.isBlank()) {
            return origins;
        }

        for (String origin : csvOrigins.split(",")) {
            String value = origin.trim();
            if (value.endsWith("/")) {
                value = value.substring(0, value.length() - 1);
            }
            if (!value.isEmpty()) {
                origins.add(value);
            }
        }

        return origins;
    }

    private static void addLoopbackAliases(Set<String> origins) {
        Set<String> aliases = new LinkedHashSet<>();
        for (String origin : origins) {
            if (origin.contains("://localhost:")) {
                aliases.add(origin.replace("://localhost:", "://127.0.0.1:"));
            }
            if (origin.contains("://127.0.0.1:")) {
                aliases.add(origin.replace("://127.0.0.1:", "://localhost:"));
            }
        }
        origins.addAll(aliases);
    }
}
