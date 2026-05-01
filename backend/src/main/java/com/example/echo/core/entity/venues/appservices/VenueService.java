package com.example.echo.core.entity.venues.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface VenueService {
        String getAllToJson() throws ServiceException;

        String getByIdToJson(Integer id) throws ServiceException;

        String getByManagerIdToJson(Integer managerId) throws ServiceException;

        String createVenue(Integer managerId, String name, String address, Integer capacity,
                        String telefono, String email, String sitioWeb, String horario,
                        List<MultipartFile> images) throws ServiceException;

        String updateVenue(Integer id, Integer managerId, String name, String address,
                        Integer capacity, String telefono, String email, String sitioWeb,
                        String horario, List<MultipartFile> images) throws ServiceException;

        void deleteById(Integer id, Integer requesterId) throws ServiceException;
}