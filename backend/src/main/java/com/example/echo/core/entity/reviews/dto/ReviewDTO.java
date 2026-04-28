package com.example.echo.core.entity.reviews.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.Formula;

@Entity
@Table(name = "reviews")
public class ReviewDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer id;

    @Column(name = "order_id", nullable = false)
    @JsonProperty("orderId")
    private Integer orderId;

    @Column(name = "author_id", nullable = false)
    @JsonProperty("authorId")
    private Integer authorId;

    @Column(nullable = false)
    @JsonProperty("score")
    private Integer score;

    @Column(columnDefinition = "TEXT")
    @JsonProperty("comment")
    private String comment;

    @Formula("(SELECT u.username FROM users u WHERE u.id = author_id)")
    @JsonProperty("authorUsername")
    private String authorUsername;

    @Formula("(SELECT i.creator_id FROM items i INNER JOIN orders o ON o.item_id = i.id WHERE o.id = order_id LIMIT 1)")
    @JsonProperty("reviewedUserId")
    private Integer reviewedUserId;

    @Formula("(SELECT o.buyer_id FROM orders o WHERE o.id = order_id LIMIT 1)")
    @JsonProperty("buyerId")
    private Integer buyerId;

    public ReviewDTO() {}

    public Integer getId()             { return id; }
    public Integer getOrderId()        { return orderId; }
    public Integer getAuthorId()       { return authorId; }
    public Integer getScore()          { return score; }
    public String  getComment()        { return comment; }
    public String  getAuthorUsername() { return authorUsername; }
    public Integer getReviewedUserId() { return reviewedUserId; }
    public Integer getBuyerId()        { return buyerId; }

    public void setOrderId(Integer orderId)   { this.orderId = orderId; }
    public void setAuthorId(Integer authorId) { this.authorId = authorId; }
    public void setScore(Integer score)       { this.score = score; }
    public void setComment(String comment)    { this.comment = comment; }
}
