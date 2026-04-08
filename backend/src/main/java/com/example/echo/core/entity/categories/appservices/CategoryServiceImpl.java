package com.example.echo.core.entity.categories.appservices;

import com.example.echo.core.entity.categories.dto.CategoryDTO;
import com.example.echo.core.entity.categories.persistence.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Simple implementation of `CategoryService` that delegates to the persistence port.
 * Kept intentionally minimal and commented for clarity.
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repository;

    // Spring will inject the JPA repository (which implements CategoryRepository)
    public CategoryServiceImpl(CategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<CategoryDTO> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public Optional<CategoryDTO> findBySlug(String slug) {
        return repository.findBySlug(slug);
    }

    @Override
    public List<CategoryDTO> findAll() {
        return repository.findAll();
    }

    @Override
    public CategoryDTO save(CategoryDTO dto) {
        // Business rules could be added here before saving.
        return repository.save(dto);
    }

    @Override
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
