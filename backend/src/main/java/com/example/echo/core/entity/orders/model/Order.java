package com.example.echo.core.entity.orders.model;

import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class Order {

    private Integer id;
    private Integer buyerId;
    private Integer itemId;
    private Double finalPrice;
    private String status;

    protected Order() {}

    public static Order getInstance(Integer buyerId, Integer itemId, Double finalPrice) throws BuildException {
        Order o = new Order();
        StringBuilder msg = new StringBuilder();
        if (buyerId == null || buyerId <= 0) msg.append("buyerId inválido; ");
        if (itemId == null || itemId <= 0)   msg.append("itemId inválido; ");
        if (finalPrice == null || finalPrice < 0) msg.append("finalPrice inválido; ");
        if (!msg.isEmpty()) throw new BuildException(msg.toString().trim());
        o.buyerId    = buyerId;
        o.itemId     = itemId;
        o.finalPrice = finalPrice;
        o.status     = "PENDING";
        return o;
    }

    public Integer getId()         { return id; }
    public Integer getBuyerId()    { return buyerId; }
    public Integer getItemId()     { return itemId; }
    public Double  getFinalPrice() { return finalPrice; }
    public String  getStatus()     { return status; }
}
