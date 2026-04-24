package com.example.echo.core.entity.dispute.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import java.time.LocalDateTime;

public class Dispute {

    private Integer id;
    private Integer orderId;
    private Integer createdByUserId;
    private String reason;
    private String status;
    private String resolution;
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;

    protected Dispute() {
    }

    public static Dispute getInstance(Integer orderId, Integer createdByUserId, String reason) 
            throws BuildException {
        Dispute dispute = new Dispute();
        String message = dispute.validate(orderId, createdByUserId, reason);
        if (message.isEmpty()) {
            dispute.orderId = orderId;
            dispute.createdByUserId = createdByUserId;
            dispute.reason = reason.trim();
            dispute.status = "OPEN";
            dispute.createdAt = LocalDateTime.now();
            return dispute;
        }
        throw new BuildException(message);
    }

    private String validate(Integer orderId, Integer createdByUserId, String reason) {
        String message = "";
        
        if (orderId == null || orderId <= 0) {
            message += "Order ID inválido; ";
        }
        if (createdByUserId == null || createdByUserId <= 0) {
            message += "User ID inválido; ";
        }
        if (!Check.minLength(reason, 10)) {
            message += "La razón debe tener al menos 10 caracteres; ";
        }
        
        return message.trim();
    }

    public Integer getId() {
        return id;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public Integer getCreatedByUserId() {
        return createdByUserId;
    }

    public String getReason() {
        return reason;
    }

    public String getStatus() {
        return status;
    }

    public String getResolution() {
        return resolution;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void closeDispute(String resolution) {
        this.status = "CLOSED";
        this.resolution = resolution;
        this.closedAt = LocalDateTime.now();
    }
}
