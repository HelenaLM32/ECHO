package com.example.echo.security;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    @Value("${app.rate-limit.max-requests-per-minute:1_000_000}")
    private int maxRequestsPerMinute;

    @Value("${app.rate-limit.max-tracked-ips:50_000}")
    private int maxTrackedIps;

    @Value("${app.rate-limit.window-ms:60_000}")
    private long windowMs;

    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> windowStartTimes = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String clientIP = resolveClientIP(request);
        long currentTime = System.currentTimeMillis();

        long windowStart = windowStartTimes.computeIfAbsent(clientIP, k -> currentTime);

        if (currentTime > windowStart + windowMs) {
            requestCounts.put(clientIP, new AtomicInteger(0));
            windowStartTimes.put(clientIP, currentTime);
        }

        if (requestCounts.size() > maxTrackedIps) {
            requestCounts.clear();
            windowStartTimes.clear();
        }

        AtomicInteger count = requestCounts.computeIfAbsent(clientIP, k -> new AtomicInteger(0));
        if (count.incrementAndGet() > maxRequestsPerMinute) {
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
            return parts[0].trim();
        }
        return request.getRemoteAddr();
    }
}

