package com.example.echo.core.entity.follows.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "follows")
@IdClass(FollowId.class)
public class Follow {

    @Id
    @Column(name = "follower_id")
    private Integer followerId;

    @Id
    @Column(name = "following_id")
    private Integer followingId;

    public Follow() {
    }

    public Follow(Integer followerId, Integer followingId) {
        this.followerId = followerId;
        this.followingId = followingId;
    }

    public Integer getFollowerId() {
        return followerId;
    }

    public Integer getFollowingId() {
        return followingId;
    }
}
