package com.example.echo.core.entity.profile.appservices;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.echo.core.entity.profile.dto.ProfileDTO;
import com.example.echo.core.entity.profile.mappers.ProfileMapper;
import com.example.echo.core.entity.profile.persistence.ProfileRepository;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    ProfileRepository profileRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ObjectMapper mapper;

    @Override
    public String getByUserIdToJson(Integer userId) throws ServiceException {
        UserDTO user = userRepository.findById(userId)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado"));

        ProfileDTO profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ProfileDTO newProfile = ProfileMapper.newProfileForUser(user);
                    return profileRepository.save(newProfile);
                });

        return ProfileMapper.toResponseNode(profile, user, mapper).toString();
    }

    @Override
    public String updateFromJson(Integer userId, String profileJson) throws ServiceException {
        try {
            JsonNode node = mapper.readTree(profileJson);

            UserDTO user = userRepository.findById(userId)
                    .orElseThrow(() -> new ServiceException("Usuario no encontrado"));

            ProfileDTO profile = profileRepository.findByUserId(userId)
                    .orElseGet(() -> ProfileMapper.newProfileForUser(user));

            if (node.has("publicName"))  profile.setPublicName(node.get("publicName").asText());
            if (node.has("bio"))         profile.setBio(node.get("bio").asText());
            if (node.has("location"))    profile.setLocation(node.get("location").asText());
            if (node.has("avatarUrl"))   profile.setAvatarUrl(node.get("avatarUrl").asText());
            if (node.has("bannerUrl"))   profile.setBannerUrl(node.get("bannerUrl").asText());
            if (node.has("linkedin"))    profile.setLinkedin(node.get("linkedin").asText());
            if (node.has("instagram"))   profile.setInstagram(node.get("instagram").asText());
            if (node.has("twitter"))     profile.setTwitter(node.get("twitter").asText());
            if (node.has("experience"))  profile.setExperience(node.get("experience").asText());

            profileRepository.save(profile);
            return getByUserIdToJson(userId);

        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error al actualizar perfil: " + e.getMessage());
        }
    }
}
