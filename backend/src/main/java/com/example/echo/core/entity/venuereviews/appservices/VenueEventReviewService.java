package com.example.echo.core.entity.venuereviews.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface VenueEventReviewService {
    String create(String json, Integer authorId) throws ServiceException;

    String getByTarget(Integer targetId, String targetType) throws ServiceException;

    String getAverage(Integer targetId, String targetType) throws ServiceException;

    String deleteById(Integer reviewId, Integer requesterId) throws ServiceException;
}