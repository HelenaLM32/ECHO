package com.example.echo.core.entity.profile.persistence;

import com.example.echo.core.entity.profile.model.Profile;
import java.util.Optional;

public interface ProfileRepository {
    Profile save(Profile profile);

    Optional<Profile> findByUserId(Integer userId);

    Optional<Profile> findById(Integer id);
}