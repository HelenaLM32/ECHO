package com.example.echo.core.entity.dispute.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import java.time.LocalDateTime;

public class DisputeMessage {

    private Integer id;
    private Integer disputeId;
    private Integer userId;
    private String message;
    private LocalDateTime createdAt;

    protected DisputeMessage() {
    }

    public static DisputeMessage getInstance(Integer disputeId, Integer userId, String message) 
            throws BuildException {
        DisputeMessage msg = new DisputeMessage();
        String validation = msg.validate(disputeId, userId, message);
        if (validation.isEmpty()) {
            msg.disputeId = disputeId;
            msg.userId = userId;
            msg.message = message.trim();
            msg.createdAt = LocalDateTime.now();
            return msg;
        }
        throw new BuildException(validation);
    }

    private String validate(Integer disputeId, Integer userId, String message) {
        String result = "";
        
        if (disputeId == null || disputeId <= 0) {
            result += "Dispute ID inválido; ";
        }
        if (userId == null || userId <= 0) {
            result += "User ID inválido; ";
        }
        if (!Check.minLength(message, 1)) {
            result += "El mensaje no puede estar vacío; ";
        }
        
        return result.trim();
    }

    public Integer getId() {
        return id;
    }

    public Integer getDisputeId() {
        return disputeId;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
