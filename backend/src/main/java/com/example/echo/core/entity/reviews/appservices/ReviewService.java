package com.example.echo.core.entity.reviews.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface ReviewService {

    String createFromJson(String json, Integer authorId) throws ServiceException;

    String getByOrderId(Integer orderId) throws ServiceException;

    String getByReviewedUserId(Integer userId) throws ServiceException;

    String getAverageByReviewedUserId(Integer userId) throws ServiceException;

    String getAllToJson() throws ServiceException;

    String deleteById(Integer reviewId) throws ServiceException;
}
