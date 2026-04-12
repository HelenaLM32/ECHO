package com.example.echo.infrastructure.persistence.jpa;

import com.example.echo.core.entity.orders.dto.OrderDTO;
import com.example.echo.core.entity.orders.persistence.OrderRepository;
import com.example.echo.core.entity.items.dto.ItemDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaOrderRepository extends JpaRepository<OrderDTO, Integer>, OrderRepository {

    @Override
    List<OrderDTO> findByBuyerId(Integer buyerId);

    @Override
    @Query("SELECT o FROM OrderDTO o WHERE o.itemId IN (SELECT i.id FROM ItemDTO i WHERE i.creatorId = :creatorId)")
    List<OrderDTO> findByCreatorId(@Param("creatorId") Integer creatorId);
}
