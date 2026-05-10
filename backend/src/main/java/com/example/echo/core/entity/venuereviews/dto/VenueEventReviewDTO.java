package com.example.echo.core.entity.venuereviews.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.Formula;

@Entity
@Table(name = "venue_event_reviews", uniqueConstraints = @UniqueConstraint(columnNames = { "author_id", "target_id",
        "target_type" }))
public class VenueEventReviewDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer id;

    @Column(name = "author_id", nullable = false)
    @JsonProperty("authorId")
    private Integer authorId;

    @Column(name = "target_id", nullable = false)
    @JsonProperty("targetId")
    private Integer targetId;

    @Column(name = "target_type", nullable = false, length = 10)
    @JsonProperty("targetType")
    private String targetType;

    @Column(nullable = false)
    @JsonProperty("score")
    private Integer score;

    @Column(columnDefinition = "TEXT")
    @JsonProperty("comment")
    private String comment;

    @Formula("(SELECT p.public_name FROM profiles p WHERE p.user_id = author_id LIMIT 1)")
    @JsonProperty("authorName")
    private String authorName;

    @Formula("(SELECT p.avatar_url FROM profiles p WHERE p.user_id = author_id LIMIT 1)")
    @JsonProperty("authorAvatarUrl")
    private String authorAvatarUrl;

    public VenueEventReviewDTO() {
    }

    public Integer getId() {
        return id;
    }

    public Integer getAuthorId() {
        return authorId;
    }

    public Integer getTargetId() {
        return targetId;
    }

    public String getTargetType() {
        return targetType;
    }

    public Integer getScore() {
        return score;
    }

    public String getComment() {
        return comment;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getAuthorAvatarUrl() {
        return authorAvatarUrl;
    }

    public void setAuthorId(Integer authorId) {
        this.authorId = authorId;
    }

    public void setTargetId(Integer targetId) {
        this.targetId = targetId;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}