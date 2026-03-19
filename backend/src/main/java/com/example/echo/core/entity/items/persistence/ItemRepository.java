package com.example.echo.core.entity.items.persistence;

import com.example.echo.core.entity.items.dto.ItemDTO;

import java.util.List;
import java.util.Optional;

public interface ItemRepository {

    Optional<ItemDTO> findById(Integer id);

    List<ItemDTO> findAll();

    List<ItemDTO> findByCreatorId(Integer creatorId);

    ItemDTO save(ItemDTO item);

    void deleteById(Integer id);
}
