package com.example.echo.core.entity.user.appservices;

import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.persistence.RoleRepository;
import com.example.echo.core.entity.user.dto.LoginResponseDTO;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OAuthUserServiceImpl {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public LoginResponseDTO loginOrRegister(String email, String providerId,
            String provider, String username) {

        Optional<UserDTO> existing = userRepository.findByEmail(email);

        UserDTO userDTO;
        if (existing.isPresent()) {
            userDTO = existing.get();
            if (userDTO.getProvider() == null || "local".equals(userDTO.getProvider())) {
                userDTO.setProvider(provider);
                userDTO.setProviderId(providerId);
                userRepository.save(userDTO);
            }
        } else {
            userDTO = userRepository.saveOAuthUser(email, username, provider, providerId);

            Optional<RoleDTO> role = roleRepository.findByName("USER");
            role.ifPresent(r -> {
                userDTO.getRoles().add(r);
                userRepository.save(userDTO);
            });
        }

        List<String> roles = userDTO.getRoles().stream()
                .map(RoleDTO::getName)
                .toList();

        String token = JwtUtil.generateToken(email, roles);

        return new LoginResponseDTO(token, userDTO);
    }
}