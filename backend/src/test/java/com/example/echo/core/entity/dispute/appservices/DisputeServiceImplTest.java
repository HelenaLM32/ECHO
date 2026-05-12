package com.example.echo.core.entity.dispute.appservices;

import com.example.echo.core.entity.dispute.dto.DisputeDTO;
import com.example.echo.core.entity.dispute.dto.DisputeMessageDTO;
import com.example.echo.core.entity.dispute.persistence.DisputeMessageRepository;
import com.example.echo.core.entity.dispute.persistence.DisputeRepository;
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
class DisputeServiceImplTest {

    @Mock
    private DisputeRepository disputeRepository;

    @Mock
    private DisputeMessageRepository messageRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DisputeServiceImpl service;

    private UserDTO user;

    @BeforeEach
    void setUp() {
        user = new UserDTO(1, "u@mail.com", "user", "hash", true, new HashSet<>());
    }

    @Test
    void createDisputeFromJsonCreatesWhenValid() throws Exception {
        String json = "{\"orderId\":9,\"reason\":\"Incidencia suficientemente larga\"}";
        DisputeDTO saved = new DisputeDTO();
        saved.setId(3);
        saved.setOrderId(9);
        saved.setStatus("OPEN");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(orderRepository.findById(9)).thenReturn(Optional.of(new OrderDTO(9, 1, 2, 10.0, "PENDING")));
        when(disputeRepository.findByOrderIdAndStatus(9, "OPEN")).thenReturn(Optional.empty());
        when(disputeRepository.save(any(DisputeDTO.class))).thenReturn(saved);

        String result = service.createDisputeFromJson(json, 1);

        assertTrue(result.contains("\"status\":\"OPEN\""));
    }

    @Test
    void createDisputeFromJsonThrowsWhenOpenDisputeExists() {
        String json = "{\"orderId\":9,\"reason\":\"Incidencia suficientemente larga\"}";
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(orderRepository.findById(9)).thenReturn(Optional.of(new OrderDTO(9, 1, 2, 10.0, "PENDING")));
        when(disputeRepository.findByOrderIdAndStatus(9, "OPEN")).thenReturn(Optional.of(new DisputeDTO()));

        assertThrows(ServiceException.class, () -> service.createDisputeFromJson(json, 1));
    }

    @Test
    void addMessageToDisputeFromJsonThrowsWhenClosed() {
        DisputeDTO closed = new DisputeDTO();
        closed.setOrderId(9);
        closed.setStatus("CLOSED");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(disputeRepository.findById(5)).thenReturn(Optional.of(closed));
        when(orderRepository.findById(9)).thenReturn(Optional.of(new OrderDTO(9, 1, 2, 10.0, "PENDING")));

        assertThrows(ServiceException.class,
            () -> service.addMessageToDisputeFromJson(5, "{\"message\":\"hola\"}", 1, false));
    }

    @Test
    void closeDisputeFromJsonClosesWhenValid() throws Exception {
        DisputeDTO open = new DisputeDTO();
        open.setId(4);
        open.setStatus("OPEN");

        when(disputeRepository.findById(4)).thenReturn(Optional.of(open));
        when(disputeRepository.save(any(DisputeDTO.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = service.closeDisputeFromJson(4, "{\"resolution\":\"Resuelto\"}", 1, true);

        assertTrue(result.contains("\"status\":\"CLOSED\""));
        assertTrue(result.contains("Resuelto"));
    }

    @Test
    void getDisputeByIdToJsonIncludesMessages() throws Exception {
        DisputeDTO dispute = new DisputeDTO();
        dispute.setId(2);
        dispute.setOrderId(9);
        dispute.setStatus("OPEN");
        DisputeMessageDTO message = new DisputeMessageDTO();
        message.setMessage("detalle");

        when(disputeRepository.findById(2)).thenReturn(Optional.of(dispute));
        when(orderRepository.findById(9)).thenReturn(Optional.of(new OrderDTO(9, 1, 2, 10.0, "PENDING")));
        when(messageRepository.findByDisputeIdOrderByCreatedAtAsc(2)).thenReturn(List.of(message));

        String result = service.getDisputeByIdToJson(2, 1, false);

        assertTrue(result.contains("detalle"));
    }
}
