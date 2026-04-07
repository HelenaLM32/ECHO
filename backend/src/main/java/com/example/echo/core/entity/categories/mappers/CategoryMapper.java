package com.example.echo.core.entity.categories.mappers;

import com.example.echo.core.entity.categories.dto.CategoryDTO;
import com.example.echo.core.entity.categories.model.Category;

/**
 * Simple mapper between domain `Category` and JPA `CategoryDTO`.
 * Keeps logic minimal: maps fields one-to-one.
 */
public class CategoryMapper {

    public static Category categoryFromDTO(CategoryDTO dto) {
        if (dto == null) return null;
        return Category.getInstance(dto.getName(), dto.getSlug(), dto.getDescription(), dto.getIconUrl(), dto.getIsActive());
    }

    public static CategoryDTO dtoFromCategory(Category c) {
        if (c == null) return null;
        return new CategoryDTO(c.getId(), c.getName(), c.getSlug(), c.getDescription(), c.getIconUrl(), c.getIsActive());
    }
}
