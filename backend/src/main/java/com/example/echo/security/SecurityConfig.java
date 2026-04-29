package com.example.echo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final RateLimitingFilter rateLimitingFilter;

    public SecurityConfig(RateLimitingFilter rateLimitingFilter) {
        this.rateLimitingFilter = rateLimitingFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/users/login", "/users/register").permitAll()

                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/profiles/**").permitAll()

                        .requestMatchers("/admin/**").hasAuthority("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/products/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/products/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/products/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/profiles/**").authenticated()
                        .requestMatchers("/users/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/follows/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/follows/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/follows/**").authenticated()
                        .requestMatchers("/disputes/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/reviews/user/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/reviews/order/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/reviews").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/reviews").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/reviews/**").hasAuthority("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/proyect").authenticated()
                        .requestMatchers(HttpMethod.POST, "/proyect/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/proyect").authenticated()
                        .anyRequest().permitAll())
                .addFilterBefore(new JwtFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebMvcConfigurer uploadResourceHandler() {
        return new WebMvcConfigurer() {
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("file:../uploads/");
            }
        };
    }

}
