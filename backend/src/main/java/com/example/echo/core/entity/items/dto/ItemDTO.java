package com.example.echo.core.entity.items.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "items")
public class ItemDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    @JacksonXmlProperty(localName = "id")
    private Integer id;

    @Column(name = "creator_id", nullable = false)
    @JsonProperty("creatorId")
    @JacksonXmlProperty(localName = "creator_id")
    private Integer creatorId;

    @Column(nullable = false, length = 150)
    @JsonProperty("title")
    @JacksonXmlProperty(localName = "title")
    private String title;

    @Column(columnDefinition = "TEXT")
    @JsonProperty("description")
    @JacksonXmlProperty(localName = "description")
    private String description;

    @Column(name = "base_price", nullable = false)
    @JsonProperty("basePrice")
    @JacksonXmlProperty(localName = "base_price")
    private Double basePrice;

    @Column(name = "item_type", nullable = false, length = 50)
    @JsonProperty("itemType")
    @JacksonXmlProperty(localName = "item_type")
    private String itemType;

    @Column(name = "category_id")
    @JsonProperty("categoryId")
    @JacksonXmlProperty(localName = "category_id")
    private Integer categoryId;

    public ItemDTO() {
    }

    public ItemDTO(Integer id,
            Integer creatorId,
            String title,
            String description,
            Double basePrice,
            String itemType,
            Integer categoryId) {
        this.id = id;
        this.creatorId = creatorId;
        this.title = title;
        this.description = description;
        this.basePrice = basePrice;
        this.itemType = itemType;
        this.categoryId = categoryId;
    }

    public Integer getId() {
        return id;
    }

    public Integer getCreatorId() {
        return creatorId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public String getItemType() {
        return itemType;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setCreatorId(Integer creatorId) {
        this.creatorId = creatorId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public String toString() {
        return "ItemDTO{id=" + id + ", creatorId=" + creatorId + ", title='" + title + "', basePrice=" + basePrice
                + ", itemType='" + itemType + "', categoryId=" + categoryId + "}";
    }
}
