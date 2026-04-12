package com.example.echo.core.entity.ordermessages.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface OrderMessageService {

    String getMessagesByOrderId(Integer orderId, String email) throws ServiceException;

    String sendMessage(Integer orderId, String messageJson, String email) throws ServiceException;

    String getMessagesByOrderIdAsAdmin(Integer orderId) throws ServiceException;

    String sendMessageAsUser(Integer orderId, Integer senderId, String messageJson) throws ServiceException;
}
