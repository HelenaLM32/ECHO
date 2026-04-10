package com.example.echo.core.entity.user.appservices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;

import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.core.entity.role.persistence.RoleRepository;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.user.dto.UserLoginDTO;
import com.example.echo.core.entity.user.mappers.UserMapper;
import com.example.echo.core.entity.user.model.User;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializer;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializers;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.SerializersCatalog;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.JacksonSerializer;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

import java.util.HashSet;
import java.util.Set;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;

@Controller
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // Spring inyecta aquí el BCryptPasswordEncoder que declaramos en SecurityConfig.
    @Autowired
    private PasswordEncoder passwordEncoder;

    private Serializer<UserDTO> serializer;

    @SuppressWarnings("unchecked")
    private Serializer<UserDTO> jsonSerializer() {
        return (Serializer<UserDTO>) SerializersCatalog.getInstance(Serializers.JSON_USER);
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

        // Seguridad: ignorar roles que envíe el cliente al registrarse.
        // Asignar siempre el rol por defecto 'USER'.
        RoleDTO userRole = roleRepository.findByName("USER")
            .orElseThrow(() -> new ServiceException("Role not found: USER"));
        Set<RoleDTO> resolvedRoles = new HashSet<>();
        resolvedRoles.add(userRole);
        dto.setRoles(resolvedRoles);
        // Antes de guardar el usuario nuevo, convertimos su contraseña en un hash BCrypt.
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        return userRepository.save(dto);
    }

    protected UserDTO updateUser(String userJson) throws ServiceException {
        UserDTO dto = this.checkInputData(userJson);
        this.getById(dto.getId());

        // Solo ADMIN puede cambiar roles. Si el llamador no es ADMIN conservamos los roles actuales.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean callerIsAdmin = false;
        if (auth != null && auth.getAuthorities() != null) {
            for (GrantedAuthority ga : auth.getAuthorities()) {
                if ("ADMIN".equals(ga.getAuthority())) {
                    callerIsAdmin = true;
                    break;
                }
            }
        }

        Set<RoleDTO> resolvedRoles = new HashSet<>();
        if (callerIsAdmin && dto.getRoles() != null) {
            for (RoleDTO roleDTO : dto.getRoles()) {
                RoleDTO found = roleRepository.findByName(roleDTO.getName())
                        .orElseThrow(() -> new ServiceException("Role not found: " + roleDTO.getName()));
                resolvedRoles.add(found);
            }
        } else {
            UserDTO existing = this.getDTO(dto.getId());
            if (existing != null && existing.getRoles() != null) {
                resolvedRoles.addAll(existing.getRoles());
            }
        }
        dto.setRoles(resolvedRoles);

        // Los hashes BCrypt siempre empiezan por "$2a$", "$2b$" o "$2y$".
        // Esto evita que una contraseña ya cifrada se vuelva a cifrar y quede inutilizable.
        if (!dto.getPassword().startsWith("$2a$") && !dto.getPassword().startsWith("$2b$")
                && !dto.getPassword().startsWith("$2y$")) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return userRepository.save(dto);
    }

    @SuppressWarnings("unchecked")
    @Override
    public String getAllToJson() throws ServiceException {
        try {
            Serializer<UserDTO> ser = (Serializer<UserDTO>) SerializersCatalog.getInstance(Serializers.JSON_USER);
            return ser.serializeList(userRepository.findAll());
        } catch (Exception e) {
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
        return jsonSerializer().serialize(this.newUser(userJson));
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
            Serializer<UserLoginDTO> loginSer = new JacksonSerializer<>();
            UserLoginDTO loginDTO = loginSer.deserialize(loginJson, UserLoginDTO.class);

            UserDTO user = userRepository.findByEmail(loginDTO.getEmail())
                    .orElseThrow(() -> new ServiceException("Email not found"));

            String storedPassword = user.getPassword(); // contraseña que está en la BD (hash o texto plano)
            String rawPassword = loginDTO.getPassword();  // contraseña que envió el usuario al hacer login

            // Detectamos si la contraseña guardada ya está en formato BCrypt.
            boolean isBcrypt = storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")
                    || storedPassword.startsWith("$2y$");

            // Si está hasheada usamos passwordEncoder.matches() que sabe comparar aunque el hash sea diferente
            // Si todavía es texto plano (usuarios anteriores al fix) comparamos directamente.
            boolean validPassword = isBcrypt
                    ? passwordEncoder.matches(rawPassword, storedPassword)
                    : storedPassword.equals(rawPassword);

            if (!validPassword) {
                throw new ServiceException("Incorrect password");
            }

            // Migración automática: hasheamos la contraseña en la base de datos si no estaba hasheada.
            if (!isBcrypt) {
                user.setPassword(passwordEncoder.encode(rawPassword));
                userRepository.save(user);
            }

            return jsonSerializer().serialize(user);
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
}
