package com.example.echo.security;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;

@Service
public class AuthenticatedUserService {

    private final UserRepository userRepository;

    public AuthenticatedUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            return Optional.empty();
        }

        return userRepository.findByEmail(email);
    }

    public UserDTO getRequiredUser() throws ServiceException {
        return getCurrentUser().orElseThrow(() -> new ServiceException("No autorizado"));
    }

    public Integer getRequiredUserId() throws ServiceException {
        return getRequiredUser().getId();
    }

    public boolean isCurrentUser(Integer userId) throws ServiceException {
        return getRequiredUserId().equals(userId);
    }

    public boolean isCurrentUserOrAdmin(Integer userId) throws ServiceException {
        UserDTO currentUser = getRequiredUser();
        if (currentUser.getId().equals(userId)) {
            return true;
        }

        return currentUser.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()));
    }
}
