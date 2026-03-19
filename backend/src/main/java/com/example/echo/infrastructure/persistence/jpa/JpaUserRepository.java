package com.example.echo.infrastructure.persistence.jpa;

import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaUserRepository extends JpaRepository<UserDTO, Integer>, UserRepository {

    Optional<UserDTO> findByEmail(String email);

    boolean existsByEmail(String email);

    @Transactional
    UserDTO save(ItemDTO user);

    void deleteById(Integer id);
}
