package com.example.echo.core.entity.orders.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface OrderService {

    String getMyOrdersToJson(String email) throws ServiceException;

    String getByIdToJson(Integer id, String email) throws ServiceException;

    String createFromJson(String orderJson, String email) throws ServiceException;

    String updateStatus(Integer id, String status, String email) throws ServiceException;

    String getAllToJson() throws ServiceException;

    String createForBuyerFromJson(String orderJson) throws ServiceException;

    String updateStatusByAdmin(Integer id, String status) throws ServiceException;
}
