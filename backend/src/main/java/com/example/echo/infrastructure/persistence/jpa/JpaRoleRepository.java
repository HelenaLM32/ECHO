package com.example.echo.infrastructure.persistence.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.persistence.RoleRepository;

import jakarta.transaction.Transactional;

@Repository
public interface JpaRoleRepository extends JpaRepository<RoleDTO, Integer>, RoleRepository {

    //añadir findById
    @Override
    Optional<RoleDTO> findById(Integer id);

    Optional<RoleDTO> findByName(String name);

    boolean existsByName(String name);

    @Override
    @Transactional
    RoleDTO save(RoleDTO role);

    @Override
    void deleteById(Integer id);
}
