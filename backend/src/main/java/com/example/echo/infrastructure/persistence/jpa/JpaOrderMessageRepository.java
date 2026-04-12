package com.example.echo.infrastructure.persistence.jpa;

import com.example.echo.core.entity.ordermessages.dto.OrderMessageDTO;
import com.example.echo.core.entity.ordermessages.persistence.OrderMessageRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaOrderMessageRepository
        extends JpaRepository<OrderMessageDTO, Integer>, OrderMessageRepository {

    @Override
    List<OrderMessageDTO> findByOrderIdOrderBySentAtAsc(Integer orderId);
}
