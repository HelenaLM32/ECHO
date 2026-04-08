package com.example.echo.core.entity.categories.model;

/**
 * Simple domain model for Category.
 * This is a lightweight POJO used for business validation and logic.
 */
public class Category {

    private Integer id;
    private String name;
    private String slug;
    private String description;
    private String iconUrl;
    private Boolean isActive;

    protected Category() {
    }

    public static Category getInstance(String name,
                                       String slug,
                                       String description,
                                       String iconUrl,
                                       Boolean isActive) {
        Category c = new Category();
        c.name = (name == null) ? null : name.trim();
        c.slug = (slug == null) ? null : slug.trim();
        c.description = description;
        c.iconUrl = iconUrl;
        c.isActive = (isActive == null) ? Boolean.TRUE : isActive;
        return c;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public String getDescription() {
        return description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    @Override
    public String toString() {
        return "Category{id=" + id + ", name='" + name + "', slug='" + slug + "'}";
    }
}
