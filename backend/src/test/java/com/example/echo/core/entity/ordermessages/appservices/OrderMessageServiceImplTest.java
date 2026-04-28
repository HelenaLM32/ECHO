package com.example.echo.core.entity.ordermessages.appservices;

import com.example.echo.core.entity.ordermessages.dto.OrderMessageDTO;
import com.example.echo.core.entity.ordermessages.persistence.OrderMessageRepository;
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
class OrderMessageServiceImplTest {

    @Mock
    private OrderMessageRepository messageRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderMessageServiceImpl service;

    private UserDTO user;
    private OrderDTO order;

    @BeforeEach
    void setUp() {
        user = new UserDTO(1, "buyer@mail.com", "buyer", "hash", true, new HashSet<>());
        order = new OrderDTO(2, 1, 8, 30.0, "PENDING");
    }

    @Test
    void getMessagesByOrderIdReturnsMessagesForParticipant() throws Exception {
        OrderMessageDTO dto = new OrderMessageDTO(1, 2, 1, "hola");
        when(userRepository.findByEmail("buyer@mail.com")).thenReturn(Optional.of(user));
        when(orderRepository.findById(2)).thenReturn(Optional.of(order));
        when(messageRepository.findByOrderIdOrderBySentAtAsc(2)).thenReturn(List.of(dto));

        String result = service.getMessagesByOrderId(2, "buyer@mail.com");

        assertTrue(result.contains("hola"));
    }

    @Test
    void sendMessageThrowsForNonParticipant() {
        UserDTO outsider = new UserDTO(9, "x@mail.com", "x", "h", true, new HashSet<>());
        when(userRepository.findByEmail("x@mail.com")).thenReturn(Optional.of(outsider));
        when(orderRepository.findById(2)).thenReturn(Optional.of(order));

        assertThrows(ServiceException.class, () -> service.sendMessage(2, "{\"content\":\"hola\"}", "x@mail.com"));
    }

    @Test
    void sendMessageAsUserThrowsWhenSenderMissing() {
        assertThrows(ServiceException.class, () -> service.sendMessageAsUser(2, null, "{\"content\":\"hola\"}"));
    }

    @Test
    void sendMessageAsUserCreatesMessage() throws Exception {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(orderRepository.findById(2)).thenReturn(Optional.of(order));
        when(messageRepository.save(any(OrderMessageDTO.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = service.sendMessageAsUser(2, 1, "{\"content\":\"Hola equipo\"}");

        assertTrue(result.contains("Hola equipo"));
        verify(messageRepository).save(any(OrderMessageDTO.class));
    }
}
