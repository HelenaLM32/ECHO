package com.example.echo.core.entity.ordermessages.mappers;

import com.example.echo.core.entity.ordermessages.dto.OrderMessageDTO;
import com.example.echo.core.entity.ordermessages.model.OrderMessage;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class OrderMessageMapper {

    public static OrderMessage messageFromDTO(OrderMessageDTO dto) throws BuildException {
        if (dto == null) return null;
        return OrderMessage.getInstance(dto.getOrderId(), dto.getSenderId(), dto.getContent());
    }

    public static OrderMessageDTO dtoFromMessage(OrderMessage msg) {
        if (msg == null) return null;
        return new OrderMessageDTO(msg.getId(), msg.getOrderId(), msg.getSenderId(), msg.getContent());
    }
}
