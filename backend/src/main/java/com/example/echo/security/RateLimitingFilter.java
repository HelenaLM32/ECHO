package com.example.echo.security;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 300;
    private static final int MAX_TRACKED_IPS = 20_000;
    private static final long WINDOW_MS = 60_000L;

    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> windowStartTimes = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String clientIP = resolveClientIP(request);
        long currentTime = System.currentTimeMillis();

        long windowStart = windowStartTimes.getOrDefault(clientIP, currentTime);

        if (currentTime > windowStart + WINDOW_MS) {
            requestCounts.put(clientIP, new AtomicInteger(0));
            windowStartTimes.put(clientIP, currentTime);
        }

        if (requestCounts.size() > MAX_TRACKED_IPS) {
            requestCounts.clear();
            windowStartTimes.clear();
        }

        AtomicInteger count = requestCounts.computeIfAbsent(clientIP, k -> new AtomicInteger(0));
        if (count.incrementAndGet() > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"status\":429,\"error\":\"Too Many Requests\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String resolveClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            String[] parts = xForwardedFor.split(",");
            return parts[parts.length - 1].trim();
        }
        return request.getRemoteAddr();
    }
}

