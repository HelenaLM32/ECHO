package com.example.echo.infrastructure.persistence.jpa;

import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.persistence.RoleRepository;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaRoleRepository extends JpaRepository<RoleDTO, Integer>, RoleRepository {

    Optional<RoleDTO> findByName(String name);

    boolean existsByName(String name);

    @Transactional
    RoleDTO save(RoleDTO role);

    void deleteById(String id);
}
