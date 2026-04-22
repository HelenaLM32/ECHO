package com.example.echo.core.entity.dispute.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.echo.core.entity.dispute.dto.DisputeDTO;
import java.util.List;
import java.util.Optional;

@Repository
public interface DisputeRepository extends JpaRepository<DisputeDTO, Integer> {

    List<DisputeDTO> findByOrderId(Integer orderId);

    List<DisputeDTO> findByCreatedByUserId(Integer userId);

    List<DisputeDTO> findByStatus(String status);

    Optional<DisputeDTO> findByOrderIdAndStatus(Integer orderId, String status);
}
