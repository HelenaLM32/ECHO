package com.example.echo.core.entity.profile.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface ProfileService {
    String getByUserIdToJson(Integer userId) throws ServiceException;

    String updateFromJson(Integer userId, String profileJson) throws ServiceException;
}