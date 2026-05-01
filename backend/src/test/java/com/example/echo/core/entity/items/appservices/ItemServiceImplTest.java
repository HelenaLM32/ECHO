package com.example.echo.core.entity.items.appservices;

import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.items.persistence.ItemRepository;
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
class ItemServiceImplTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemServiceImpl service;

    private ItemDTO item;

    @BeforeEach
    void setUp() {
        item = new ItemDTO(1, 1, "Servicio", "Desc", 10.0, "SERVICE", null);
    }

    @Test
    void registerFromJsonCreatesItem() throws Exception {
        String json = "{\"creatorId\":1,\"title\":\"Servicio\",\"description\":\"Desc\",\"basePrice\":10,\"itemType\":\"SERVICE\"}";
        when(itemRepository.save(any(ItemDTO.class))).thenReturn(item);

        String result = service.registerFromJson(json);

        assertTrue(result.contains("\"title\":\"Servicio\""));
    }

    @Test
    void getByCreatorIdToJsonThrowsWhenEmpty() {
        when(itemRepository.findByCreatorId(1)).thenReturn(List.of());
        assertThrows(ServiceException.class, () -> service.getByCreatorIdToJson(1));
    }

    @Test
    void getByCreatorIdAndTypeToJsonFiltersByType() throws Exception {
        ItemDTO other = new ItemDTO(2, 1, "Producto", "Desc", 20.0, "PRODUCT", null);
        when(itemRepository.findByCreatorId(1)).thenReturn(List.of(item, other));

        String result = service.getByCreatorIdAndTypeToJson(1, "SERVICE");

        assertTrue(result.contains("Servicio"));
        assertFalse(result.contains("Producto"));
    }

    @Test
    void updateFromJsonThrowsWhenItemMissing() {
        String json = "{\"id\":999,\"creatorId\":1,\"title\":\"Servicio\",\"description\":\"Desc\",\"basePrice\":10,\"itemType\":\"SERVICE\"}";
        when(itemRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ServiceException.class, () -> service.updateFromJson(json));
    }

    @Test
    void loginFromJsonIsUnsupported() {
        assertThrows(UnsupportedOperationException.class, () -> service.loginFromJson("{}"));
    }
}
