package com.example.echo.core.entity.user.persistence;

import com.example.echo.core.entity.user.dto.UserDTO;

import java.util.List;
import java.util.Optional;

public interface UserRepository {

    Optional<UserDTO> findById(Integer id);

    Optional<UserDTO> findByEmail(String email);

    boolean existsByEmail(String email);

    UserDTO save(UserDTO user);

    void deleteById(Integer id);

    List<UserDTO> findAll();
}
