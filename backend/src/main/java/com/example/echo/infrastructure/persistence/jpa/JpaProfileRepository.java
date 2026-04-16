package com.example.echo.infrastructure.persistence.jpa;

import com.example.echo.core.entity.profile.dto.ProfileDTO;
import com.example.echo.core.entity.profile.persistence.ProfileRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaProfileRepository extends JpaRepository<ProfileDTO, Integer>, ProfileRepository {

    Optional<ProfileDTO> findByUserId(Integer userId);

    @Override
    ProfileDTO save(ProfileDTO profile);
}
