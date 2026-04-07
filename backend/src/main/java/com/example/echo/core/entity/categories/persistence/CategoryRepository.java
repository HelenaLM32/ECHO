package com.example.echo.core.entity.categories.persistence;

import com.example.echo.core.entity.categories.dto.CategoryDTO;
import java.util.List;
import java.util.Optional;

/**
 * Port for category persistence. Implementation provided by infrastructure layer (JPA).
 */
public interface CategoryRepository {

    Optional<CategoryDTO> findById(Integer id);

    Optional<CategoryDTO> findBySlug(String slug);

    List<CategoryDTO> findAll();

    CategoryDTO save(CategoryDTO category);

    void deleteById(Integer id);
}
