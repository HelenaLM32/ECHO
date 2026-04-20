package com.example.echo.core.entity.user.appservices;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;

import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.persistence.RoleRepository;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializer;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializers;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.SerializersCatalog;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.LoginResponseDTO;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.dto.UserLoginDTO;
import com.example.echo.core.entity.user.dto.UserRoleAssignmentDTO;
import com.example.echo.core.entity.user.mappers.UserMapper;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.security.JwtUtil;

@Controller
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Serializer<UserDTO> serializer;

    @SuppressWarnings("unchecked")
    private Serializer<UserDTO> jsonSerializer() {
        return (Serializer<UserDTO>) SerializersCatalog.getInstance(Serializers.JSON_USER);
    }

    @SuppressWarnings("unchecked")
    private Serializer<UserLoginDTO> loginSerializer() {
        return (Serializer<UserLoginDTO>) SerializersCatalog.getInstance(Serializers.JSON_USER_LOGIN);
    }

    @SuppressWarnings("unchecked")
    private Serializer<LoginResponseDTO> loginResponseSerializer() {
        return (Serializer<LoginResponseDTO>) SerializersCatalog.getInstance(Serializers.JSON_LOGIN_RESPONSE);
    }

    @SuppressWarnings("unchecked")
    private Serializer<UserRoleAssignmentDTO> roleAssignmentSerializer() {
        return (Serializer<UserRoleAssignmentDTO>) SerializersCatalog.getInstance(Serializers.JSON_USER_ROLE_ASSIGNMENT);
    }

    protected UserDTO getDTO(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    protected UserDTO getById(Integer id) throws ServiceException {
        UserDTO dto = this.getDTO(id);
        if (dto == null) {
            throw new ServiceException("User " + id + " not found");
        }
        return dto;
    }

    protected UserDTO checkInputData(String userJson) throws ServiceException {
        try {
            UserDTO dto = this.serializer.deserialize(userJson, UserDTO.class);
            UserMapper.userFromDTO(dto);
            return dto;
        } catch (BuildException e) {
            throw new ServiceException("Error in user input data: " + e.getMessage());
        }
    }

    protected UserDTO newUser(String userJson) throws ServiceException {
        UserDTO dto = this.checkInputData(userJson);

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ServiceException("Email already registered: " + dto.getEmail());
        }

        dto.setPassword(passwordEncoder.encode(dto.getPassword()));

        Set<RoleDTO> resolvedRoles = new HashSet<>();
        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            for (RoleDTO roleDTO : dto.getRoles()) {
                RoleDTO found = roleRepository.findByName(roleDTO.getName())
                        .orElseThrow(() -> new ServiceException("Role not found: " + roleDTO.getName()));
                resolvedRoles.add(found);
            }
        }

        dto.setRoles(resolvedRoles);
        return userRepository.save(dto);
    }

    protected UserDTO updateUser(String userJson) throws ServiceException {
        UserDTO dto = this.checkInputData(userJson);
        UserDTO existing = this.getById(dto.getId());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        } else {
            dto.setPassword(existing.getPassword());
        }

        Set<RoleDTO> resolvedRoles = new HashSet<>();
        if (dto.getRoles() != null) {
            for (RoleDTO roleDTO : dto.getRoles()) {
                RoleDTO found = roleRepository.findByName(roleDTO.getName())
                        .orElseThrow(() -> new ServiceException("Role not found: " + roleDTO.getName()));
                resolvedRoles.add(found);
            }
        }
        dto.setRoles(resolvedRoles);
        return userRepository.save(dto);
    }

    @SuppressWarnings("unchecked")
    @Override
    public String getAllToJson() throws ServiceException {
        try {
            Serializer<UserDTO> ser = (Serializer<UserDTO>) SerializersCatalog.getInstance(Serializers.JSON_USER);
            return ser.serializeList(userRepository.findAll());
        } catch (RuntimeException e) {
            throw new ServiceException("Error getting all users: " + e.getMessage());
        }
    }

    @Override
    public String getByIdToJson(Integer id) throws ServiceException {
        return jsonSerializer().serialize(this.getById(id));
    }

    @SuppressWarnings("unchecked")
    @Override
    public String registerFromJson(String userJson) throws ServiceException {
        this.serializer = (Serializer<UserDTO>) SerializersCatalog.getInstance(Serializers.JSON_USER);
        UserDTO user = this.newUser(userJson);
        List<String> roles = extractRoleNames(user);
        String token = JwtUtil.generateToken(user.getEmail(), roles);
        LoginResponseDTO response = new LoginResponseDTO(token, user);
        return loginResponseSerializer().serialize(response);
    }

    @SuppressWarnings("unchecked")
    @Override
    public String updateFromJson(String userJson) throws ServiceException {
        this.serializer = (Serializer<UserDTO>) SerializersCatalog.getInstance(Serializers.JSON_USER);
        return jsonSerializer().serialize(this.updateUser(userJson));
    }

    @Override
    public void deleteById(Integer id) throws ServiceException {
        this.getById(id);
        userRepository.deleteById(id);
    }

    @Override
    public String loginFromJson(String loginJson) throws ServiceException {
        try {
            UserLoginDTO loginDTO = loginSerializer().deserialize(loginJson, UserLoginDTO.class);
            if (loginDTO == null || loginDTO.getEmail() == null || loginDTO.getPassword() == null) {
                throw new ServiceException("Invalid login payload");
            }

            UserDTO user = userRepository.findByEmail(loginDTO.getEmail())
                    .orElseThrow(() -> new ServiceException("Email not found"));

            if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
                throw new ServiceException("Incorrect password");
            }

            List<String> roles = extractRoleNames(user);

            String token = JwtUtil.generateToken(user.getEmail(), roles);

            LoginResponseDTO response = new LoginResponseDTO(token, user);

            return loginResponseSerializer().serialize(response);
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Login error: " + e.getMessage());
        }
    }

    @Override
    public UserDTO findByEmail(String email) throws ServiceException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado"));
    }

    @Override
    public String updateCredentials(Integer userId, String newUsername, String currentPassword, String newPassword)
            throws ServiceException {
        UserDTO user = this.getById(userId);

        if (newPassword != null && !newPassword.isBlank()) {
            if (currentPassword == null || !user.getPassword().equals(currentPassword)) {
                throw new ServiceException("La contraseña actual es incorrecta");
            }
            if (newPassword.length() < 6) {
                throw new ServiceException("La nueva contraseña debe tener al menos 6 caracteres");
            }
            user.setPassword(newPassword);
        }

        if (newUsername != null && !newUsername.isBlank()) {
            if (newUsername.length() < 3) {
                throw new ServiceException("El nombre de usuario debe tener al menos 3 caracteres");
            }
            user.setUsername(newUsername);
        }

        userRepository.save(user);
        return jsonSerializer().serialize(user);
    }

    @Override
    public String addRoleToUserFromJson(String json) throws ServiceException {
        try {
            UserRoleAssignmentDTO request = roleAssignmentSerializer().deserialize(json, UserRoleAssignmentDTO.class);
            if (request == null || request.getUserId() == null
                    || request.getRoleName() == null || request.getRoleName().isBlank()) {
                throw new ServiceException("Invalid role assignment payload");
            }
            Integer userId = request.getUserId();
            String roleName = request.getRoleName();

            UserDTO user = this.getById(userId);
            RoleDTO role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ServiceException("Role not found: " + roleName));

            if (user.getRoles() == null) {
                user.setRoles(new HashSet<>());
            }

            user.getRoles().add(role);
            UserDTO updated = userRepository.save(user);

            return jsonSerializer().serialize(updated);
        } catch (ServiceException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new ServiceException("Error adding role to user: " + e.getMessage());
        }
    }

    private List<String> extractRoleNames(UserDTO user) {
        if (user.getRoles() == null) {
            return List.of();
        }
        return user.getRoles().stream()
                .map(RoleDTO::getName)
                .collect(Collectors.toList());
    }
}
