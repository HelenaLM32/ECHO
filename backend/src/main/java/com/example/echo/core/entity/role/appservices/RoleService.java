package com.example.echo.core.entity.role.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface RoleService {

    String getAllToJson() throws ServiceException;

    String getByIdToJson(Integer id) throws ServiceException;

    String registerFromJson(String roleJson) throws ServiceException;

    String updateFromJson(String roleJson) throws ServiceException;

    void deleteById(Integer id) throws ServiceException;
}
