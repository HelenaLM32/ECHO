package com.example.echo.core.entity.orders.appservices;

import com.example.echo.core.entity.items.persistence.ItemRepository;
import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.orders.mappers.OrderMapper;
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

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private static final List<String> ALLOWED_STATUSES = List.of("PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED");

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @SuppressWarnings("unchecked")
    private Serializer<OrderDTO> serializer() {
        return (Serializer<OrderDTO>) SerializersCatalog.getInstance(Serializers.JSON_ORDER);
    }

    private UserDTO resolveUser(String email) throws ServiceException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado: " + email));
    }

    private OrderDTO resolveOrder(Integer id) throws ServiceException {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Encargo " + id + " no encontrado"));
    }

    private void assertParticipant(OrderDTO order, Integer userId) throws ServiceException {
        if (!order.getBuyerId().equals(userId) && !userId.equals(order.getCreatorId())) {
            throw new ServiceException("No tienes acceso a este encargo");
        }
    }

    private String normalizeStatus(String status) throws ServiceException {
        String normalized = status == null ? "PENDING" : status.trim().toUpperCase();
        if (!ALLOWED_STATUSES.contains(normalized)) {
            throw new ServiceException("Estado inválido: " + status);
        }
        return normalized;
    }

    @Override
    public String getMyOrdersToJson(String email) throws ServiceException {
        UserDTO user = resolveUser(email);
        List<OrderDTO> asBuyer   = orderRepository.findByBuyerId(user.getId());
        List<OrderDTO> asCreator = orderRepository.findByCreatorId(user.getId());

        List<OrderDTO> combined = new ArrayList<>(asBuyer);
        asCreator.stream()
                .filter(o -> combined.stream().noneMatch(b -> b.getId().equals(o.getId())))
                .forEach(combined::add);

        return serializer().serializeList(combined);
    }

    @Override
    public String getByIdToJson(Integer id, String email) throws ServiceException {
        UserDTO user  = resolveUser(email);
        OrderDTO order = resolveOrder(id);
        assertParticipant(order, user.getId());
        return serializer().serialize(order);
    }

    @Override
    public String createFromJson(String orderJson, String email) throws ServiceException {
        UserDTO buyer = resolveUser(email);
        try {
            OrderDTO dto = serializer().deserialize(orderJson, OrderDTO.class);

            if (dto.getFinalPrice() == null) {
                ItemDTO item = itemRepository.findById(dto.getItemId())
                        .orElseThrow(() -> new ServiceException("Item no encontrado"));
                dto = new OrderDTO(null, buyer.getId(), dto.getItemId(), item.getBasePrice(), "PENDING");
            } else {
                dto = new OrderDTO(null, buyer.getId(), dto.getItemId(), dto.getFinalPrice(), "PENDING");
            }

            OrderMapper.orderFromDTO(dto); 
            return serializer().serialize(orderRepository.save(dto));
        } catch (BuildException e) {
            throw new ServiceException("Datos de encargo inválidos: " + e.getMessage());
        }
    }

    @Override
    public String updateStatus(Integer id, String status, String email) throws ServiceException {
        UserDTO user  = resolveUser(email);
        OrderDTO order = resolveOrder(id);

        if (!user.getId().equals(order.getCreatorId())) {
            throw new ServiceException("Solo el creador puede cambiar el estado del encargo");
        }

        order.setStatus(normalizeStatus(status));
        return serializer().serialize(orderRepository.save(order));
    }

    @Override
    public String getAllToJson() throws ServiceException {
        return serializer().serializeList(orderRepository.findAll());
    }

    @Override
    public String createForBuyerFromJson(String orderJson) throws ServiceException {
        try {
            OrderDTO dto = serializer().deserialize(orderJson, OrderDTO.class);

            if (dto.getBuyerId() == null || dto.getBuyerId() <= 0) {
                throw new ServiceException("buyerId es obligatorio");
            }

            userRepository.findById(dto.getBuyerId())
                    .orElseThrow(() -> new ServiceException("Buyer no encontrado"));

            ItemDTO item = itemRepository.findById(dto.getItemId())
                    .orElseThrow(() -> new ServiceException("Item no encontrado"));

            Double finalPrice = dto.getFinalPrice() == null ? item.getBasePrice() : dto.getFinalPrice();
            String status = normalizeStatus(dto.getStatus());

            OrderDTO toSave = new OrderDTO(null, dto.getBuyerId(), dto.getItemId(), finalPrice, status);
            OrderMapper.orderFromDTO(toSave);
            return serializer().serialize(orderRepository.save(toSave));
        } catch (BuildException e) {
            throw new ServiceException("Datos de encargo inválidos: " + e.getMessage());
        }
    }

    @Override
    public String updateStatusByAdmin(Integer id, String status) throws ServiceException {
        OrderDTO order = resolveOrder(id);
        order.setStatus(normalizeStatus(status));
        return serializer().serialize(orderRepository.save(order));
    }
}
