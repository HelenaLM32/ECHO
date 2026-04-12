package com.example.echo.core.entity.orders.mappers;

import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.orders.model.Order;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class OrderMapper {

    public static Order orderFromDTO(OrderDTO dto) throws BuildException {
        if (dto == null) return null;
        return Order.getInstance(dto.getBuyerId(), dto.getItemId(), dto.getFinalPrice());
    }

    public static OrderDTO dtoFromOrder(Order order) {
        if (order == null) return null;
        return new OrderDTO(
                order.getId(),
                order.getBuyerId(),
                order.getItemId(),
                order.getFinalPrice(),
                order.getStatus());
    }
}
