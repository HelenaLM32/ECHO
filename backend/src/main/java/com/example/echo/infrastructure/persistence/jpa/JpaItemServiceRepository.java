package com.example.echo.infrastructure.persistence.jpa;

import com.example.echo.core.entity.services.model.ItemService;
import com.example.echo.core.entity.services.persistence.ItemServiceRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaItemServiceRepository extends JpaRepository<ItemService, Long>, ItemServiceRepository {

    List<ItemService> findByCreatorId(Integer creatorId);

    boolean existsByIdAndCreatorId(Long id, Integer creatorId);
}