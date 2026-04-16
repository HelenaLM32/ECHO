package com.example.echo.infrastructure.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.core.entity.user.dto.UserDTO;
import java.util.List;

@Configuration
public class PasswordMigrationRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        migratePasswords();
    }

    public void migratePasswords() {
        List<UserDTO> users = userRepository.findAll();
        int migratedCount = 0;

        for (UserDTO user : users) {
            // Check if password looks like BCrypt (starts with $2a$, $2b$, $2y$, or $2x$)
            if (user.getPassword() != null && !user.getPassword().startsWith("$2")) {
                System.out.println("Migrating password for user: " + user.getEmail());
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
                migratedCount++;
            }
        }

        if (migratedCount > 0) {
            System.out.println("✅ Password migration completed: " + migratedCount + " passwords upgraded to BCrypt");
        } else {
            System.out.println("✅ All passwords are already secure");
        }
    }
}
