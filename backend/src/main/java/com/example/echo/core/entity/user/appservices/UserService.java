package com.example.echo.core.entity.user.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.dto.UserDTO;

public interface UserService {

    String getAllToJson() throws ServiceException;

    String getByIdToJson(Integer id) throws ServiceException;

    String registerFromJson(String userJson) throws ServiceException;

    String updateFromJson(String userJson) throws ServiceException;

    void deleteById(Integer id) throws ServiceException;

    String loginFromJson(String loginJson) throws ServiceException;

    UserDTO findByEmail(String email) throws ServiceException;

    String addRoleToUserFromJson(String json) throws ServiceException;
}