package com.example.echo.core.entity.profile.appservices;

import com.example.echo.core.entity.profile.dto.ProfileDTO;
import com.example.echo.core.entity.profile.persistence.ProfileRepository;
import com.example.echo.core.entity.sharedkernel.appservices.FileStorageService;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceImplTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private UserRepository userRepository;

    @Spy
    private ObjectMapper mapper = new ObjectMapper();

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private ProfileServiceImpl service;

    private UserDTO user;
    private ProfileDTO profile;

    @BeforeEach
    void setUp() {
        user = new UserDTO(1, "u@mail.com", "user", "hash", true, new HashSet<>());
        profile = new ProfileDTO(2, 1, "User", "bio", "loc", "a.jpg", "b.jpg", null, null, null, "exp");
    }

    @Test
    void getByUserIdToJsonReturnsExistingProfile() throws Exception {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(profileRepository.findByUserId(1)).thenReturn(Optional.of(profile));

        String result = service.getByUserIdToJson(1);

        assertTrue(result.contains("\"userId\":1"));
        assertTrue(result.contains("\"username\":\"user\""));
    }

    @Test
    void getByUserIdToJsonCreatesProfileWhenMissing() throws Exception {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(profileRepository.findByUserId(1)).thenReturn(Optional.empty());
        when(profileRepository.save(any(ProfileDTO.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = service.getByUserIdToJson(1);

        assertTrue(result.contains("\"userId\":1"));
        verify(profileRepository).save(any(ProfileDTO.class));
    }

    @Test
    void updateFromJsonUpdatesFields() throws Exception {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(profileRepository.findByUserId(1)).thenReturn(Optional.of(profile));
        when(profileRepository.save(any(ProfileDTO.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = service.updateFromJson(1, "{\"publicName\":\"Nuevo\",\"location\":\"Madrid\"}");

        assertTrue(result.contains("\"publicName\":\"Nuevo\""));
        assertTrue(result.contains("\"location\":\"Madrid\""));
    }

    @Test
    void updateAvatarStoresAndReturnsUpdatedProfile() throws Exception {
        MultipartFile file = mock(MultipartFile.class);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(profileRepository.findByUserId(1)).thenReturn(Optional.of(profile));
        when(fileStorageService.store(file, "avatars")).thenReturn("https://cdn/avatar.jpg");
        when(profileRepository.save(any(ProfileDTO.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = service.updateAvatar(1, file);

        assertTrue(result.contains("avatar.jpg"));
        verify(fileStorageService).delete("a.jpg");
    }

    @Test
    void updateBannerWrapsStorageErrors() throws Exception {
        MultipartFile file = mock(MultipartFile.class);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(profileRepository.findByUserId(1)).thenReturn(Optional.of(profile));
        when(fileStorageService.store(file, "banners")).thenThrow(new RuntimeException("boom"));

        assertThrows(ServiceException.class, () -> service.updateBanner(1, file));
    }
}
