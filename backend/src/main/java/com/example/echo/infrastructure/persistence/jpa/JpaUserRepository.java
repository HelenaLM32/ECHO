package com.example.echo.infrastructure.persistence.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;

import jakarta.transaction.Transactional;

@Repository
public interface JpaUserRepository extends JpaRepository<UserDTO, Integer>, UserRepository {

    //añadir findById y deleteByEmail
    Optional<UserDTO> findByEmail(String email);

    boolean existsByEmail(String email);

    @Transactional
    UserDTO save(ItemDTO user);

    void deleteById(Integer id);
}
