package com.example.echo.core.entity.profile.appservices;

import org.springframework.web.multipart.MultipartFile;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface ProfileService {
    String getByUserIdToJson(Integer userId) throws ServiceException;

    String getAllToJson() throws ServiceException;

    String updateFromJson(Integer userId, String profileJson) throws ServiceException;

    String updateAvatar(Integer userId, MultipartFile file) throws ServiceException;

    String updateBanner(Integer userId, MultipartFile file) throws ServiceException;
}