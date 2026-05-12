package com.example.echo.core.entity.dispute.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface DisputeService {

    String createDisputeFromJson(String json, Integer userId) throws ServiceException;

    String getDisputeByIdToJson(Integer disputeId, Integer userId, boolean isAdmin) throws ServiceException;

    String getDisputeByOrderIdToJson(Integer orderId, Integer userId, boolean isAdmin) throws ServiceException;

    String getUserDisputesToJson(Integer userId) throws ServiceException;

    String getOpenDisputesToJson(boolean isAdmin) throws ServiceException;

        String addMessageToDisputeFromJson(Integer disputeId, String messageJson, Integer userId, boolean isAdmin)
            throws ServiceException;

        String closeDisputeFromJson(Integer disputeId, String resolutionJson, Integer userId, boolean isAdmin)
            throws ServiceException;

        String getAllDisputesToJson(boolean isAdmin) throws ServiceException;
}
