package com.example.echo.security;

import java.time.Instant;

public record SecurityErrorPayload(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path) {
}
