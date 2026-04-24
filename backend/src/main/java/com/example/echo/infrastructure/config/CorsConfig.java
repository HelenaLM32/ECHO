package com.example.echo.infrastructure.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${cors.allowed.origin}")
    private String allowedOrigin;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = Arrays.stream(allowedOrigin.split(","))
                .map(String::trim)
                .map(value -> value.endsWith("/") ? value.substring(0, value.length() - 1) : value)
                .filter(value -> !value.isEmpty())
                .toArray(String[]::new);

        boolean wildcard = Arrays.stream(origins).anyMatch("*"::equals);

        registry.addMapping("/**")
                .allowedOriginPatterns(origins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(!wildcard);
    }
}
