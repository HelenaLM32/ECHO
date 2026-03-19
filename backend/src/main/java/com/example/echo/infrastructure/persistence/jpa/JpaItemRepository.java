package com.example.echo.infrastructure.persistence.jpa;

import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.items.persistence.ItemRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaItemRepository extends JpaRepository<ItemDTO, Integer>, ItemRepository {

    List<ItemDTO> findByCreatorId(Integer creatorId);

    @Override
    ItemDTO save(ItemDTO item);

    @Override
    void deleteById(Integer id);

    boolean existsById(Integer id);

}
