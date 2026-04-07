package com.example.echo.infrastructure.persistence.jpa;

import com.example.echo.core.entity.categories.dto.CategoryDTO;
import com.example.echo.core.entity.categories.persistence.CategoryRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * JPA repository for CategoryDTO. Extends Spring Data `JpaRepository`
 * and our domain port `CategoryRepository` so it can be injected where needed.
 */
@Repository
public interface JpaCategoryRepository extends JpaRepository<CategoryDTO, Integer>, CategoryRepository {

    Optional<CategoryDTO> findBySlug(String slug);

}
