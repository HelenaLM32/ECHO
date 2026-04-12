package com.example.echo.core.entity.orders.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.Formula;

@Entity
@Table(name = "orders")
public class OrderDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer id;

    @Column(name = "buyer_id", nullable = false)
    @JsonProperty("buyerId")
    private Integer buyerId;

    @Column(name = "item_id", nullable = false)
    @JsonProperty("itemId")
    private Integer itemId;

    @Column(name = "final_price", nullable = false)
    @JsonProperty("finalPrice")
    private Double finalPrice;

    @Column(nullable = false, length = 50)
    @JsonProperty("status")
    private String status = "PENDING";

    @Formula("(SELECT u.username FROM users u WHERE u.id = buyer_id)")
    @JsonProperty("buyerUsername")
    private String buyerUsername;

    @Formula("(SELECT i.title FROM items i WHERE i.id = item_id)")
    @JsonProperty("itemTitle")
    private String itemTitle;

    @Formula("(SELECT i.creator_id FROM items i WHERE i.id = item_id)")
    @JsonProperty("creatorId")
    private Integer creatorId;

    @Formula("(SELECT u.username FROM users u INNER JOIN items i ON i.creator_id = u.id WHERE i.id = item_id)")
    @JsonProperty("creatorUsername")
    private String creatorUsername;

    protected OrderDTO() {}

    public OrderDTO(Integer id, Integer buyerId, Integer itemId, Double finalPrice, String status) {
        this.id         = id;
        this.buyerId    = buyerId;
        this.itemId     = itemId;
        this.finalPrice = finalPrice;
        this.status     = status != null ? status : "PENDING";
    }

    public Integer getId()             { return id; }
    public Integer getBuyerId()        { return buyerId; }
    public Integer getItemId()         { return itemId; }
    public Double  getFinalPrice()     { return finalPrice; }
    public String  getStatus()         { return status; }
    public String  getBuyerUsername()  { return buyerUsername; }
    public String  getItemTitle()      { return itemTitle; }
    public Integer getCreatorId()      { return creatorId; }
    public String  getCreatorUsername(){ return creatorUsername; }

    public void setStatus(String status) { this.status = status; }
}
