package com.example.echo.core.entity.reviews.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateReviewDTO {

    @JsonProperty("orderId")
    private Integer orderId;

    @JsonProperty("score")
    private Integer score;

    @JsonProperty("comment")
    private String comment;

    public Integer getOrderId() { return orderId; }
    public Integer getScore()   { return score; }
    public String  getComment() { return comment; }
}
