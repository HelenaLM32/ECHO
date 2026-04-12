package com.example.echo.core.entity.ordermessages.appservices;

import com.example.echo.core.entity.ordermessages.dto.OrderMessageDTO;
import com.example.echo.core.entity.ordermessages.mappers.OrderMessageMapper;
import com.example.echo.core.entity.ordermessages.persistence.OrderMessageRepository;
import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.orders.persistence.OrderRepository;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializer;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializers;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.SerializersCatalog;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.user.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderMessageServiceImpl implements OrderMessageService {

    @Autowired
    private OrderMessageRepository messageRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @SuppressWarnings("unchecked")
    private Serializer<OrderMessageDTO> serializer() {
        return (Serializer<OrderMessageDTO>) SerializersCatalog.getInstance(Serializers.JSON_ORDER_MESSAGE);
    }

    private UserDTO resolveUser(String email) throws ServiceException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado: " + email));
    }

    private OrderDTO resolveOrder(Integer orderId) throws ServiceException {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ServiceException("Encargo " + orderId + " no encontrado"));
    }

    private void assertParticipant(OrderDTO order, Integer userId) throws ServiceException {
        if (!order.getBuyerId().equals(userId) && !userId.equals(order.getCreatorId())) {
            throw new ServiceException("No tienes acceso a este tablón");
        }
    }

    @Override
    public String getMessagesByOrderId(Integer orderId, String email) throws ServiceException {
        UserDTO user  = resolveUser(email);
        OrderDTO order = resolveOrder(orderId);
        assertParticipant(order, user.getId());
        return serializer().serializeList(messageRepository.findByOrderIdOrderBySentAtAsc(orderId));
    }

    @Override
    public String sendMessage(Integer orderId, String messageJson, String email) throws ServiceException {
        UserDTO user  = resolveUser(email);
        OrderDTO order = resolveOrder(orderId);
        assertParticipant(order, user.getId());

        try {
            OrderMessageDTO dto  = serializer().deserialize(messageJson, OrderMessageDTO.class);
            OrderMessageDTO toSave = new OrderMessageDTO(null, orderId, user.getId(), dto.getContent());
            OrderMessageMapper.messageFromDTO(toSave);
            return serializer().serialize(messageRepository.save(toSave));
        } catch (BuildException e) {
            throw new ServiceException("Mensaje inválido: " + e.getMessage());
        }
    }

    @Override
    public String getMessagesByOrderIdAsAdmin(Integer orderId) throws ServiceException {
        resolveOrder(orderId);
        return serializer().serializeList(messageRepository.findByOrderIdOrderBySentAtAsc(orderId));
    }

    @Override
    public String sendMessageAsUser(Integer orderId, Integer senderId, String messageJson) throws ServiceException {
        if (senderId == null || senderId <= 0) {
            throw new ServiceException("senderId es obligatorio");
        }

        userRepository.findById(senderId)
                .orElseThrow(() -> new ServiceException("Usuario emisor no encontrado"));

        OrderDTO order = resolveOrder(orderId);
        assertParticipant(order, senderId);

        try {
            OrderMessageDTO dto = serializer().deserialize(messageJson, OrderMessageDTO.class);
            OrderMessageDTO toSave = new OrderMessageDTO(null, orderId, senderId, dto.getContent());
            OrderMessageMapper.messageFromDTO(toSave);
            return serializer().serialize(messageRepository.save(toSave));
        } catch (BuildException e) {
            throw new ServiceException("Mensaje inválido: " + e.getMessage());
        }
    }
}
