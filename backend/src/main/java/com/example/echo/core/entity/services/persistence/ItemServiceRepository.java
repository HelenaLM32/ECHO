package com.example.echo.core.entity.services.persistence;

import com.example.echo.core.entity.services.model.ItemService;

import java.util.List;

public interface ItemServiceRepository {

    List<ItemService> findByCreatorId(Integer creatorId);

    boolean existsByIdAndCreatorId(Long id, Integer creatorId);

    ItemService save(ItemService itemService);

    void delete(ItemService itemService);

    java.util.Optional<ItemService> findById(Long id);
}