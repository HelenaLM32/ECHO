package com.example.echo.core.entity.follows.appservices;

import com.example.echo.core.entity.follows.model.Follow;
import com.example.echo.core.entity.follows.persistence.FollowRepository;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;
import com.example.echo.core.entity.user.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FollowServiceImpl implements FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void follow(Integer followerId, Integer followingId) throws ServiceException {
        if (followerId == null || followingId == null)
            throw new ServiceException("IDs inválidos");
        if (followerId.equals(followingId))
            throw new ServiceException("No puedes seguirte a ti mismo");

        userRepository.findById(followingId)
                .orElseThrow(() -> new ServiceException("Usuario no encontrado"));

        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followingId))
            throw new ServiceException("Ya sigues a este usuario");

        followRepository.save(new Follow(followerId, followingId));
    }

    @Override
    public void unfollow(Integer followerId, Integer followingId) throws ServiceException {
        if (followerId == null || followingId == null)
            throw new ServiceException("IDs inválidos");
        followRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public boolean isFollowing(Integer followerId, Integer followingId) throws ServiceException {
        if (followerId == null || followingId == null)
            throw new ServiceException("IDs inválidos");
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public long countFollowers(Integer userId) {
        return followRepository.countFollowers(userId);
    }

    @Override
    public long countFollowing(Integer userId) {
        return followRepository.countFollowing(userId);
    }
}