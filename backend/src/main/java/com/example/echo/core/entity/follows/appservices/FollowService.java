package com.example.echo.core.entity.follows.appservices;

import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

public interface FollowService {
    void follow(Integer followerId, Integer followingId) throws ServiceException;

    void unfollow(Integer followerId, Integer followingId) throws ServiceException;

    boolean isFollowing(Integer followerId, Integer followingId) throws ServiceException;

    long countFollowers(Integer userId);

    long countFollowing(Integer userId);
}