package com.example.echo.core.entity.profile.persistence;

import java.util.Optional;

import com.example.echo.core.entity.profile.dto.ProfileDTO;

public interface ProfileRepository {

    ProfileDTO save(ProfileDTO profile);

    Optional<ProfileDTO> findByUserId(Integer userId);

    Optional<ProfileDTO> findById(Integer id);
}
