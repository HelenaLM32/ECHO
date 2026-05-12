package com.example.echo.core.entity.items.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import jakarta.persistence.*;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "creator_id", nullable = false)
    private Integer creatorId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "base_price")
    private Double basePrice;

    /**
     * Item type (e.g. "PRODUCT", "SERVICE").
     */
    @Column(name = "item_type", nullable = false)
    private String itemType;

    @Column(name = "category_id")
    private Integer categoryId;

    protected Item() {
    }

    public static Item getInstance(Integer creatorId,
            String title,
            String description,
            Double basePrice,
            String itemType,
            Integer categoryId) throws BuildException {
        Item item = new Item();
        String message = item.itemDataValidation(creatorId, title, description, basePrice, itemType, categoryId);
        if (message.isEmpty()) {
            item.categoryId = categoryId;
            return item;
        }
        throw new BuildException(message);
    }

    protected String itemDataValidation(Integer creatorId,
            String title,
            String description,
            Double basePrice,
            String itemType,
            Integer categoryId) {
        String message = "";

        if (setCreatorId(creatorId) != 0) {
            message += "Creator ID inválido; ";
        }
        if (setTitle(title) != 0) {
            message += "Title inválido; ";
        }
        if (setDescription(description) != 0) {
            message += "Description inválido; ";
        }
        if (setBasePrice(basePrice) != 0) {
            message += "Base price inválido; ";
        }
        if (setItemType(itemType) != 0) {
            message += "Item type inválido; ";
        }

        if (setCategoryId(categoryId) != 0) {
            message += "Category id inválido; ";
        }

        return message.trim();
    }

    // --------------------------------------------------
    // Protected setters
    // --------------------------------------------------
    protected int setCreatorId(Integer creatorId) {
        if (creatorId != null && Check.isPositive(creatorId)) {
            this.creatorId = creatorId;
            return 0;
        }
        return -1;
    }

    protected int setTitle(String title) {
        if (Check.minStringChars(title, 3) && Check.maxStringChars(title, 150)) {
            this.title = title.trim();
            return 0;
        }
        return -1;
    }

    protected int setDescription(String description) {
        if (description == null) {
            this.description = null;
            return 0;
        }
        if (Check.maxStringChars(description, 1000)) {
            this.description = description.trim();
            return 0;
        }
        return -1;
    }

    protected int setBasePrice(Double basePrice) {
        // Price is optional - null or >= 0 is valid
        if (basePrice == null) {
            this.basePrice = null;
            return 0;
        }
        if (basePrice >= 0) {
            this.basePrice = basePrice;
            return 0;
        }
        return -1;
    }

    protected int setItemType(String itemType) {
        if (Check.minStringChars(itemType, 3) && Check.maxStringChars(itemType, 50)) {
            this.itemType = itemType.trim();
            return 0;
        }
        return -1;
    }

    protected int setCategoryId(Integer categoryId) {
        if (categoryId == null) {
            this.categoryId = null;
            return 0;
        }
        if (Check.isPositive(categoryId)) {
            this.categoryId = categoryId;
            return 0;
        }
        return -1;
    }

    // --------------------------------------------------
    // Public getters
    // --------------------------------------------------
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

    @Override
    public String toString() {
        return "Item{id=" + id + ", creatorId=" + creatorId + ", title='" + title + "', basePrice=" + basePrice
                + ", itemType='" + itemType + "', categoryId=" + categoryId + "}";
    }
}
