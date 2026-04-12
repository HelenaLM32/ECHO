package com.example.echo.core.entity.ordermessages.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_messages")
public class OrderMessageDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer id;

    @Column(name = "order_id", nullable = false)
    @JsonProperty("orderId")
    private Integer orderId;

    @Column(name = "sender_id", nullable = false)
    @JsonProperty("senderId")
    private Integer senderId;

    @Column(columnDefinition = "TEXT", nullable = false)
    @JsonProperty("content")
    private String content;

    @CreationTimestamp
    @Column(name = "sent_at", updatable = false)
    @JsonProperty("sentAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime sentAt;

    @Formula("(SELECT u.username FROM users u WHERE u.id = sender_id)")
    @JsonProperty("senderUsername")
    private String senderUsername;

    protected OrderMessageDTO() {}

    public OrderMessageDTO(Integer id, Integer orderId, Integer senderId, String content) {
        this.id       = id;
        this.orderId  = orderId;
        this.senderId = senderId;
        this.content  = content;
    }

    public Integer       getId()             { return id; }
    public Integer       getOrderId()        { return orderId; }
    public Integer       getSenderId()       { return senderId; }
    public String        getContent()        { return content; }
    public LocalDateTime getSentAt()         { return sentAt; }
    public String        getSenderUsername() { return senderUsername; }
}
