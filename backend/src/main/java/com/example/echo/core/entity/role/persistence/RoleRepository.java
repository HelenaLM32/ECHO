package com.example.echo.core.entity.role.persistence;

import com.example.echo.core.entity.role.dto.RoleDTO;

import java.util.List;
import java.util.Optional;

public interface RoleRepository {

    Optional<RoleDTO> findByName(String name);

    Optional<RoleDTO> findById(Integer id);

    RoleDTO save(RoleDTO role);

    List<RoleDTO> findAll();
}
