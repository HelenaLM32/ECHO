package com.example.echo.core.entity.profile.mappers;

import com.example.echo.core.entity.profile.dto.ProfileDTO;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class ProfileMapper {

    public static ProfileDTO newProfileForUser(UserDTO user) {
        ProfileDTO dto = new ProfileDTO();
        dto.setUserId(user.getId());
        dto.setPublicName(user.getUsername());
        return dto;
    }

    public static ObjectNode toResponseNode(ProfileDTO profile, UserDTO user, ObjectMapper mapper) {
        ObjectNode node = mapper.createObjectNode();
        node.put("id", profile.getId());
        node.put("userId", profile.getUserId());
        node.put("username", user.getUsername());
        node.put("email", user.getEmail());
        node.put("publicName", safe(profile.getPublicName()));
        node.put("bio", safe(profile.getBio()));
        node.put("location", safe(profile.getLocation()));
        node.put("avatarUrl", safe(profile.getAvatarUrl()));
        node.put("bannerUrl", safe(profile.getBannerUrl()));
        node.put("linkedin", safe(profile.getLinkedin()));
        node.put("instagram", safe(profile.getInstagram()));
        node.put("twitter", safe(profile.getTwitter()));
        node.put("experience", safe(profile.getExperience()));
        return node;
    }

    private static String safe(String value) {
        return value != null ? value : "";
    }
}