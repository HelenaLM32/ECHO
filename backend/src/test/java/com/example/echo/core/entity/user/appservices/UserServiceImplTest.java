package com.example.echo.core.entity.user.appservices;

import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.persistence.RoleRepository;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.infrastructure.security.PasswordValidator;
import com.example.echo.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    static {
        System.setProperty("ECHO_JWT_SECRET", "12345678901234567890123456789012");
    }

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordValidator passwordValidator;

    @InjectMocks
    private UserServiceImpl service;

    private UserDTO user;

    @BeforeEach
    void setUp() {
        Set<RoleDTO> roles = new HashSet<>();
        roles.add(new RoleDTO(1, "ROLE_USER"));
        user = new UserDTO(1, "user@mail.com", "username", "hash", true, roles);
    }

    @Test
    void registerFromJsonCreatesUserAndReturnsTokenResponse() throws Exception {
        String json = "{\"email\":\"user@mail.com\",\"username\":\"username\",\"password\":\"Abcd1234\",\"isActive\":true}";

        when(userRepository.existsByEmail("user@mail.com")).thenReturn(false);
        when(passwordValidator.validateAndHashPassword("Abcd1234")).thenReturn("hashed");
        when(userRepository.save(any(UserDTO.class))).thenReturn(user);

        try (MockedStatic<JwtUtil> jwt = mockStatic(JwtUtil.class)) {
            jwt.when(() -> JwtUtil.generateToken("user@mail.com", List.of("ROLE_USER"))).thenReturn("token-123");

            String result = service.registerFromJson(json);

            assertTrue(result.contains("token-123"));
            assertTrue(result.contains("user@mail.com"));
        }
    }

    @Test
    void loginFromJsonThrowsWhenPasswordDoesNotMatch() {
        when(userRepository.findByEmail("user@mail.com")).thenReturn(Optional.of(user));
        when(passwordValidator.matchesPassword("wrong", "hash")).thenReturn(false);

        ServiceException ex = assertThrows(ServiceException.class,
                () -> service.loginFromJson("{\"email\":\"user@mail.com\",\"password\":\"wrong\"}"));

        assertTrue(ex.getMessage().contains("Incorrect password"));
    }

    @Test
    void updateCredentialsThrowsForWrongCurrentPassword() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("bad", "hash")).thenReturn(false);

        assertThrows(ServiceException.class,
                () -> service.updateCredentials(1, null, "bad", "Nueva123"));
    }

    @Test
    void addRoleToUserFromJsonAddsRole() throws Exception {
        RoleDTO adminRole = new RoleDTO(2, "ROLE_ADMIN");
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(roleRepository.findByName("ROLE_ADMIN")).thenReturn(Optional.of(adminRole));
        when(userRepository.save(any(UserDTO.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = service.addRoleToUserFromJson("{\"userId\":1,\"roleName\":\"ROLE_ADMIN\"}");

        assertTrue(result.contains("ROLE_ADMIN"));
    }

    @Test
    void findByEmailThrowsWhenMissing() {
        when(userRepository.findByEmail("missing@mail.com")).thenReturn(Optional.empty());

        assertThrows(ServiceException.class, () -> service.findByEmail("missing@mail.com"));
    }
}
