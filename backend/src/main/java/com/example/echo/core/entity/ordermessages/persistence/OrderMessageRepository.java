package com.example.echo.core.entity.ordermessages.persistence;

import com.example.echo.core.entity.ordermessages.dto.OrderMessageDTO;

import java.util.List;
import java.util.Optional;

public interface OrderMessageRepository {

    List<OrderMessageDTO> findByOrderIdOrderBySentAtAsc(Integer orderId);

    Optional<OrderMessageDTO> findById(Integer id);

    OrderMessageDTO save(OrderMessageDTO message);
}
