package com.example.echo.security;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
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
    private final JwtFilter jwtFilter;
    private final AuthenticationEntryPoint authenticationEntryPoint;
    private final AccessDeniedHandler accessDeniedHandler;

    @Value("${app.upload.dir:../uploads}")
    private String uploadDir;

    public SecurityConfig(
            RateLimitingFilter rateLimitingFilter,
            JwtFilter jwtFilter,
            AuthenticationEntryPoint authenticationEntryPoint,
            AccessDeniedHandler accessDeniedHandler) {
        this.rateLimitingFilter = rateLimitingFilter;
        this.jwtFilter = jwtFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler))
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

                        .requestMatchers(HttpMethod.GET, "/follows/stats/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/follows/check/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/follows/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/follows/**").authenticated()
                        .requestMatchers("/disputes/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/reviews/user/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/reviews/order/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/reviews").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/reviews").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/reviews/**").hasAuthority("ADMIN")


                        .requestMatchers(HttpMethod.GET, "/venues/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/venues/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/venues/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/venues/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/events/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/events/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/events/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/events/**").authenticated()


                        .requestMatchers(HttpMethod.GET, "/proyect").authenticated()
                        .requestMatchers(HttpMethod.POST, "/proyect/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/proyect").authenticated()

                        .requestMatchers(HttpMethod.GET, "/item-projects/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/item-projects/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/item-projects/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/item-projects/**").authenticated()

                        .anyRequest().permitAll())
        .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

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
                String uploadLocation = Paths.get(uploadDir).toAbsolutePath().normalize().toUri().toString();
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations(uploadLocation);
            }
        };
    }

}
