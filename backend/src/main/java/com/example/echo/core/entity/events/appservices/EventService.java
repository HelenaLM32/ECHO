package com.example.echo.core.entity.events.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;

public interface EventService {
    String getAllToJson() throws ServiceException;

    String getByIdToJson(Integer id) throws ServiceException;

    String getByCreatorIdToJson(Integer creatorId) throws ServiceException;

    String getByVenueIdToJson(Integer venueId) throws ServiceException;

    String createEvent(Integer creatorId, Integer venueId, LocalDateTime startDate,
            LocalDateTime endDate, String title, String description,
            MultipartFile img) throws ServiceException;

    void deleteById(Integer id, Integer requesterId) throws ServiceException;

    String updateEvent(Integer id, Integer requesterId, String title,
            String description, String startDate, String endDate,
            MultipartFile img) throws ServiceException;
}