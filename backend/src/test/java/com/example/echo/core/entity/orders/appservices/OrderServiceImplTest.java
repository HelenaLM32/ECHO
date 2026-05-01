package com.example.echo.core.entity.orders.appservices;

import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.items.persistence.ItemRepository;
import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.orders.persistence.OrderRepository;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private OrderServiceImpl service;

    private UserDTO user;

    @BeforeEach
    void setUp() {
        user = new UserDTO(1, "buyer@mail.com", "buyer", "hash", true, new HashSet<>());
    }

    @Test
    void getMyOrdersToJsonMergesBuyerAndCreatorWithoutDuplicates() throws Exception {
        OrderDTO order1 = new OrderDTO(10, 1, 3, 20.0, "PENDING");
        OrderDTO order2 = new OrderDTO(11, 2, 4, 22.0, "PENDING");
        OrderDTO orderDuplicate = new OrderDTO(10, 1, 3, 20.0, "PENDING");

        when(userRepository.findByEmail("buyer@mail.com")).thenReturn(Optional.of(user));
        when(orderRepository.findByBuyerId(1)).thenReturn(List.of(order1));
        when(orderRepository.findByCreatorId(1)).thenReturn(List.of(orderDuplicate, order2));

        String json = service.getMyOrdersToJson("buyer@mail.com");

        assertTrue(json.contains("\"id\":10"));
        assertTrue(json.contains("\"id\":11"));
    }

    @Test
    void getByIdToJsonThrowsWhenUserIsNotParticipant() {
        OrderDTO order = new OrderDTO(9, 2, 3, 10.0, "PENDING");
        when(userRepository.findByEmail("buyer@mail.com")).thenReturn(Optional.of(user));
        when(orderRepository.findById(9)).thenReturn(Optional.of(order));

        ServiceException ex = assertThrows(ServiceException.class, () -> service.getByIdToJson(9, "buyer@mail.com"));
        assertTrue(ex.getMessage().contains("No tienes acceso"));
    }

    @Test
    void createFromJsonUsesItemBasePriceWhenMissingFinalPrice() throws Exception {
        String json = "{\"itemId\":3}";
        ItemDTO item = new ItemDTO(3, 2, "Item", "Desc", 15.5, "SERVICE", null);
        when(userRepository.findByEmail("buyer@mail.com")).thenReturn(Optional.of(user));
        when(itemRepository.findById(3)).thenReturn(Optional.of(item));
        when(orderRepository.save(any(OrderDTO.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = service.createFromJson(json, "buyer@mail.com");

        assertTrue(result.contains("\"finalPrice\":15.5"));
        assertTrue(result.contains("\"status\":\"PENDING\""));
    }

    @Test
    void updateStatusThrowsWhenNotCreator() {
        OrderDTO order = new OrderDTO(9, 1, 3, 10.0, "PENDING");
        when(userRepository.findByEmail("buyer@mail.com")).thenReturn(Optional.of(user));
        when(orderRepository.findById(9)).thenReturn(Optional.of(order));

        ServiceException ex = assertThrows(ServiceException.class,
                () -> service.updateStatus(9, "COMPLETED", "buyer@mail.com"));

        assertTrue(ex.getMessage().contains("Solo el creador"));
    }

    @Test
    void updateStatusByAdminThrowsForInvalidStatus() {
        OrderDTO order = new OrderDTO(9, 1, 3, 10.0, "PENDING");
        when(orderRepository.findById(9)).thenReturn(Optional.of(order));

        assertThrows(ServiceException.class, () -> service.updateStatusByAdmin(9, "INVALID"));
    }

    @Test
    void createForBuyerFromJsonFailsWhenBuyerMissing() {
        String json = "{\"itemId\":3,\"finalPrice\":10}";
        assertThrows(ServiceException.class, () -> service.createForBuyerFromJson(json));
    }
}
