package com.example.echo.core.entity.dispute.appservices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
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
import com.example.echo.core.entity.orders.persistence.OrderRepository;
import com.example.echo.core.entity.user.persistence.UserRepository;
import com.example.echo.core.entity.user.dto.UserDTO;
import java.util.List;

@Controller
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
    public String getDisputeByIdToJson(Integer disputeId) throws ServiceException {
        DisputeDTO dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ServiceException("Dispute not found"));

        List<DisputeMessageDTO> messages = messageRepository.findByDisputeIdOrderByCreatedAtAsc(disputeId);
        dispute.setMessages(messages);

        return disputeSerializer().serialize(dispute);
    }

    @Override
    public String getUserDisputesToJson(Integer userId) throws ServiceException {
        validateUserExists(userId);
        List<DisputeDTO> disputes = disputeRepository.findByCreatedByUserId(userId);
        return disputeSerializer().serializeList(disputes);
    }

    @Override
    public String getOpenDisputesToJson() throws ServiceException {
        List<DisputeDTO> disputes = disputeRepository.findByStatus("OPEN");
        return disputeSerializer().serializeList(disputes);
    }

    @Override
    public String addMessageToDisputeFromJson(Integer disputeId, String messageJson, Integer userId)
            throws ServiceException {
        try {
            validateUserExists(userId);

            DisputeDTO dispute = disputeRepository.findById(disputeId)
                    .orElseThrow(() -> new ServiceException("Dispute not found"));

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
    public String closeDisputeFromJson(Integer disputeId, String resolutionJson) throws ServiceException {
        try {
            DisputeDTO dispute = disputeRepository.findById(disputeId)
                    .orElseThrow(() -> new ServiceException("Dispute not found"));

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
    public String getAllDisputesToJson() throws ServiceException {
        try {
            List<DisputeDTO> disputes = disputeRepository.findAll();
            return disputeSerializer().serializeList(disputes);
        } catch (Exception e) {
            throw new ServiceException("Error getting disputes: " + e.getMessage());
        }
    }
}
