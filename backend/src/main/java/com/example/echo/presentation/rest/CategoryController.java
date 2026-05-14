package com.example.echo.presentation.rest;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.echo.core.entity.categories.appservices.CategoryService;
import com.example.echo.core.entity.categories.dto.CategoryDTO;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> all = categoryService.findAll();
        return ResponseEntity.ok(all);
    }
}
