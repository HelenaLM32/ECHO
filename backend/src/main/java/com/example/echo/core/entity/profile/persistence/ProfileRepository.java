package com.example.echo.core.entity.profile.persistence;

import com.example.echo.core.entity.profile.dto.ProfileDTO;

import java.util.Optional;

public interface ProfileRepository {

    Optional<ProfileDTO> findByUserId(Integer userId);

    Optional<ProfileDTO> findById(Integer id);

    ProfileDTO save(ProfileDTO profile);
}
