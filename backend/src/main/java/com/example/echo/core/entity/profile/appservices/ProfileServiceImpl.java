package com.example.echo.core.entity.profile.appservices;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.echo.core.entity.profile.dto.ProfileDTO;
import com.example.echo.core.entity.profile.mappers.ProfileMapper;
import com.example.echo.core.entity.profile.persistence.ProfileRepository;
import com.example.echo.core.entity.sharedkernel.appservices.FileStorageService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.echo.core.entity.profile.model.Profile;

@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    ProfileRepository profileRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ObjectMapper mapper;
    @Autowired
    FileStorageService fileStorageService;

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

            Profile model;
            try {
                model = Profile.getInstance(userId, profile.getPublicName());
            } catch (com.example.echo.core.entity.sharedkernel.exceptions.BuildException e) {
                throw new ServiceException("Error de perfil: " + e.getMessage());
            }

            StringBuilder errors = new StringBuilder();

            if (node.has("publicName") && !node.get("publicName").isNull()) {
                String v = node.get("publicName").asText();
                if (model.setPublicName(v) != 0)
                    errors.append("publicName demasiado largo; ");
                else
                    profile.setPublicName(model.getPublicName());
            }
            if (node.has("bio")) {
                String v = node.get("bio").isNull() ? null : node.get("bio").asText();
                if (model.setBio(v) != 0)
                    errors.append("bio demasiado larga; ");
                else
                    profile.setBio(model.getBio());
            }
            if (node.has("location")) {
                String v = node.get("location").isNull() ? null : node.get("location").asText();
                if (model.setLocation(v) != 0)
                    errors.append("location demasiado larga; ");
                else
                    profile.setLocation(model.getLocation());
            }
            if (node.has("linkedin")) {
                String v = node.get("linkedin").isNull() ? null : node.get("linkedin").asText();
                if (model.setLinkedin(v) != 0)
                    errors.append("linkedin demasiado largo; ");
                else
                    profile.setLinkedin(model.getLinkedin());
            }
            if (node.has("instagram")) {
                String v = node.get("instagram").isNull() ? null : node.get("instagram").asText();
                if (model.setInstagram(v) != 0)
                    errors.append("instagram demasiado largo; ");
                else
                    profile.setInstagram(model.getInstagram());
            }
            if (node.has("twitter")) {
                String v = node.get("twitter").isNull() ? null : node.get("twitter").asText();
                if (model.setTwitter(v) != 0)
                    errors.append("twitter demasiado largo; ");
                else
                    profile.setTwitter(model.getTwitter());
            }
            if (node.has("experience")) {
                String v = node.get("experience").isNull() ? null : node.get("experience").asText();
                if (model.setExperience(v) != 0)
                    errors.append("experience demasiado larga; ");
                else
                    profile.setExperience(model.getExperience());
            }
            if (node.has("calendarUrl")) {
                String v = node.get("calendarUrl").isNull() ? null : node.get("calendarUrl").asText();
                if (model.setCalendarUrl(v) != 0)
                    errors.append("calendarUrl demasiado larga; ");
                else
                    profile.setCalendarUrl(model.getCalendarUrl());
            }

            if (!errors.isEmpty())
                throw new ServiceException("Datos inválidos: " + errors.toString().trim());

            profileRepository.save(profile);
            return getByUserIdToJson(userId);

        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error al actualizar perfil: " + e.getMessage());
        }
    }

    @Override
    public String updateAvatar(Integer userId, MultipartFile file) throws ServiceException {
        try {
            UserDTO user = userRepository.findById(userId)
                    .orElseThrow(() -> new ServiceException("Usuario no encontrado"));

            ProfileDTO profile = profileRepository.findByUserId(userId)
                    .orElseGet(() -> ProfileMapper.newProfileForUser(user));

            fileStorageService.delete(profile.getAvatarUrl());

            String url = fileStorageService.store(file, "avatars");
            profile.setAvatarUrl(url);
            profileRepository.save(profile);

            return getByUserIdToJson(userId);
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error al actualizar avatar: " + e.getMessage());
        }
    }

    @Override
    public String updateBanner(Integer userId, MultipartFile file) throws ServiceException {
        try {
            UserDTO user = userRepository.findById(userId)
                    .orElseThrow(() -> new ServiceException("Usuario no encontrado"));

            ProfileDTO profile = profileRepository.findByUserId(userId)
                    .orElseGet(() -> ProfileMapper.newProfileForUser(user));

            fileStorageService.delete(profile.getBannerUrl());

            String url = fileStorageService.store(file, "banners");
            profile.setBannerUrl(url);
            profileRepository.save(profile);

            return getByUserIdToJson(userId);
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error al actualizar banner: " + e.getMessage());
        }
    }
}