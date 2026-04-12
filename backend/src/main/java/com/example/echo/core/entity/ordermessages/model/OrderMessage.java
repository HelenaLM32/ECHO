package com.example.echo.core.entity.ordermessages.model;

import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;

public class OrderMessage {

    private Integer id;
    private Integer orderId;
    private Integer senderId;
    private String  content;

    protected OrderMessage() {}

    public static OrderMessage getInstance(Integer orderId, Integer senderId, String content)
            throws BuildException {
        OrderMessage m = new OrderMessage();
        StringBuilder msg = new StringBuilder();
        if (orderId  == null || orderId  <= 0)        msg.append("orderId inválido; ");
        if (senderId == null || senderId <= 0)        msg.append("senderId inválido; ");
        if (content  == null || content.isBlank())   msg.append("El mensaje no puede estar vacío; ");
        if (content  != null && content.length() > 2000) msg.append("El mensaje no puede superar 2000 caracteres; ");
        if (!msg.isEmpty()) throw new BuildException(msg.toString().trim());
        m.orderId  = orderId;
        m.senderId = senderId;
        m.content  = content.trim();
        return m;
    }

    public Integer getId()       { return id; }
    public Integer getOrderId()  { return orderId; }
    public Integer getSenderId() { return senderId; }
    public String  getContent()  { return content; }
}
