package com.example.echo.infrastructure.persistence.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;

import jakarta.transaction.Transactional;

@Repository
public interface JpaUserRepository extends JpaRepository<UserDTO, Integer>, UserRepository {

    @Override
    Optional<UserDTO> findById(Integer id);

    Optional<UserDTO> findByEmail(String email);

    boolean existsByEmail(String email);

    @Override
    @Transactional
    UserDTO save(UserDTO user);

    @Override
    void deleteById(Integer id);

    @Transactional
    void deleteByEmail(String email);

    Optional<UserDTO> findByProviderAndProviderId(String provider, String providerId);

    @Transactional
    default UserDTO saveOAuthUser(String email, String username, String provider, String providerId) {
        UserDTO user = new UserDTO();
        user.setEmail(email);
        user.setUsername(username);
        user.setProvider(provider);
        user.setProviderId(providerId);
        user.setIsActive(true);
        return save(user);
    }
}