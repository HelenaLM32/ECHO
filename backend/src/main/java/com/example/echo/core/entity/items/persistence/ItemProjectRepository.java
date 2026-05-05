package com.example.echo.core.entity.items.persistence;

import com.example.echo.core.entity.items.dto.ItemProjectDTO;

import java.util.List;
import java.util.Optional;

public interface ItemProjectRepository {

    Optional<ItemProjectDTO> findById(Integer id);

    List<ItemProjectDTO> findAll();

    List<ItemProjectDTO> findAllById(Iterable<Integer> ids);

    List<ItemProjectDTO> findByItemCreatorId(Integer creatorId);

    Optional<ItemProjectDTO> findBySlug(String slug);

    ItemProjectDTO save(ItemProjectDTO project);

    void deleteById(Integer id);
}
