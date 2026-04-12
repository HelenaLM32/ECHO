package com.example.echo.core.entity.orders.persistence;

import com.example.echo.core.entity.orders.dto.OrderDTO;

import java.util.List;
import java.util.Optional;

public interface OrderRepository {

    Optional<OrderDTO> findById(Integer id);

    List<OrderDTO> findAll();

    List<OrderDTO> findByBuyerId(Integer buyerId);

    List<OrderDTO> findByCreatorId(Integer creatorId);

    OrderDTO save(OrderDTO order);

    void deleteById(Integer id);
}
