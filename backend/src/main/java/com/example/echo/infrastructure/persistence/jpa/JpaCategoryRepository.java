package com.example.echo.infrastructure.persistence.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.echo.core.entity.categories.dto.CategoryDTO;
import com.example.echo.core.entity.categories.persistence.CategoryRepository;

@Repository
public interface JpaCategoryRepository extends JpaRepository<CategoryDTO, Integer>, CategoryRepository {

    Optional<CategoryDTO> findBySlug(String slug);

}
