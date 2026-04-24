package com.example.echo.infrastructure.config;

import java.util.HashSet;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.persistence.RoleRepository;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@ConditionalOnProperty(prefix = "app.admin.bootstrap", name = "enabled", havingValue = "true")
public class AdminBootstrapRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${APP_ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${APP_ADMIN_USERNAME:admin}")
    private String adminUsername;

    @Value("${APP_ADMIN_PASSWORD:}")
    private String adminPassword;

    @Value("${APP_ADMIN_PASSWORD_HASH:}")
    private String adminPasswordHash;

    public AdminBootstrapRunner(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        bootstrapAdmin();
    }

    private void bootstrapAdmin() {
        if (adminEmail == null || adminEmail.isBlank()) {
            throw new IllegalStateException("APP_ADMIN_EMAIL is required when app.admin.bootstrap.enabled=true");
        }

        RoleDTO adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("Role ADMIN not found in database"));

        UserDTO existingUser = userRepository.findByEmail(adminEmail).orElse(null);

        if (existingUser == null) {
            String storedPassword = resolvePassword();
            UserDTO newAdmin = new UserDTO(null, adminEmail.trim(), adminUsername.trim(), storedPassword, true, new HashSet<>());
            newAdmin.getRoles().add(adminRole);
            userRepository.save(newAdmin);
            log.info("Bootstrap admin user created: {}", adminEmail);
            return;
        }

        if (existingUser.getRoles() == null) {
            existingUser.setRoles(new HashSet<>());
        }

        boolean hadAdminRole = existingUser.getRoles().stream()
                .anyMatch(role -> "ADMIN".equals(role.getName()));

        if (!hadAdminRole) {
            existingUser.getRoles().add(adminRole);
            userRepository.save(existingUser);
            log.info("Existing user promoted to ADMIN: {}", adminEmail);
        } else {
            log.info("Bootstrap admin skipped. User already has ADMIN role: {}", adminEmail);
        }
    }

    private String resolvePassword() {
        if (adminPasswordHash != null && !adminPasswordHash.isBlank()) {
            return adminPasswordHash.trim();
        }

        if (adminPassword == null || adminPassword.isBlank()) {
            throw new IllegalStateException("Set APP_ADMIN_PASSWORD_HASH or APP_ADMIN_PASSWORD for admin bootstrap");
        }

        return passwordEncoder.encode(adminPassword.trim());
    }
}
