package com.example.echo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 100;
    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> windowStartTimes = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Excluye el login y registro, temporal porque habra que limitarlos pero me daba problemas con el filtro de jwt
        String path = request.getServletPath();
        return path.equals("/users/login") || 
               path.equals("/users/register") ||
               path.equals("/users/login/") ||
               path.equals("/users/register/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String clientIP = getClientIP(request);

        long currentTime = System.currentTimeMillis();
        long windowStart = windowStartTimes.getOrDefault(clientIP, currentTime);
        long windowEnd = windowStart + 60000; // 1 minute

        if (currentTime > windowEnd) {
            requestCounts.put(clientIP, new AtomicInteger(0));
            windowStartTimes.put(clientIP, currentTime);
        }

        AtomicInteger count = requestCounts.computeIfAbsent(clientIP, k -> new AtomicInteger(0));
        if (count.incrementAndGet() > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(429);
            response.getWriter().write("Too many requests. Maximum " + MAX_REQUESTS_PER_MINUTE + " requests per minute allowed.");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}