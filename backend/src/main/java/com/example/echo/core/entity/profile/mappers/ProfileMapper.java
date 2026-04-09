package com.example.echo.core.entity.profile.mappers;

import com.example.echo.core.entity.profile.dto.ProfileDTO;
import com.example.echo.core.entity.profile.model.Profile;

public class ProfileMapper {

    public static Profile profileFromDTO(ProfileDTO dto) {
        Profile profile = new Profile();
        profile.setId(dto.getId());
        profile.setUserId(dto.getUserId());
        profile.setPublicName(dto.getPublicName());
        profile.setBio(dto.getBio());
        profile.setLocation(dto.getLocation());
        profile.setAvatarUrl(dto.getAvatarUrl());
        profile.setBannerUrl(dto.getBannerUrl());
        profile.setLinkedin(dto.getLinkedin());
        profile.setInstagram(dto.getInstagram());
        profile.setTwitter(dto.getTwitter());
        return profile;
    }

    public static ProfileDTO dtoFromProfile(Profile profile) {
        ProfileDTO dto = new ProfileDTO();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUserId());
        dto.setPublicName(profile.getPublicName());
        dto.setBio(profile.getBio());
        dto.setLocation(profile.getLocation());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setBannerUrl(profile.getBannerUrl());
        dto.setLinkedin(profile.getLinkedin());
        dto.setInstagram(profile.getInstagram());
        dto.setTwitter(profile.getTwitter());
        return dto;
    }
}
