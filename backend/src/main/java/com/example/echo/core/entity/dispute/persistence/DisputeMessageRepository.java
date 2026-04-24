package com.example.echo.core.entity.dispute.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.echo.core.entity.dispute.dto.DisputeMessageDTO;
import java.util.List;

@Repository
public interface DisputeMessageRepository extends JpaRepository<DisputeMessageDTO, Integer> {

    List<DisputeMessageDTO> findByDisputeIdOrderByCreatedAtAsc(Integer disputeId);

    List<DisputeMessageDTO> findByUserId(Integer userId);
}
