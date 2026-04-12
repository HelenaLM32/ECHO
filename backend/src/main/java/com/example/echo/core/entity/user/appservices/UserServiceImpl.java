package com.example.echo.core.entity.user.appservices;

import org.springframework.beans.factory.annotation.Autowired;
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

@Controller
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

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
        this.getById(dto.getId());

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

            if (!user.getPassword().equals(loginDTO.getPassword())) {
                throw new ServiceException("Incorrect password");
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

    @Override
    public String addRoleToUserFromJson(String json) throws ServiceException {
        try {
            com.fasterxml.jackson.databind.JsonNode node = 
                new com.fasterxml.jackson.databind.ObjectMapper().readTree(json);
            
            Integer userId = node.get("userId").asInt();
            String roleName = node.get("roleName").asText();
            
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
        } catch (Exception e) {
            throw new ServiceException("Error adding role to user: " + e.getMessage());
        }
    }
}
