package com.example.echo.core.entity.dispute.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface DisputeService {

    String createDisputeFromJson(String json, Integer userId) throws ServiceException;

    String getDisputeByIdToJson(Integer disputeId) throws ServiceException;

    String getUserDisputesToJson(Integer userId) throws ServiceException;

    String getOpenDisputesToJson() throws ServiceException;

    String addMessageToDisputeFromJson(Integer disputeId, String messageJson, Integer userId) 
            throws ServiceException;

    String closeDisputeFromJson(Integer disputeId, String resolutionJson) throws ServiceException;

    String getAllDisputesToJson() throws ServiceException;
}
