package com.example.echo.core.entity.events.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface EventService {
        String getAllToJson() throws ServiceException;

        String getByIdToJson(Integer id) throws ServiceException;

        String getByCreatorIdToJson(Integer creatorId) throws ServiceException;

        String getByVenueIdToJson(Integer venueId) throws ServiceException;

        String createEvent(Integer creatorId, Integer venueId, LocalDateTime startDate,
                        LocalDateTime endDate, String title, String description,
                        BigDecimal precio, String categoria, String linkEntradas,
                        MultipartFile img) throws ServiceException;

        String updateEvent(Integer id, Integer requesterId, String title,
                        String description, String startDate, String endDate,
                        BigDecimal precio, String categoria, String linkEntradas,
                        MultipartFile img) throws ServiceException;

        String updateEvent(Integer id, Integer requesterId, String title,
                        String description, String startDate, String endDate,
                        BigDecimal precio, String categoria, String linkEntradas,
                        MultipartFile img, boolean removeImg, boolean removePrice) throws ServiceException;

        void deleteById(Integer id, Integer requesterId) throws ServiceException;
}