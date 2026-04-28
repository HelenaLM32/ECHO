package com.example.echo.core.entity.role.appservices;

import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.persistence.RoleRepository;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleServiceImplTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleServiceImpl service;

    private RoleDTO role;

    @BeforeEach
    void setUp() {
        role = new RoleDTO(1, "ROLEADMIN");
    }

    @Test
    void registerFromJsonCreatesRole() throws Exception {
        when(roleRepository.existsByName("ROLEADMIN")).thenReturn(false);
        when(roleRepository.save(any(RoleDTO.class))).thenReturn(role);

        String result = service.registerFromJson("{\"name\":\"ROLEADMIN\"}");

        assertTrue(result.contains("ROLEADMIN"));
    }

    @Test
    void registerFromJsonThrowsWhenRoleExists() {
        when(roleRepository.existsByName("ROLEADMIN")).thenReturn(true);

        assertThrows(ServiceException.class, () -> service.registerFromJson("{\"name\":\"ROLEADMIN\"}"));
    }

    @Test
    void getByIdToJsonThrowsWhenMissing() {
        when(roleRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ServiceException.class, () -> service.getByIdToJson(99));
    }

    @Test
    void getAllToJsonReturnsList() throws Exception {
        when(roleRepository.findAll()).thenReturn(List.of(role));

        String result = service.getAllToJson();

        assertTrue(result.contains("ROLEADMIN"));
    }

    @Test
    void deleteByIdDeletesWhenExists() throws Exception {
        when(roleRepository.findById(1)).thenReturn(Optional.of(role));

        service.deleteById(1);

        verify(roleRepository).deleteById(1);
    }
}
