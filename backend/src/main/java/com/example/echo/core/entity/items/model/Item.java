package com.example.echo.core.entity.items.model;

import com.example.echo.core.entity.domainservices.validations.Check;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;


public class Item {

  
    private Integer id;

    private Integer creatorId;

    private String title;

    private String description;

    private Double basePrice;

    /** Item type (e.g. "PRODUCT", "SERVICE"). */
    private String itemType;

    /** Optional category id (nullable). */
    private Integer categoryId;

    // Protected so only the package (and subclasses) can instantiate directly.
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

    /**
     * Validates all input fields and returns a concatenated message of failures (empty if OK).
     */
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

        // categoryId is optional: when provided it must be positive
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
        if (basePrice != null && Check.isPositive(basePrice)) {
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
        return "Item{id=" + id + ", creatorId=" + creatorId + ", title='" + title + "', basePrice=" + basePrice +
                ", itemType='" + itemType + "', categoryId=" + categoryId + "}";
    }
}
