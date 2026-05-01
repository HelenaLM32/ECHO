package com.example.echo.infrastructure.persistence.jpa;

import com.example.echo.core.entity.items.dto.ItemProjectDTO;
import com.example.echo.core.entity.items.persistence.ItemProjectRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaItemProjectRepository extends JpaRepository<ItemProjectDTO, Integer>, ItemProjectRepository {

    List<ItemProjectDTO> findByItemCreatorId(Integer creatorId);

    Optional<ItemProjectDTO> findBySlug(String slug);

    @Override
    ItemProjectDTO save(ItemProjectDTO project);

    @Override
    void deleteById(Integer id);

}
