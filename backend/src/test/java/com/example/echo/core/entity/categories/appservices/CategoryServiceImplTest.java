package com.example.echo.core.entity.categories.appservices;

import com.example.echo.core.entity.categories.dto.CategoryDTO;
import com.example.echo.core.entity.categories.persistence.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository repository;

    @InjectMocks
    private CategoryServiceImpl service;

    private CategoryDTO category;

    @BeforeEach
    void setUp() {
        category = new CategoryDTO(1, "Design", "design", "desc", null, true);
    }

    @Test
    void findByIdDelegatesToRepository() {
        when(repository.findById(1)).thenReturn(Optional.of(category));
        Optional<CategoryDTO> result = service.findById(1);
        assertTrue(result.isPresent());
        assertEquals("Design", result.get().getName());
    }

    @Test
    void findBySlugDelegatesToRepository() {
        when(repository.findBySlug("design")).thenReturn(Optional.of(category));
        Optional<CategoryDTO> result = service.findBySlug("design");
        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
    }

    @Test
    void findAllDelegatesToRepository() {
        when(repository.findAll()).thenReturn(List.of(category));
        List<CategoryDTO> result = service.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void saveDelegatesToRepository() {
        when(repository.save(category)).thenReturn(category);
        CategoryDTO result = service.save(category);
        assertEquals("design", result.getSlug());
    }

    @Test
    void deleteByIdDelegatesToRepository() {
        service.deleteById(1);
        verify(repository).deleteById(1);
    }
}
