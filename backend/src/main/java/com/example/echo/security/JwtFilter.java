package com.example.echo.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Usar Authorization Bearer si está presente.
            token = authHeader.substring(7);
        } else {
            // Si no, intentar leer la cookie httpOnly 'JWT' (navegador la envía automáticamente).
            if (request.getCookies() != null) {
                for (var c : request.getCookies()) {
                    if ("JWT".equals(c.getName())) {
                        token = c.getValue();
                        break;
                    }
                }
            }
        }

        // Si el token existe y es válido establecemos la autenticación; si no, la petición queda anónima.
        if (token != null && JwtUtil.validateToken(token)) {
            String email = JwtUtil.extractEmail(token);
            List<String> roles = JwtUtil.extractRoles(token);
            
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        chain.doFilter(request, response);
    }
}