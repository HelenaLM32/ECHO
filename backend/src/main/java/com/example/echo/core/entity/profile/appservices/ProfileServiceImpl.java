package com.example.echo.core.entity.profile.appservices;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.echo.core.entity.profile.dto.ProfileDTO;
import com.example.echo.core.entity.profile.mappers.ProfileMapper;
import com.example.echo.core.entity.profile.model.Profile;
import com.example.echo.core.entity.profile.persistence.ProfileRepository;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

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
        Optional<ProfileDTO> optProfileDTO = profileRepository.findByUserId(userId);
        Optional<UserDTO> optUser = userRepository.findById(userId);

        if (optUser.isEmpty()) {
            throw new ServiceException("Usuario no encontrado");
        }

        UserDTO user = optUser.get();

        Profile profile;
        if (optProfileDTO.isPresent()) {
            profile = ProfileMapper.profileFromDTO(optProfileDTO.get());
        } else {
            profile = Profile.getInstance(userId);
            profile.setPublicName(user.getUsername());
            ProfileDTO newProfileDTO = ProfileMapper.dtoFromProfile(profile);
            profileRepository.save(newProfileDTO);
            profile.setId(newProfileDTO.getId()); // set the generated id
        }

        ObjectNode node = mapper.createObjectNode();
        node.put("id", profile.getId());
        node.put("userId", userId);
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

        return node.toString();
    }

    @Override
    public String updateFromJson(Integer userId, String profileJson) throws ServiceException {
        try {
            JsonNode node = mapper.readTree(profileJson);
            Optional<ProfileDTO> optProfileDTO = profileRepository.findByUserId(userId);

            Profile profile;
            if (optProfileDTO.isPresent()) {
                profile = ProfileMapper.profileFromDTO(optProfileDTO.get());
            } else {
                profile = Profile.getInstance(userId);
                profile.setPublicName("");
            }

            if (node.has("publicName")) {
                profile.setPublicName(node.get("publicName").asText());
            }
            if (node.has("bio")) {
                profile.setBio(node.get("bio").asText());
            }
            if (node.has("location")) {
                profile.setLocation(node.get("location").asText());
            }
            if (node.has("avatarUrl")) {
                profile.setAvatarUrl(node.get("avatarUrl").asText());
            }
            if (node.has("bannerUrl")) {
                profile.setBannerUrl(node.get("bannerUrl").asText());
            }
            if (node.has("linkedin")) {
                profile.setLinkedin(node.get("linkedin").asText());
            }
            if (node.has("instagram")) {
                profile.setInstagram(node.get("instagram").asText());
            }
            if (node.has("twitter")) {
                profile.setTwitter(node.get("twitter").asText());
            }

            ProfileDTO updatedDTO = ProfileMapper.dtoFromProfile(profile);
            profileRepository.save(updatedDTO);
            return getByUserIdToJson(userId);

        } catch (Exception e) {
            throw new ServiceException("Error al actualizar perfil: " + e.getMessage());
        }
    }

    private String safe(String value) {
        return value != null ? value : "";
    }
}
