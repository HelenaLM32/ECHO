package com.example.echo.core.entity.items.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface ItemProjectService {

    String getAllToJson() throws ServiceException;

    String getByCreatorIdToJson(Integer creatorId) throws ServiceException;

    String getByIdToJson(Integer id) throws ServiceException;

    String incrementViewsAndGetByIdToJson(Integer id) throws ServiceException;

    String addCommentAndGetByIdToJson(Integer projectId, Integer userId, String commentText) throws ServiceException;

    String getCommentsByProjectIdToJson(Integer projectId) throws ServiceException;

    String toggleLikeAndGetByIdToJson(Integer projectId, Integer userId) throws ServiceException;

    String registerFromJson(String projectJson) throws ServiceException;

    String updateFromJson(String projectJson) throws ServiceException;

    void deleteById(Integer id) throws ServiceException;
}
