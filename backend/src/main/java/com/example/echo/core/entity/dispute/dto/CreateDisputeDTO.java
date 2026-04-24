package com.example.echo.core.entity.dispute.dto;

public class CreateDisputeDTO {

    private Integer orderId;
    private String reason;

    public CreateDisputeDTO() {
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
