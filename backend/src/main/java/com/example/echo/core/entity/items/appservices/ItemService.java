package com.example.echo.core.entity.items.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface ItemService {

    String getAllToJson() throws ServiceException;

    String getByIdToJson(Integer id) throws ServiceException;

    String registerFromJson(String userJson) throws ServiceException;

    String updateFromJson(String userJson) throws ServiceException;

    void deleteById(Integer id) throws ServiceException;

    String loginFromJson(String loginJson) throws ServiceException;
}