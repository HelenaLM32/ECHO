package com.example.echo.core.entity.categories.appservices;

import com.example.echo.core.entity.categories.dto.CategoryDTO;

import java.util.List;
import java.util.Optional;

/**
 * Application service interface for categories.
 */
public interface CategoryService {

    Optional<CategoryDTO> findById(Integer id);

    Optional<CategoryDTO> findBySlug(String slug);

    List<CategoryDTO> findAll();

    CategoryDTO save(CategoryDTO dto);

    void deleteById(Integer id);
}
