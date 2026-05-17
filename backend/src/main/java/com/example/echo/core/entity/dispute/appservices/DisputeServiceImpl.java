package com.example.echo.core.entity.dispute.appservices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializer;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializers;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.SerializersCatalog;
import com.example.echo.core.entity.dispute.dto.DisputeDTO;
import com.example.echo.core.entity.dispute.dto.DisputeMessageDTO;
import com.example.echo.core.entity.dispute.dto.CreateDisputeDTO;
import com.example.echo.core.entity.dispute.dto.CloseDisputeDTO;
import com.example.echo.core.entity.dispute.model.Dispute;
import com.example.echo.core.entity.dispute.model.DisputeMessage;
import com.example.echo.core.entity.dispute.persistence.DisputeRepository;
import com.example.echo.core.entity.dispute.persistence.DisputeMessageRepository;
import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.orders.persistence.OrderRepository;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.core.entity.user.dto.UserDTO;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class DisputeServiceImpl implements DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;

    @Autowired
    private DisputeMessageRepository messageRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @SuppressWarnings("unchecked")
    private Serializer<CreateDisputeDTO> createDisputeSerializer() {
        return (Serializer<CreateDisputeDTO>) SerializersCatalog
                .getInstance(Serializers.JSON_CREATE_DISPUTE);
    }

    @SuppressWarnings("unchecked")
    private Serializer<DisputeDTO> disputeSerializer() {
        return (Serializer<DisputeDTO>) SerializersCatalog.getInstance(Serializers.JSON_DISPUTE);
    }

    @SuppressWarnings("unchecked")
    private Serializer<DisputeMessageDTO> messageSerializer() {
        return (Serializer<DisputeMessageDTO>) SerializersCatalog
                .getInstance(Serializers.JSON_DISPUTE_MESSAGE);
    }

    @SuppressWarnings("unchecked")
    private Serializer<CloseDisputeDTO> closeDisputeSerializer() {
        return (Serializer<CloseDisputeDTO>) SerializersCatalog
                .getInstance(Serializers.JSON_CLOSE_DISPUTE);
    }

    private void validateOrderExists(Integer orderId) throws ServiceException {
        if (!orderRepository.findById(orderId).isPresent()) {
            throw new ServiceException("Order not found: " + orderId);
        }
    }

    private OrderDTO resolveOrder(Integer orderId) throws ServiceException {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ServiceException("Order not found: " + orderId));
    }

    private void assertParticipantOrAdmin(Integer orderId, Integer userId, boolean isAdmin) throws ServiceException {
        if (isAdmin) {
            return;
        }
        OrderDTO order = resolveOrder(orderId);
        boolean isParticipant = userId != null
                && (userId.equals(order.getBuyerId()) || userId.equals(order.getCreatorId()));
        if (!isParticipant) {
            throw new ServiceException("No tienes acceso a esta disputa");
        }
    }

    private DisputeDTO resolveDispute(Integer disputeId) throws ServiceException {
        return disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ServiceException("Dispute not found"));
    }

    private List<DisputeDTO> getDisputesForUser(Integer userId) throws ServiceException {
        Set<Integer> orderIds = new HashSet<>();
        orderRepository.findByBuyerId(userId).forEach(o -> orderIds.add(o.getId()));
        orderRepository.findByCreatorId(userId).forEach(o -> orderIds.add(o.getId()));

        List<DisputeDTO> disputes = new ArrayList<>();
        for (Integer orderId : orderIds) {
            disputes.addAll(disputeRepository.findByOrderId(orderId));
        }
        return disputes;
    }

    private void validateUserExists(Integer userId) throws ServiceException {
        if (!userRepository.findById(userId).isPresent()) {
            throw new ServiceException("User not found: " + userId);
        }
    }

    @Override
    public String createDisputeFromJson(String json, Integer userId) throws ServiceException {
        try {
            validateUserExists(userId);

            CreateDisputeDTO createDTO = createDisputeSerializer().deserialize(json, CreateDisputeDTO.class);
            if (createDTO == null || createDTO.getOrderId() == null || createDTO.getReason() == null) {
                throw new ServiceException("Invalid dispute payload");
            }

            validateOrderExists(createDTO.getOrderId());
            assertParticipantOrAdmin(createDTO.getOrderId(), userId, false);

            if (disputeRepository.findByOrderIdAndStatus(createDTO.getOrderId(), "OPEN").isPresent()) {
                throw new ServiceException("There is already an open dispute for this order");
            }

            Dispute dispute = Dispute.getInstance(createDTO.getOrderId(), userId, createDTO.getReason());

            DisputeDTO dto = new DisputeDTO();
            dto.setOrderId(dispute.getOrderId());
            dto.setCreatedByUserId(dispute.getCreatedByUserId());
            dto.setReason(dispute.getReason());
            dto.setStatus(dispute.getStatus());
            dto.setCreatedAt(dispute.getCreatedAt());

            UserDTO creator = userRepository.findById(userId).orElse(null);
            if (creator != null) {
                dto.setCreatedByUsername(creator.getUsername());
            }

            DisputeDTO saved = disputeRepository.save(dto);
            return disputeSerializer().serialize(saved);
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error creating dispute: " + e.getMessage());
        }
    }

    @Override
    public String getDisputeByIdToJson(Integer disputeId, Integer userId, boolean isAdmin) throws ServiceException {
        DisputeDTO dispute = resolveDispute(disputeId);
        assertParticipantOrAdmin(dispute.getOrderId(), userId, isAdmin);

        List<DisputeMessageDTO> messages = messageRepository.findByDisputeIdOrderByCreatedAtAsc(disputeId);
        dispute.setMessages(messages);

        return disputeSerializer().serialize(dispute);
    }

    @Override
    public String getDisputeByOrderIdToJson(Integer orderId, Integer userId, boolean isAdmin) throws ServiceException {
        assertParticipantOrAdmin(orderId, userId, isAdmin);

        List<DisputeDTO> disputes = disputeRepository.findByOrderId(orderId);
        if (disputes == null || disputes.isEmpty()) {
            throw new ServiceException("Dispute not found");
        }

        DisputeDTO selected = disputes.stream()
                .filter(d -> "OPEN".equalsIgnoreCase(d.getStatus()))
                .findFirst()
                .orElseGet(() -> disputes.stream().max(Comparator.comparing(DisputeDTO::getId)).orElse(disputes.get(0)));

        List<DisputeMessageDTO> messages = messageRepository.findByDisputeIdOrderByCreatedAtAsc(selected.getId());
        selected.setMessages(messages);
        return disputeSerializer().serialize(selected);
    }

    @Override
    public String getUserDisputesToJson(Integer userId) throws ServiceException {
        validateUserExists(userId);
        List<DisputeDTO> disputes = getDisputesForUser(userId);
        return disputeSerializer().serializeList(disputes);
    }

    @Override
    public String getOpenDisputesToJson(boolean isAdmin) throws ServiceException {
        if (!isAdmin) {
            throw new ServiceException("No autorizado");
        }
        List<DisputeDTO> disputes = disputeRepository.findByStatus("OPEN");
        return disputeSerializer().serializeList(disputes);
    }

    @Override
    public String addMessageToDisputeFromJson(Integer disputeId, String messageJson, Integer userId, boolean isAdmin)
            throws ServiceException {
        try {
            validateUserExists(userId);

            DisputeDTO dispute = resolveDispute(disputeId);
            assertParticipantOrAdmin(dispute.getOrderId(), userId, isAdmin);

            if ("CLOSED".equals(dispute.getStatus())) {
                throw new ServiceException("Cannot add messages to a closed dispute");
            }

            DisputeMessageDTO msgDTO = messageSerializer().deserialize(messageJson, DisputeMessageDTO.class);
            if (msgDTO == null || msgDTO.getMessage() == null || msgDTO.getMessage().isBlank()) {
                throw new ServiceException("Invalid message payload");
            }

            DisputeMessage msg = DisputeMessage.getInstance(disputeId, userId, msgDTO.getMessage());

            DisputeMessageDTO saved = new DisputeMessageDTO();
            saved.setDisputeId(msg.getDisputeId());
            saved.setUserId(msg.getUserId());
            saved.setMessage(msg.getMessage());
            saved.setCreatedAt(msg.getCreatedAt());

            UserDTO user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                saved.setUsername(user.getUsername());
            }

            DisputeMessageDTO result = messageRepository.save(saved);
            return messageSerializer().serialize(result);
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error adding message: " + e.getMessage());
        }
    }

    @Override
    public String closeDisputeFromJson(Integer disputeId, String resolutionJson, Integer userId, boolean isAdmin)
            throws ServiceException {
        try {
            DisputeDTO dispute = resolveDispute(disputeId);

            if (!isAdmin) {
                throw new ServiceException("No autorizado");
            }

            if ("CLOSED".equals(dispute.getStatus())) {
                throw new ServiceException("Dispute is already closed");
            }

            CloseDisputeDTO closeDTO = closeDisputeSerializer().deserialize(resolutionJson, CloseDisputeDTO.class);
            if (closeDTO == null || closeDTO.getResolution() == null || closeDTO.getResolution().isBlank()) {
                throw new ServiceException("Resolution is required");
            }

            dispute.setStatus("CLOSED");
            dispute.setResolution(closeDTO.getResolution());
            dispute.setClosedAt(java.time.LocalDateTime.now());

            DisputeDTO saved = disputeRepository.save(dispute);
            return disputeSerializer().serialize(saved);
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException("Error closing dispute: " + e.getMessage());
        }
    }

    @Override
    public String getAllDisputesToJson(boolean isAdmin) throws ServiceException {
        try {
            if (!isAdmin) {
                throw new ServiceException("No autorizado");
            }
            List<DisputeDTO> disputes = disputeRepository.findAll();
            return disputeSerializer().serializeList(disputes);
        } catch (Exception e) {
            throw new ServiceException("Error getting disputes: " + e.getMessage());
        }
    }
}
