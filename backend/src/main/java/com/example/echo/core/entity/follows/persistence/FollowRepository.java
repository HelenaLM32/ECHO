package com.example.echo.core.entity.follows.persistence;

import com.example.echo.core.entity.follows.model.Follow;
import com.example.echo.core.entity.follows.model.FollowId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface FollowRepository extends JpaRepository<Follow, FollowId> {

    boolean existsByFollowerIdAndFollowingId(Integer followerId, Integer followingId);

    @Transactional
    void deleteByFollowerIdAndFollowingId(Integer followerId, Integer followingId);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followingId = :userId")
    long countFollowers(@Param("userId") Integer userId);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followerId = :userId")
    long countFollowing(@Param("userId") Integer userId);
}